define(['N/record', 'N/query', './cart', 'N/file', 'N/runtime', 'N/task',
    './nsestimate.js', '../../../Library/SQL/adap_sql_library.js', '../../../Library/integrator/integrator.js',
    '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../../../Opportunity/UserEvent/lib/ada_ue_helper.js', '../../../Library/Items/netsuiteItem.js',
    '../../../Library/TechnicalContact/adap_lib_tech_contact.js', '../../../Library/NotifAndErrorMessage/adap_notif_error_msg.js', 'N/search',
    '../../MapReduce/lib/adap_import_quote_lib.js'],

    (record, query, cart, file, runtime, task,
        nsestimate, libSuitesQl, integrator, libMapper,
        libValidtionHelper, libNetsuiteItem, libTechContact, libErrorMessageAndNotif, search,
        libImportCart) => {

        const PDF_LINK = 'https://my.atlassian.com/billing/pdf/'
        const create = (options) => {
            try {
                log.audit('import create | option', options)
                var objScript = runtime.getCurrentScript();
                const OBJIMPORTROPTIONS = libMapper.mrImport;
                options = { ...options, ...JSON.parse(options.forNewEstimate || '{}') }
                let output = {}
                let cartId;

                var intUniqueId = new Date().getTime();
                var strCartUniqueId = '';
                let intEstId = options.estid
                let isCartLessThan30Items = false

                // throw {"type":"error.SuiteScriptError","name":"RCRD_HAS_BEEN_CHANGED","message":"Record has been changed","id":"","stack":["Error\n    at RecordInvoker.save (suitescript/resources/javascript/record/serverRecordService.js:371:13)\n    at NetSuiteObject.thenableFunction() (suitescript/resources/javascript/record/proxy.js:115:24)\n    at Object.create (/SuiteScripts/Atlassian Cart Integration/Atlassian/api/lib/nscart.js:45:43)\n    at Object.createCart (/SuiteScripts/Atlassian Cart Integration/Atlassian/api/netsuite.js:6:27)\n    at Object.onRequest (/SuiteScripts/Atlassian Cart Integration/Atlassian/ada_st_qb_atlassiancart.js:29:67)"],"cause":{"type":"internal error","code":"RCRD_HAS_BEEN_CHANGED","details":"Record has been changed","userEvent":null,"stackTrace":["Error\n    at RecordInvoker.save (suitescript/resources/javascript/record/serverRecordService.js:371:13)\n    at NetSuiteObject.thenableFunction() (suitescript/resources/javascript/record/proxy.js:115:24)\n    at Object.create (/SuiteScripts/Atlassian Cart Integration/Atlassian/api/lib/nscart.js:45:43)\n    at Object.createCart (/SuiteScripts/Atlassian Cart Integration/Atlassian/api/netsuite.js:6:27)\n    at Object.onRequest (/SuiteScripts/Atlassian Cart Integration/Atlassian/ada_st_qb_atlassiancart.js:29:67)"],"notifyOff":false},"notifyOff":false,"userFacing":true}
                if (options.cartUniqueId) {
                    var arrFindCartEstimate = libSuitesQl.search({
                        type: 'findCartEstimate',
                        params: {
                            cartUniqueId: options.cartUniqueId
                        }
                    });
                    strCartUniqueId = options.cartUniqueId;
                    if (arrFindCartEstimate.length) {
                        intEstId = arrFindCartEstimate[0].id;
                        var objEstimateRecord = record.load({
                            type: record.Type.ESTIMATE,
                            id: intEstId,
                            isDynamic: false
                        });
                        objEstimateRecord.setValue({ fieldId: libMapper.estimateFields.fields.cartIdentifier.id, value: '' });
                        objEstimateRecord.save();
                    }
                } else {
                    const objIsExisting = checkExisting({
                        recordType: 'customrecord_adap_atlassian_cart',
                        orderNumber: options.orderNumber
                    })
                    log.audit('import create', options.orderNumber)
                    log.audit('import create', options.estimate)

                    if (objIsExisting.ifExists === true) {
                        let objCartExistInEstAndCartId = libValidtionHelper.checkCartExistEstimate(options)
                        log.debug('objCartExistInEstAndCartId', objCartExistInEstAndCartId)
                        if (objCartExistInEstAndCartId.cartExistInEst === false) {
                            cartId = objCartExistInEstAndCartId.cartid
                        } else {
                            output['title'] = libErrorMessageAndNotif.objMessages.errorMessage.cartExistingInEstimateImport.title
                            output['msg'] = libErrorMessageAndNotif.objMessages.errorMessage.cartExistingInEstimateImport.message
                            output['estimate'] = options.estimate
                            output['httpcode'] = 200
                            output['isQuoteExisting'] = objIsExisting.ifExists
                            output['cf'] = libMapper.customForms.estimate
                            output['duration'] = 99999999;
                            output['forceRedirect'] = false;
                            output['hasError'] = true
                            return output
                        }
                    }
                    log.audit('import objIsExisting', objIsExisting)
                    var objAtlassianQuote = integrator.integrate({
                        method: 'get',
                        mac: options.mac,
                        path: libMapper.integrator.PATH_GET_QUOTE,
                        urlParam: options.orderNumber.slice(3),
                        integration: 'adap_hamlet'
                    });

                    options['status'] = 3;

                    var objCartData = {
                        ...options,
                        ...objAtlassianQuote,
                        ...JSON.parse(options.summary),
                        quoteDataJson: JSON.stringify(objAtlassianQuote || '{}'),
                        created: objAtlassianQuote.createdDate,
                        dueDate: objAtlassianQuote.dueDate,
                        quoteId: options.orderNumber,
                        objIsExisting: objIsExisting
                    };

                    //create cart if cart not existing
                    if (!cartId) {
                        cartId = cart.configureRecord({
                            type: 'atlassianCart',
                            data: objCartData,
                            method: 'create'
                        })
                    } else if (cartId) {
                        cart.configureRecord({
                            type: 'atlassianCart',
                            id: cartId,
                            data: objCartData,
                            method: 'update'
                        })
                    }

                    objCartData.cartId = cartId
                    strCartUniqueId = "cart_" + intUniqueId;
                    log.debug('objAtlassianQuote.orderItems', objAtlassianQuote.orderItems.length)
                    if (objAtlassianQuote.orderItems.length < 30) { //8921
                        objCartData = libImportCart.initializeImportCart(objCartData)
                        objCartData = libImportCart.createCartItemRecords(objCartData)
                        objCartData.strCartUniqueId = strCartUniqueId
                        intEstId = libImportCart.createUpdateEstimateRecord(objCartData) // ADAP02-454
                        isCartLessThan30Items = true
                    } else {
                        let intFileId = file.create({
                            name: strCartUniqueId,
                            fileType: file.Type.PLAINTEXT,
                            contents: JSON.stringify(objCartData),
                            folder: OBJIMPORTROPTIONS.folderId
                        }).save();
                        if (intFileId >= 0) {
                            var objMrTask = task.create({
                                taskType: task.TaskType.MAP_REDUCE,
                                scriptId: OBJIMPORTROPTIONS.scriptId,
                                deploymentId: OBJIMPORTROPTIONS.deployment,
                                params: {
                                    [OBJIMPORTROPTIONS.params.file]: intFileId,
                                    [OBJIMPORTROPTIONS.params.uniqueId]: strCartUniqueId
                                }
                            });
                            objMrTask.submit();
                            log.audit('import objMrTask', objMrTask)
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
                    arrFindCartEstimate: arrFindCartEstimate,
                    forceRedirect: isCartLessThan30Items
                };
                return objReturn

            } catch (e) {
                let output = {}
                var objData = {
                    estid: options.estimate,
                    cf: libMapper.customForms.estimate
                }
                output['title'] = libErrorMessageAndNotif.objMessages.errorMessage.importIssue.title;
                output['msg'] = `Error Message: ${e.message}\n` + libErrorMessageAndNotif.objMessages.errorMessage.importIssue.message;
                output['httpcode'] = 201
                output['estimateId'] = options.estimate
                output['cf'] = libMapper.customForms.estimate
                output['hasError'] = true
                output['buttons'] = [{
                    action: 'cancel-import-button cancel',
                    data: [objData],
                    label: 'Close'
                }]
                log.error('Import | Error', e)
                return output
            }
        }

        const checkExisting = (options) => {
            var objOutput = {}
            const arrResult = query.runSuiteQL({
                query: `SELECT id,
                custrecord_adap_at_cart_uuid as uuid,
                custrecord_adap_atl_quote_pdf_link as pdflink
                FROM ${options.recordType} 
                WHERE BUILTIN.DF(id) = '${options.orderNumber}'`
            }).asMappedResults()
            objOutput.cart = arrResult[0]
            objOutput.ifExists = arrResult.length == 0 ? false : true
            return objOutput
        }

        const getLastState = (options) => {

            log.debug('getLastState', options);

            strUuid = ''
            if (options.uuid != 'undefined' || options.uuid != '') {
                strUuid = options.uuid
            }

            objReturn = {}
            objReturn = libSuitesQl.search({
                type: 'getLastState',
                params: {
                    estid: options.estid,
                }
            })[0];

            if (options.estid && strUuid && options.cartid == 'null') {
                record.submitFields({
                    type: record.Type.ESTIMATE,
                    id: options.estid,
                    values: {
                        custbody_adap_atlassian_uuid: strUuid
                    }
                });
            }
            return objReturn
        }

        const removeLastState = (options) => {
            try {
                record.submitFields({
                    type: record.Type.ESTIMATE,
                    id: options.estid,
                    values: {
                        custbody_adap_atlassian_uuid: null
                    },
                    option: {
                        ignoreMandatoryFields: true
                    }
                });
                if (options.ignoreNewCart) {
                    return true
                } else {
                    return cart.create()
                }
            } catch (e) {
                log.debug('removeLastState | e ', e)
            }
        }

        const cartIsChanged = (options) => {
            try {
                log.debug('cartIsChanged', options)
                record.submitFields({
                    type: libMapper.atlassianCart.id,
                    id: options.cartid,
                    values: {
                        [libMapper.atlassianCart.fields.isCartChanged.id]: options.changed == 'true'
                    },
                })
                return true
            } catch (e) {
                log.error('cartIsChanged Error', e)
            }
        }

        return {
            create,
            getLastState,
            removeLastState,
            cartIsChanged
        }
    })