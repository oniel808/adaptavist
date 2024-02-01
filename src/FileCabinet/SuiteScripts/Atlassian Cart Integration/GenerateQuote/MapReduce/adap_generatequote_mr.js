/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/runtime', 'N/record', 'N/cache',
    '../../Library/SQL/adap_sql_library.js', '../../Atlassian/api/lib/cart.js', '../../Library/integrator/integrator.js', '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../../Library/calculations/calculations.js',
    '../../Library/Items/netsuiteItem.js', '../../Library/NotifAndErrorMessage/adap_notif_error_msg.js', '../../Library/NotifAndErrorMessage/adap_notif_error_msg_for_cs.js',
    '../../Library/quotePayload/adap_lib_quote_payload.js', '../../Library/NotifAndErrorMessage/adap_notif_error_msg.js'
],
    (runtime, record, cache,
        libSuiteQL, libCart, libIntegrator, libMapper, libCalculations,
        libNetsuiteItem, libNotifAndErrorMsg, libNotifAndErrorMsgCs,
        cartDetailPayloadLib, libErrorMessageAndNotif) => {

        const SCRIPT_PARAM_ESTIMATE_ID = libMapper.generateQuoteMR.params.estimate;
        const SCRIPT_PARAM_MAC_ACCOUNT = libMapper.generateQuoteMR.params.mac;
        const SCRIPT_PARAM_CART_ID = libMapper.generateQuoteMR.params.cartid;
        const SCRIPT_PARAM_ERROR_HANDLER = libMapper.generateQuoteMR.params.errorHandler;
        const ATL_CART_STATUS_QUOTED = 'QUOTED';
        const KEY_INTEGRATION = 'adap_hamlet';
        const QUOTE_STATUS_QUOTED = 3;
        const REFRESH_STATUS_DONE = 'DONE_GENERATE_QUOTE';
        const REFRESH_STATUS_FAILED = 'FAILED_GENERATE_QUOTE';
        const METHOD_ADD_ITEMS = 'additems';
        const CONFIGURED_ATLASSIAN_CART = 'atlassianCart';
        const CONFIGURED_ATLASSIAN_CART_ITEM = 'atlassianCartItem';
        const objScript = runtime.getCurrentScript();
        const OPEN_CART_STATUS = 1;
        let intMacAccount = 1;
        const OBJESTIMATEFIELDS = libMapper.estimateFields.fields

        const getInputData = (inputContext) => {

            const intEstimate = objScript.getParameter({ name: SCRIPT_PARAM_ESTIMATE_ID });
            const intMac = objScript.getParameter({ name: SCRIPT_PARAM_MAC_ACCOUNT });
            const intCartId = objScript.getParameter({ name: SCRIPT_PARAM_CART_ID });
            var scriptCache = cache.getCache({ name: 'mr_error_handler_cache' });
            scriptCache.remove({ key: 'errorMessage' });
            intMacAccount = intMac
            let arrCarts = [];
            let arrAtlassianCartResult = libSuiteQL.search({
                type: 'getEstCartsGenerateQuoteMR',
                params: {
                    estid: intEstimate,
                    cartid: intCartId != 'undefined' ? ('AND id = ' + intCartId) : ''
                }
            });

            var objEstimateRecord = record.load({
                type: record.Type.ESTIMATE,
                id: intEstimate,
                isDynamic: false
            });
            objEstimateRecord.setValue({
                fieldId: OBJESTIMATEFIELDS.errorMessages.id,
                value: ''
            });
            var strGenerateStatus = objEstimateRecord.getValue({
                fieldId: OBJESTIMATEFIELDS.refreshQuoteStatus.id
            });
            strGenerateStatus = strGenerateStatus.replace('START', '')
            objEstimateRecord.setValue({
                fieldId: OBJESTIMATEFIELDS.refreshQuoteStatus.id,
                value: strGenerateStatus + arrAtlassianCartResult.length
            });
            try {
                for (const cart of arrAtlassianCartResult) {
                    libCart.configureRecord({
                        type: CONFIGURED_ATLASSIAN_CART,
                        method: 'update',
                        id: cart.cartid,
                        data: {
                            cartMrStatus: strGenerateStatus
                        }
                    });
                }
            } catch (e) {
                log.debug('getinput error ', e)
            }
            objEstimateRecord.save();

            if (arrAtlassianCartResult.length) {
                let arrCartLineItems = [];
                let arrCartID = arrAtlassianCartResult.map((obj) => obj.cartid);
                if (arrCartID.length > 0) {
                    arrCartLineItems = libSuiteQL.search({
                        type: 'getEstCartItemGenerateQuoteMR',
                        params: {
                            carts: arrCartID
                        }
                    });
                }

                log.debug('arrCartLineItems', arrCartLineItems);

                arrAtlassianCartResult.forEach(function (cart) {
                    let objCart = cart;
                    objCart.items = arrCartLineItems.map((cartItem) => {
                        if (cartItem.cartid == cart.cartid) {
                            return { ...cartItem };
                        }
                    }).filter(function (el) { return el != null; });
                    arrCarts.push(objCart);
                });
            }
            log.debug('getInputData | arrCarts', arrCarts);
            return arrCarts;
        }
        const map = (mapContext) => {
            log.debug('map | mapContext', mapContext)
            const intEstimate = objScript.getParameter({ name: SCRIPT_PARAM_ESTIMATE_ID });
            const intMac = objScript.getParameter({ name: SCRIPT_PARAM_MAC_ACCOUNT });
            var isValidForGeneratingQuote = true;
            var strErrorMessage = ''
            try {
                let objCart = JSON.parse(mapContext.value);
                log.debug('map | objCart 1', objCart)
                let { uuid, cartid, pdflink, cartname } = objCart;
                log.debug('map | objCart 2', objCart)
                let objNewCart = {
                    header: { ...{ cartname, uuid, cartid } },
                    itemLines: []
                };
                objNewCart.header.status = QUOTE_STATUS_QUOTED;
                log.debug('map | objNewCart', objNewCart);

                var objCartDetailPayload = cartDetailPayloadLib.getPayload({ estId: intEstimate, mac: intMac });
                objCartDetailPayload.payload.uuid = uuid;

                log.debug('map | objCartDetailPayload', objCartDetailPayload);
                var objCartDetailResponse = libIntegrator.integrate({
                    method: 'post',
                    mac: intMac,
                    path: libMapper.integrator.PATH_CART_DETAILS,
                    integration: 'adap_hamlet',
                    param: JSON.stringify(objCartDetailPayload.payload)
                });
                log.debug('map | objCartDetailResponse', objCartDetailResponse);

                strCartDetails = libErrorMessageAndNotif.getGenerateQuoteError(objCartDetailResponse, objCartDetailPayload.payload)
                log.debug('map | strCartDetails', strCartDetails)
                if (strCartDetails.httpcode == 500 || strCartDetails.httpcode == 400) {
                    isValidForGeneratingQuote = false
                }

                if (isValidForGeneratingQuote) {
                    let objToOrderResponse = libIntegrator.integrate({
                        method: 'post',
                        mac: intMacAccount,
                        path: libMapper.integrator.PATH_CART_TOORDER,
                        param: JSON.stringify({
                            "cartID": objCart.uuid,
                        }),
                        integration: KEY_INTEGRATION
                    });
                    log.debug('map | objCart.uuid',  objCart.uuid)
                    log.debug('map | objToOrderResponse', objToOrderResponse)


                    let objOrderResponse = libIntegrator.integrate({
                        method: 'get',
                        mac: intMacAccount,
                        path: libMapper.integrator.PATH_CART_GET,
                        urlParam: objCart.uuid,
                        integration: KEY_INTEGRATION
                    });
                    if (objOrderResponse.status == ATL_CART_STATUS_QUOTED) {
                        let arrItemMapById = objOrderResponse.items.map((orderItems, index) => {
                            log.debug('orderItems', orderItems)
                            return objCart.items.map((cartItem) => {
                                log.debug('cartItem', cartItem)
                                if (orderItems.id == cartItem.orderlineid) {
                                    return { ...cartItem, index };
                                }
                            }).filter(function (el) { return el != null; })[0];
                        });
                        if (!objToOrderResponse.orderId) {
                            let urlID = (objOrderResponse.quoteNumber) ? objOrderResponse.quoteNumber.split('-')[1] : '';
                            objToOrderResponse.orderId = objOrderResponse.quoteNumber;
                            if (!pdflink) {
                                objToOrderResponse.links = { quoteLink: "https://my.atlassian.com/billing/pdfrest?id=" + urlID };
                            } else {
                                objToOrderResponse.links = { quoteLink: pdflink }
                            }
                        }
                        log.debug('objToOrderResponse, ', objToOrderResponse)

                        let objQuotedCart = libIntegrator.integrate({
                            method: 'get',
                            mac: intMacAccount,
                            path: libMapper.integrator.PATH_GET_QUOTE,
                            urlParam: objToOrderResponse.orderId.split('-')[1],
                            integration: KEY_INTEGRATION
                        });
                        objNewCart.originalData = { ...objQuotedCart };
                        objNewCart.generateQuoteResponse = objToOrderResponse;

                        log.debug('objQuotedCart', objQuotedCart)
                        for (let field in objQuotedCart) {
                            if (field != "orderItems") {
                                objNewCart.header[field] = objQuotedCart[field];
                            }
                        }

                        objQuotedCart.orderItems.forEach((orderItems, indexOrder) => {
                            let orderSEN = (orderItems.supportEntitlementNumber) ? orderItems.supportEntitlementNumber.split('-')[1] : '';
                            arrItemMapById.forEach((item) => {
                                log.debug('arrItemMapById | item', item)
                                if (item) {
                                    if (item.sen && orderSEN == item.sen) {
                                        objCartItem = { ...item, ...orderItems };
                                        objNewCart.itemLines.push({ ...item, ...orderItems, supportEntitlementNumber: orderSEN });
                                    } else if (indexOrder == item.index) {
                                        objNewCart.itemLines.push({ ...item, ...orderItems, supportEntitlementNumber: orderSEN });
                                    }
                                }
                            });
                        });
                        objNewCart.originalDraftData = JSON.stringify(objOrderResponse);
                        objNewCart.originalData = JSON.stringify(objNewCart.originalData);
                        mapContext.write(objNewCart.header.cartid, objNewCart);
                    } else {
                        setFailedCarts({ cartid })
                        strErrorMessage = libNotifAndErrorMsgCs.objMessages.mapReduceMessage.expiredAtlCart.message
                    }
                } else {
                    setFailedCarts({ cartid })
                    strErrorMessage = libNotifAndErrorMsgCs.objMessages.mapReduceMessage.expiredAtlCart.message
                }
                setFailedMessage({ cartid, intEstimate, message: strErrorMessage })
                log.debug('map stage done!', strErrorMessage);
            } catch (e) {
                log.debug('map | error', e);
                strErrorMessage = e.message
                setFailedMessage({ cartid, intEstimate, message: strErrorMessage })
            }
        }
        const setFailedCarts = (options) => {
            record.submitFields({
                type: libMapper.atlassianCart.id,
                id: options.cartid,
                values: {
                    [libMapper.atlassianCart.fields.cartMrStatus.id]: 'FAILED_TO_GENERATE'
                }
            });
        }

        const setFailedMessage = (options) => {
            log.debug('setFailedMessage', options)
            const { cartid, intEstimate, message } = options
            if (message) {
                var scriptCache = cache.getCache({ name: 'mr_error_handler_cache' });
                var strErrorMessage = scriptCache.get({ key: 'errorMessage' }) || '';
                log.debug('strErrorMessage message', strErrorMessage)
                strErrorMessage = (strErrorMessage != 'undefined' ? strErrorMessage : "") + libNotifAndErrorMsg.setFailedMessage({
                    cartId: cartid,
                    estid: intEstimate,
                    message: message,
                    textOnly: true
                });
                scriptCache.put({ key: 'errorMessage', value: strErrorMessage });
                var strErrorMessage2 = scriptCache.get({ key: 'errorMessage' }) || '';
                log.debug('map strErrorMessage2', strErrorMessage2);
            }
        }

        const reduce = (reduceContext) => {
            let objCart = JSON.parse(reduceContext.values[0] || '{}');
            let arrQuoteItems = libCart.plotQuotedCart({
                items: objCart.itemLines,
                totalTax: objCart.header.totalTax
            });
            log.debug('reduce | arrQuoteItems 1', arrQuoteItems);

            arrQuoteItems.forEach((item, index) => {
                log.debug('arrQuoteItems[index]', arrQuoteItems[index])
                var objQuoteItem = libCalculations.atlassianCartItemCalculation({
                    item: arrQuoteItems[index]
                });

                objQuoteItem.id = objQuoteItem.orderlineid;

                log.debug('objQuoteItem', objQuoteItem)

                libCart.configureRecord({
                    type: CONFIGURED_ATLASSIAN_CART_ITEM,
                    id: objQuoteItem.cartitemid,
                    data: objQuoteItem,
                    method: 'update'
                });
            });
            log.debug('reduce | arrQuoteItems 2', arrQuoteItems);

            var objSummary = libCalculations.atlassianCartSummaryCalculation({ items: arrQuoteItems });
            log.debug('reduce | atlassianCartSummaryCalculation', objSummary);

            let objConsolidateQuote = {
                ...objCart.header,
                orderItems: arrQuoteItems
            };
            log.debug('reduce | objConsolidateQuote', objConsolidateQuote);
            var objReduceData = {}
            try {
                objReduceData = {
                    cartId: objCart.header.cartid,
                    originalCartName: objCart.header.cartname,
                    quoteId: objCart.generateQuoteResponse.orderId,
                    quoteLink: objCart.generateQuoteResponse.links.quoteLink,
                    quoteDataJson: objCart.originalData,
                    originalDraftData: objCart.originalDraftData,
                    quoteJsonModified: objConsolidateQuote,
                    isQuoteUpdated: true,
                    status: QUOTE_STATUS_QUOTED,
                    generateDate: new Date(),
                    ...objSummary
                }
                log.debug('reduce | objReduceData', objReduceData);
            } catch (e) {
                log.debug('reduce | objReduceData ERROR', e);

            }

            var cartId = libCart.configureRecord({
                type: CONFIGURED_ATLASSIAN_CART,
                method: 'update',
                id: objReduceData.cartId,
                data: objReduceData
            });
            log.debug('CONFIGURED_ATLASSIAN_CART | id', cartId)
            const intEstimate = objScript.getParameter({ name: SCRIPT_PARAM_ESTIMATE_ID });
            reduceContext.write(intEstimate, objReduceData);
        }

        const summarize = (summaryContext) => {
            const intEstimate = objScript.getParameter({ name: SCRIPT_PARAM_ESTIMATE_ID });
            let arrCartItems = [];
            try {

                summaryContext.output.iterator().each(function (key, value) {
                    let objResult = JSON.parse(value) || '{}';
                    log.debug('objResult', objResult);
                    libCart.configureRecord({
                        type: CONFIGURED_ATLASSIAN_CART,
                        method: 'update',
                        id: objResult.cartId,
                        data: {
                            cartMrStatus: '',
                            status: QUOTE_STATUS_QUOTED
                        }
                    });
                    objResult.quoteJsonModified.orderItems.forEach((item) => {
                        log.debug('objResult.quoteJsonModified item', item);
                        arrCartItems.push(item);
                    });
                    return true
                });

                var scriptCache = cache.getCache({ name: 'mr_error_handler_cache' });
                var strErrorMessage = scriptCache.get({ key: 'errorMessage' });
                log.debug('strErrorMessage try', strErrorMessage);
                let intRecordID = libCart.configureRecord({
                    type: 'estimateFields',
                    data: arrCartItems,
                    removeLines: [],
                    option: {
                        estid: intEstimate,
                        refreshQuoteStatus: REFRESH_STATUS_DONE,
                        errorMessages: strErrorMessage
                    },
                    method: METHOD_ADD_ITEMS,
                    id: intEstimate,
                    cf: libMapper.customForms.estimate
                });
                log.debug('Summarize | Estimate ', intRecordID);

                log.debug('Summarize | Completed');
            } catch (e) {

                log.debug('SUMMARY | ERROR ', e);

                let objEstimateRecordResult = libSuiteQL.search({
                    type: 'getEstimate',
                    params: {
                        id: intEstimate,
                    }
                });
                log.debug('objEstimateRecordResult', objEstimateRecordResult[0].tranidw)

                var scriptCache = cache.getCache({ name: 'mr_error_handler_cache' });
                var strErrorMessage = scriptCache.get({ key: 'errorMessage' });
                log.debug('strErrorMessage', strErrorMessage);

                strErrorMessage += libNotifAndErrorMsg.setFailedMessage({
                    cartId: '',
                    estid: intEstimate,
                    message: e.message,
                    tranid: objEstimateRecordResult[0].tranid,
                    textOnly: true
                })

                record.submitFields({
                    type: 'estimate',
                    id: intEstimate,
                    values: {
                        custbody_adap_atl_refresh_status: REFRESH_STATUS_FAILED,
                        custbody_adap_fail_reason: strErrorMessage
                    }
                });

            }
        }


        return { getInputData, map, reduce, summarize }

    });
