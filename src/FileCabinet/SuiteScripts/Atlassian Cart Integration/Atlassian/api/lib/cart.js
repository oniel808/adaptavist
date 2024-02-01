/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/format', 'N/runtime', 'N/task', 'N/file',
    '../../../Library/integrator/integrator.js', '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../../../Library/htmllib/moment/momentjs.js',
    '../../../Opportunity/UserEvent/lib/ada_ue_helper.js', '../../../Library/Items/netsuiteItem.js',
    '../../../Library/quotePayload/adap_lib_quote_payload.js', '../../../Library/calculations/calculations.js',
    '../../../Library/NotifAndErrorMessage/adap_notif_error_msg.js', '../../../Library/TechnicalContact/adap_lib_tech_contact.js',
    '../../../Library/SQL/adap_sql_library.js',
    '../../../Library/elapsedTime/elapsedTimeMonitor.js',
    '../../MapReduce/lib/adap_save_draft_lib.js'],
    (record, format, runtime, task, file,
        integrator, libMapper, moment,
        libMaintenancePeriod, libNetsuiteItem,
        cartDetailPayloadLib, libCalculations,
        libErrorMessageAndNotif, libTechContact,
        libSuitesQl,
        libElapsedTime,
        libSaveDraft) => {

        const SUBLISTID = 'item';
        const METHOD_CREATE = 'create';
        const METHOD_ADDITEMS = 'additems';
        const METHOD_UPDATE = 'update';
        const OBJSAVEDRAFTMROPTIONS = libMapper.mrSaveDraft;

        const create = (option) => {
            return integrator.integrate({
                mac: option.mac,
                method: 'get',
                path: libMapper.integrator.PATH_CART_NEW,
                integration: 'adap_hamlet'
            });
        }

        const add = (option) => {
            var objReturn;
            var currentCart = integrator.integrate({
                mac: option.mac,
                method: 'post',
                path: libMapper.integrator.PATH_CART_ADD,
                integration: 'adap_hamlet',
                param: option.data
            });

            if (option.estid != 'null' && option.cartid == '') {
                uuid = JSON.parse(option.data).cartID
                uuid = libMapper.isEmpty(uuid)
                if (uuid != false) {
                    record.submitFields({
                        type: record.Type.ESTIMATE,
                        id: option.estid,
                        values: {
                            custbody_adap_atlassian_uuid: uuid
                        }
                    })
                }
            }

            objReturn = plotCurrentCart({ option, currentCart });
            return objReturn;
        }

        const addRenewalItem = (option) => {
            data = JSON.parse(option.data)
            var objPayload = {
                "data": {
                    "accountChanges": [{
                        "accountChangeOption": data.item
                    }]
                },
                "cartID": data.uuid,
            }
            var currentCart = integrator.integrate({
                method: 'post',
                mac: option.mac,
                path: libMapper.integrator.PATH_CART_ADDRENEWALITEM,
                integration: 'adap_hamlet',
                param: JSON.stringify(objPayload)
            });

            if (option.estid != 'null' && option.cartid == '') {
                record.submitFields({
                    type: record.Type.ESTIMATE,
                    id: option.estid,
                    values: {
                        custbody_adap_atlassian_uuid: data.uuid || ''
                    }
                })
            }

            objReturn = plotCurrentCart({ option, currentCart });
            return objReturn;
        }

        const addUpgradeItem = (option) => {
            data = JSON.parse(option.data);
            var licenseType = option.licenseType;
            if (!licenseType) {
                if (data.item.productKey.includes('data-center') || data.item.productDescription.toUpperCase().includes('DATA CENTER')) {
                    licenseType = 'Datacenter'
                } else {
                    licenseType = 'Server'
                }
            }

            var objPayload = {
                "data": {
                    "accountChanges": [{
                        "accountChangeOption": data.item
                    }]
                },
                "cartID": data.uuid,
                "type": licenseType
            }
            var currentCart = integrator.integrate({
                method: 'post',
                mac: option.mac,
                path: libMapper.integrator.PATH_CART_ADDUPGRADEITEM,
                integration: 'adap_hamlet',
                param: JSON.stringify(objPayload)
            });

            if (option.estid != 'null' && option.cartid == '') {
                record.submitFields({
                    type: record.Type.ESTIMATE,
                    id: option.estid,
                    values: {
                        custbody_adap_atlassian_uuid: data.uuid || ''
                    }
                })
            }

            objReturn = plotCurrentCart({ option, currentCart })
            return objReturn
        }

        const get = (option) => {
            var currentCart = integrator.integrate({
                mac: option.mac,
                method: 'get',
                path: libMapper.integrator.PATH_CART_GET,
                urlParam: option.search,
                integration: 'adap_hamlet'
            });
            return plotCurrentCart({ option, currentCart })
        }

        const remove = (option) => {
            var currentCart = integrator.integrate({
                method: 'post',
                mac: option.mac,
                path: libMapper.integrator.PATH_CART_REMOVE,
                integration: 'adap_hamlet',
                param: option.data
            });
            return plotCurrentCart({ option, currentCart });
        }

        const toOrder = (option) => {
            return integrator.integrate({
                method: 'post',
                path: libMapper.integrator.PATH_CART_TOORDER,
                integration: 'adap_hamlet',
                param: option.param
            });
        }

        const saveDraft = (option) => {
            var objReturn = {};
            var intEstId = option.estid;
            objEstimateDetails = JSON.parse(option.estimateDetails || '{}');
            option = { ...option, ...objEstimateDetails, isEstimateNew: Object.keys(objEstimateDetails).length > 0 };
            var intUniqueId = new Date().getTime();
            var strCartUniqueId = '';
            let isCartLessThan50Items = false

            if (option.cartUniqueId) {
                var arrFindCartEstimate = libSuitesQl.search({
                    type: 'findCartEstimate',
                    params: {
                        cartUniqueId: option.cartUniqueId
                    }
                });
                strCartUniqueId = option.cartUniqueId;
                if (arrFindCartEstimate.length) {
                    intEstId = arrFindCartEstimate[0].id;
                }
                if (intEstId) {
                    var objEstimateRecord = record.load({
                        type: record.Type.ESTIMATE,
                        id: intEstId,
                        isDynamic: false
                    });
                    objEstimateRecord.setValue({ fieldId: libMapper.estimateFields.fields.cartIdentifier.id, value: '' });
                    objEstimateRecord.save();
                }
            } else {
                strCartUniqueId = "cart_" + intUniqueId;
                option.uuid = option.search;
                option.withResponse = true;
                option.cartResponse = get(option);
                option.summary = JSON.parse(option.summary || '{}');
                option.cartLines = JSON.parse(option.cartLines || '{}');

                if (option.cartLines.length < 50) {
                    option = libSaveDraft.createCartRecord(option);
                    for (const cartItems of option.cartLines) {
                        option.mapContext = cartItems;
                        option = libSaveDraft.createCartItemRecords(option);
                    }
                    option.EstRemoveLines = libSaveDraft.removeNonExistingCartItem(option);
                    option.cartIdentifier = strCartUniqueId;
                    intEstId = libSaveDraft.createUpdateEstimateRecord(option);
                    isCartLessThan50Items = true
                } else {
                    let intFileId = file.create({
                        name: strCartUniqueId,
                        fileType: file.Type.PLAINTEXT,
                        contents: JSON.stringify(option),
                        folder: OBJSAVEDRAFTMROPTIONS.folderId
                    }).save();
                    if (intFileId >= 0) {
                        var objMrTask = task.create({
                            taskType: task.TaskType.MAP_REDUCE,
                            scriptId: OBJSAVEDRAFTMROPTIONS.scriptId,
                            deploymentId: OBJSAVEDRAFTMROPTIONS.deployment,
                            params: {
                                [OBJSAVEDRAFTMROPTIONS.params.file]: intFileId,
                                [OBJSAVEDRAFTMROPTIONS.params.uniqueId]: strCartUniqueId
                            }
                        });
                        objMrTask.submit();
                    }
                }
            }
            objReturn = {
                status: 'success',
                msg: '',
                cartUniqueId: strCartUniqueId,
                estimate: intEstId,
                httpcode: 200,
                cf: libMapper.customForms.estimate,
                forceRedirect: isCartLessThan50Items
            };

            return objReturn;
        }

        const plotCurrentCart = (option) => {
            var currentCart = option.currentCart;
            var response = {};
            const arrItems = currentCart.items;
            var arrCartItems = [];

            if (option.option.cartId) {
                arrCartItems = libSuitesQl.search({
                    type: 'getCartItems',
                    params: {
                        cartId: option.option.cartId
                    }
                })
            }

            option = option.option;
            response.httpcode = currentCart.httpcode;
            response.msg = currentCart.msg || undefined;
            response.items = [];

            var arrDiscountsRules = libCalculations.getDiscountRules({ items: arrItems })

            if (response.httpcode == 200) {
                for (const [index, item] of arrItems.entries()) {
                    var objDiscounts = libCalculations.discountsOrder({
                        items: item.discountDetails,
                        discountRules: arrDiscountsRules
                    });
                    response.items.push({
                        ...item,
                        ...objDiscounts,
                        num: index + 1,
                        productKey: item.productDetails.productKey,
                        productName: item.productDetails.productDescription,
                        tier: item.productDetails.editionDescription +
                            (item.maintenanceMonths ? ' (' + item.maintenanceMonths + ' Months)' : ''),
                        tierNumber: item.productDetails.unitCount,
                        avstTotal: item.totalIncTax - item.totalTax,
                        id: item.id.toString(),
                        senNumber: item.accountId ? item.accountId.toString() : '',
                        licenseType: item.productDetails.productDescription,
                        discounts: item.discountDetails,
                        generateDate: item.purchaseOrderNumber,
                        purchaseOrderNumber: item.purchaseOrderNumber,
                        listPrice: (item.totalIncTax + item.discountAmount + item.creditAmount) - item.totalTax,
                    });
                    var objItem = response.items[index];

                    var arrLicenses = JSON.parse(option.noMaintenanceMonths || '[]');

                    if (arrLicenses.length) {
                        var intNoMonthIndx = arrLicenses.findIndex((obj) => obj.sen == objItem.accountId);
                        if (intNoMonthIndx >= 0) {
                            objLicense = arrLicenses[intNoMonthIndx];
                            objItem.listPrice = objLicense.amount;
                        }
                    }

                    if (objItem.description.toUpperCase().includes('UPGRADE') && objItem.productDetails.saleType == 'NEW') {
                        objItem.productDetails.saleType = "NEW UPGRADE"
                    }

                    var fltCustomerDiscountRate = 0;
                    if (arrCartItems.length) {
                        var itemIndx = arrCartItems.findIndex((obj) => obj.id == item.id);
                        fltCustomerDiscountRate = arrCartItems[itemIndx] ? arrCartItems[itemIndx].itemdiscountpercent : 0;
                    }

                    objItem.customerDiscountRate = fltCustomerDiscountRate;
                    objItem.customerDiscountAmount = objItem.customerDiscountAmount || 0;
                    objItem.totalDiscount = objItem.totalDiscount || 0;
                    objItem.newListPrice = objItem.listPrice - objItem.creditAmount;
                    objItem.avstTotal = objItem.listPrice - objItem.creditAmount - objItem.avstDiscountAmount;
                    objItem.avstTotal = libCalculations.toFixNumber(objItem.avstTotal);
                    objItem.customerPrice = objItem.newListPrice - objItem.customerDiscountAmount;
                    objItem.margin = objItem.customerPrice - objItem.avstTotal;
                    // objItem.discountitem = 341;
                }
            }
            response.quoteDataJson = option.withResponse ? JSON.stringify(currentCart) : undefined
            return response;
        }

        const configureRecord = (option) => {
            var intConfigureRecordStart = libElapsedTime.elapsedTime()

            const ESTIMATE_TYPE = 'estimateFields'
            const RATE_FIELD = 'rate';
            const AMOUNT_FIELD = 'amount';
            const CURRENCY_FIELD = 'currency'
            const TRANDATE_FIELD = 'trandate'
            const CURRENCYSYMBOL_FIELD = 'currencysymbol'
            var objScript = runtime.getCurrentScript();
            let maptype = option.type;
            let data = option.data;
            let intIDReturn;
            let objRecord;
            let intCurrencyBuffer;
            var intLoadingRecordStart = libElapsedTime.elapsedTime();
            if (option.method == METHOD_CREATE || (option.method == METHOD_ADDITEMS && (option.option.estid == 'null' || !option.option.estid))) {
                objRecord = record.create({
                    type: libMapper[maptype].id,
                    isDynamic: true,
                });
            } else if (option.method == METHOD_UPDATE || (option.method == METHOD_ADDITEMS && (option.option.estid != 'null' || option.option.estid))) { //|| option.method == METHOD_ADDITEMS)

                var objDataRec = {
                    type: libMapper[maptype].id,
                    id: option.id,
                    values: {},
                    defaultValues: {},
                    isDynamic: true
                }
                if (option.method == METHOD_ADDITEMS) {
                    objDataRec.defaultValues.cf = libMapper.customForms.estimate
                }
                objRecord = record.load(objDataRec);
            } else if (option.method == 'addedToEstimate') {
                var objDataRec = {
                    type: libMapper[maptype].id,
                    id: option.id,
                    values: {
                        'custrecord_adap_atl_isaddedtoest': true,
                    },
                    option: {
                        ignoreMandatoryFields: true
                    }
                }
                if (option.cf) {
                    objDataRec.values.cf = option.cf
                }
                return record.submitFields(objDataRec);
            } else if (option.method == 'addEstimateToCart') {
                return record.submitFields({
                    type: libMapper[maptype].id,
                    id: option.id,
                    values: {
                        [libMapper[maptype].fields.cartEstimate.id]: option.estimate,
                        isinactive: false
                    },
                    option: {
                        ignoreMandatoryFields: true
                    }
                });
            } else if (option.method == 'delete') {
                return record.delete({
                    type: libMapper[maptype].id,
                    id: option.id,
                })
            }
            libElapsedTime.elapsedTime({ title: 'intLoadingRecordStart', start: intLoadingRecordStart });


            let objFieldIds = libMapper[maptype].fields;

            //add bodyfield values
            var objHeaderToBeSet = {}
            var intSettingBodyFieldsStart = libElapsedTime.elapsedTime();
            for (const fieldkey in objFieldIds) {
                var dataValue = maptype == ESTIMATE_TYPE ? option.option[fieldkey] : data[fieldkey]
                let field = objFieldIds[fieldkey]
                let fieldType = ''
                if (typeof dataValue == 'undefined' ||
                    typeof dataValue == 'null' ||
                    typeof dataValue == 'NaN' ||
                    dataValue == 'undefined' ||
                    dataValue == 'null' ||
                    dataValue == 'NaN' ||
                    dataValue == null ||
                    dataValue == undefined ||
                    dataValue == NaN
                ) {
                    if (field.default) {
                        dataValue = field.default
                    } else {
                        continue
                    }
                }
                fieldType += field.type

                if (fieldType == 'date') {
                    fieldType = 'text'
                    momentDateTime = moment(dataValue).utc().format('MM/DD/YYYY hh:mm:ss a')
                    dateTime = format.parse({ value: momentDateTime, type: format.Type.DATETIME })
                    dataValue = dateTime
                } else if (fieldType == 'checkbox') {
                    fieldType = 'value'
                } else if (fieldType == 'url') {
                    fieldType = 'value';
                    if (dataValue) {
                        dataValue = 'https://' + dataValue + '/'
                    } else {
                        dataValue = ''
                    }
                }

                let objValueSetter = {
                    fieldId: field.id,
                    [fieldType]: dataValue
                }

                if (fieldType == 'text') {
                    objRecord.setText(objValueSetter)
                } else {
                    objRecord.setValue(objValueSetter)
                }
                objHeaderToBeSet[field.id] = dataValue
            }
            libElapsedTime.elapsedTime({ title: 'intSettingBodyFieldsStart', start: intSettingBodyFieldsStart });
            //add sublist values
            if (option.method == METHOD_ADDITEMS) {
                if (maptype == ESTIMATE_TYPE) {
                    libCalculations.setCurrencyRateBuffer({
                        record: objRecord,
                        fieldId: CURRENCY_FIELD
                    });
                    intCurrencyBuffer = objRecord.getValue(libMapper.estimateFields.fields.currencyBuffer.id);
                }
                let strTrandate = objRecord.getValue(TRANDATE_FIELD);
                let strCurrencyCode = objRecord.getValue(CURRENCYSYMBOL_FIELD);
                let objTransactionDate = strTrandate ? new Date(strTrandate) : new Date();
                let intCurrencyRate = libCalculations.currencyExchange({
                    to: strCurrencyCode,
                    date: objTransactionDate
                });
                let intUSDCurrencyRate = libCalculations.currencyExchange({
                    from: strCurrencyCode,
                    date: objTransactionDate
                });
                objRecord.setValue(libMapper.estimateFields.fields.usdConversion.id, intCurrencyRate);
                objRecord.setValue(libMapper.estimateFields.fields.toUsdConversion.id, intUSDCurrencyRate);
                //update ship and bill address before setting lines
                var intUpdateShipAndBillAddressStart = libElapsedTime.elapsedTime();
                libMaintenancePeriod.updateShipAndBillAddress(objRecord, true);
                libElapsedTime.elapsedTime({ title: 'updateShipAndBillAddress', start: intUpdateShipAndBillAddressStart });

                var intLineSettingStart = libElapsedTime.elapsedTime();

                var sublistItemFields = libMapper[maptype].sublist.item;
                log.debug('option.data', option.data);
                for (const items of option.data) {
                    var intLineItem = objRecord.findSublistLineWithValue({
                        sublistId: SUBLISTID,
                        fieldId: libMapper[maptype].sublist.item.cartitemid.id,
                        value: items.cartitemid,
                    });
                    if (intLineItem < 0) {
                        objRecord.selectNewLine({ sublistId: SUBLISTID });
                    } else {
                        objRecord.selectLine({ sublistId: SUBLISTID, line: intLineItem });
                    }
                    hasItemId = true;
                    var arrLogItem = [];
                    var objItemToBeSet = {};
                    for (const field in sublistItemFields) {
                        var value = items[field];
                        var objField = { ...sublistItemFields[field] };
                        if (typeof value == 'undefined' ||
                            typeof value == 'null' ||
                            value == 'undefined' ||
                            value == 'null' ||
                            value == null ||
                            value == undefined ||
                            sublistItemFields[field].inputType == 'special'
                        ) {
                            if (field.default) {
                                value = field.default
                            } else if (sublistItemFields[field].inputType == 'special') {
                                var objNewListPrice = {
                                    sublistId: SUBLISTID,
                                    fieldId: sublistItemFields.newListPrice.id,
                                    line: intLineItem
                                };

                                var newListPrice_value = objRecord.getCurrentSublistValue(objNewListPrice);
                                objNewListPrice.value = newListPrice_value;

                                objNewListPrice.fieldId = sublistItemFields.newListPrice_rate.id;
                                objRecord.setCurrentSublistValue(objNewListPrice);

                                objNewListPrice.fieldId = sublistItemFields.newListPrice_amount.id;
                                objRecord.setCurrentSublistValue(objNewListPrice);
                            } else {
                                continue
                            }
                        }

                        if (objField.type == 'currency' && objField.inputType != 'special') {
                            value = libCalculations.toFixNumber(value / intUSDCurrencyRate);
                            if (objField.hasBuffer && strCurrencyCode != libMapper.currency.usd.text && maptype == ESTIMATE_TYPE) {
                                var fltBufferedValue = libCalculations.applyCurrencyBuffer({
                                    value: value,
                                    currencyBuffer: intCurrencyBuffer
                                })
                                value = libCalculations.toFixNumber(fltBufferedValue);
                            }
                            objField.type = 'value';
                        } else if (objField.type == 'date') {
                            objField.type = 'text'
                            momentDate = moment(value).utc().format('M/D/YYYY')
                            value = momentDate
                        } else if (objField.type == 'url') {
                            objField.type = 'value';
                            if (value) {
                                value = 'https://' + value + '/'
                            } else {
                                value = ''
                            }
                        }

                        if (objField.id) {
                            var objSublistValue = {
                                sublistId: SUBLISTID,
                                fieldId: objField.id,
                                value: value,
                                text: value
                            };
                            objItemToBeSet[objSublistValue.fieldId] = objSublistValue.value;
                            if (objSublistValue.fieldId == 'item' && !objSublistValue.value) {
                                hasItemId = false;
                            }
                            if (objField.type == 'value') {
                                objRecord.setCurrentSublistValue(objSublistValue);
                            } else {
                                objRecord.setCurrentSublistText(objSublistValue);
                            }
                        }
                        arrLogItem.push(objSublistValue)
                    }
                    log.debug('objItemToBeSet', objItemToBeSet);
                    if (hasItemId) {
                        objRecord.commitLine({ sublistId: SUBLISTID });
                    }
                }

                libElapsedTime.elapsedTime({ title: 'LineSettingStart', start: intLineSettingStart });

                for (const line of option.removeLines) {

                    var intLineItem = objRecord.findSublistLineWithValue({
                        sublistId: SUBLISTID,
                        fieldId: libMapper[maptype].sublist.item.cartitemid.id,
                        value: line.cartitemid,
                    });
                    if (intLineItem >= 0) {
                        objRecord.removeLine({
                            sublistId: SUBLISTID,
                            line: intLineItem
                        });
                    }

                }
                var intUpdateMaintenancePeriodStart = libElapsedTime.elapsedTime();
                if (!option.isSaveDraft) {
                    libMaintenancePeriod.updateMaintenancePeriod(objRecord)
                }
                libElapsedTime.elapsedTime({ title: 'updateMaintenancePeriod', start: intUpdateMaintenancePeriodStart });

                var intEstimateSummaryCalculationStart = libElapsedTime.elapsedTime();
                libCalculations.estimateSummaryCalculation(objRecord);
                libElapsedTime.elapsedTime({ title: 'estimateSummaryCalculation', start: intEstimateSummaryCalculationStart });

                objRecord.setValue({ fieldId: libMapper.uuid.id, value: '' });
            }
            intIDReturn = objRecord.save();
            log.audit('Available Governance Score | SAVING RECORD ............... ' + maptype, objScript.getRemainingUsage());

            var intAttachContactToEstimateStart = libElapsedTime.elapsedTime();
            if (option.method == METHOD_ADDITEMS || option.type == ESTIMATE_TYPE) {
                libTechContact.attachContactToEstimate(intIDReturn)
            }
            libElapsedTime.elapsedTime({ title: 'attachContactToEstimate', start: intAttachContactToEstimateStart });

            libElapsedTime.elapsedTime({ title: 'Integrator 2', start: intConfigureRecordStart });
            return intIDReturn
        }

        const generateQuote = (option) => {
            var output;
            log.debug('generateQuote, options ', option)
            try {
                var objMrTask = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_adap_generatequote_mr',
                    deploymentId: null,
                    params: {
                        custscript_adap_atl_genquote_estimate: option.estimate,
                        custscript_adap_atl_genquote_mac: option.mac,
                        custscript_adap_atl_genquote_cartid: option.cartId || ''
                    }
                });
                var strMrTaskId = objMrTask.submit();

                record.submitFields({
                    type: 'estimate',
                    id: option.estimate,
                    values: {
                        custbody_adap_atl_refresh_status: strMrTaskId + "_GENERATEQUOTE_START"
                    }
                });
                return { estimate: option.estimate }
            } catch (e) {
                output = {
                    title: e.title ? e.title : 'Failed to generate quote',
                    msg: e.msg ? e.msg : 'The Cart has already expired, please generate quote again',
                    ...e
                }
            }
            return output
        }

        const getAtlassianQuote = (option) => {
            var objAtlassianCart = integrator.integrate({
                method: 'get',
                mac: option.mac,
                path: libMapper.integrator.PATH_GET_QUOTE,
                urlParam: option.quoteid,
                integration: 'adap_hamlet'
            });

            let arrOrderItems = objAtlassianCart.orderItems
            // Set the salestype to NEW Upgrade if condition is met
            if (arrOrderItems) {
                for (let i = 0; i < arrOrderItems.length; i++) {
                    const item = arrOrderItems[i];
                    if (item.saleType === "NEW" && (item.description.includes("upgrade") || item.description.includes("Upgrade"))) {
                        item.saleType = "NEW UPGRADE";
                    }
                }
                objAtlassianCart.orderItems = arrOrderItems
            }
            return {
                items: plotQuotedCart({ items: objAtlassianCart.orderItems, totalTax: objAtlassianCart.totalTax }),
                orderNumber: objAtlassianCart.orderNumber,
                httpcode: objAtlassianCart.httpcode,
                quoteDataJson: JSON.stringify(objAtlassianCart || '{}')
            }
        }

        const removeWhiteSpace = (str) => str.replace(/\s/g, '');

        const plotQuotedCart = (option) => {
            const arrItems = option.items;
            let output = [];

            var arrDiscountsRules = libCalculations.getDiscountRules({ items: arrItems })

            for (var [index, item] of arrItems.entries()) {
                var objDiscounts = libCalculations.discountsOrder({
                    items: item.discounts,
                    discountRules: arrDiscountsRules
                });
                item = { ...item, ...objDiscounts }
                try {
                    item.totalDiscount = item.total + item.upgradeCredit;
                    item.productId = item.platform + '_' + (item.productName.replace(/[^a-zA-Z0-9]/g, "")).toUpperCase().replace(item.platform, '')
                    item.id = item.productId + "-" + index;

                    var objItem = {
                        ...item,
                        tier: item.unitCount,
                        listPrice: item.unitPrice,
                        tierNumber: item.unitCount,
                        customerDiscountRate: 0,
                        discountedCustomerPrice: 0,
                        customerDiscountAmount: 0,
                        customerPrice: item.unitPrice,
                        margin: item.unitPrice - item.total,
                    }
                    objItem = libCalculations.atlassianCartItemCalculation({ item: objItem })

                    output.push(objItem);
                } catch (e) {
                    log.audit('plotQuote', e)
                }
            }
            return output;
        }

        return {
            create,
            add,
            get,
            toOrder,
            addRenewalItem,
            addUpgradeItem,
            remove,
            saveDraft,
            generateQuote,
            getAtlassianQuote,
            configureRecord,
            plotQuotedCart
        }
    });
