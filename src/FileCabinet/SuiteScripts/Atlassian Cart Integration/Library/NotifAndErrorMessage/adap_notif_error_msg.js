/**
 * @NApiVersion 2.1
 */
define(['N/query', 'N/record', 'N/search', '../../Library/quotePayload/adap_lib_quote_payload.js', 'N/ui/message',
        'SuiteScripts/Atlassian Cart Integration/Opportunity/UserEvent/lib/ada_ue_helper.js', 'N/https',
        '../../Library/integrator/integrator.js', '../../Library/SQL/adap_sql_library.js',
        '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],

    (query, record, search, libPayload,
     message, validationHelper, https, integrator, libSQL, libFieldAndDefaultValue) => {
        const INT_MAC_ACCOUNT = 1;

        let objMessages = {}
        objMessages.mapReduceMessage = {
            refresh: {
                title: 'Refresh Atlassian Quote is in progress',
                message: 'Thank you for your patience! The Atlassian quote is currently being refreshed. <br>  Please manually refresh the page.', //The page will refresh once the Refresh Quote is done
            },
            generateQuote: {
                title: 'Quote Generation is in progress',
                message: 'Thank you for your patience! The Atlassian quote is currently being generated. <br>  Please manually refresh the page.', //The page will refresh once the Generate Quote is done
            },
            doneGenerateQuote: {
                title: 'Atlassian Generation Quote',
                message: 'Atlassian Generation Quote process has been completed.'//The page will refresh within 5 seconds
            },
            doneRefreshQuote: {
                title: 'Refresh Atlassian Quote',
                message: 'Atlassian refresh process has been completed.'//The page will refresh within 5 seconds
            },
            failedGenerateQuote: {
                title: 'Failed to Generate Quote',
                message: 'Atlassian Generation Quote process has Failed,<br> Please consult with Administrator.'
            },
            failedRefreshQuote: {
                title: 'Failed to Refresh Quote',
                message: 'Atlassian refresh process has Failed,<br> Please consult with Administrator.'
            },
            genericEstimate: {
                title: 'Atlassian Quote Busy',
                message: 'Thank you for your patience! The Atlassian quote is currently being processed. <br>Please wait a moment for the updated content, or manually refresh the page if needed.'
            },
            doneGenericEstimate: {
                title: 'Atlassian Quote',
                message: 'Thank you for your patience! The Atlassian quote has been successfully generated or refreshed.'
            },
            failedGenericEstimate: {
                title: 'Atlassian Quote Failed',
                message: 'We apologize for the inconvenience. The Atlassian quote could not be generated or refreshed due to a technical issue. <br>Please try again later or contact support for assistance.'
            }
        }

        objMessages.validateNotifMessage = {
            noTechAddress:{
                message: 'Technical Contact Has no Address set to it.'
            },
            contactAdmin: {
                message: 'Please contact William Menlove to complete Customer information.'
            },
            refreshQuoteBtn: {
                title: 'Atlassian Cart Not Synced',
                message: 'Attention: Estimate is not synced from Atlassian Cart. Click "Refresh Quote"  To sync records.',
                type: 2,
                button: 'custpage_refresh_quote',
                buttonHidden: false
            },
            generateQuoteTechContactBtn: {
                title: 'Missing Technical Contact',
                message: 'Attention: Please Attach a  Contact under "Technical Contacts" Tab to Enable Quote Generation',
                message2: 'Attention: Please Attach a Contact under "Technical Contacts" Tab from the linked Estimate to Enable Quote Generation',
                type: 2,
                button: 'custpage_atlassian_generate_quotemr',
                buttonHidden: true
            },
            generateQuoteSalesRepBtn: {
                title: 'Missing Estimate Owner',
                message: 'Attention: Please Select an Estimate Owner to Enable Quote Generation',
                type: 2,
                button: 'custpage_atlassian_generate_quotemr',
                buttonHidden: true
            },
            generateQuoteAddressBtn: {
                title: 'Missing Or Incomplete Customer Address',
                message: 'Attention: Please ensure to Complete The Following Field on the Company address to Enable Quote Generation.<br>(email, company name, addr1, city, country, zip)<br>Please contact William Menlove to complete Customer information',
                type: 2,
                button: 'custpage_atlassian_generate_quotemr',
                buttonHidden: true
            },
            generateQuoteEndUserAddress: {
                title: 'Incomplete End User Address',
                message: 'Please ensure to Complete The Following Field on the End User address to Enable Quote Generation.<br>(name, Address1, city, country, zip)<br>Please contact William Menlove to complete Customer information.<br>To use Company Address please remove all values under "End User Client".',
                type: 2,
                button: 'custpage_atlassian_generate_quotemr',
                buttonHidden: true
            },
            cartAttachedToMultiple: {
                title: 'A Cart on this Estimate has been re-imported to another estimate ',
                message: 'Cart linking was removed from this Estimate.Atlassian Cart is now linked to the New Estimate',
                type: 2,
                button: null,
                buttonHidden: true
            },
            incompleteDetailsGenQuote: {
                title: 'Incomplete Details to Generate Quote',
                message: ' To Enable Quote Generation Please ensure to Complete The Following Fields :',
                type: 2,
                button: 'custpage_atlassian_generate_quotemr',
                buttonHidden: true
            },
            cartExpired: {
                title: 'A Cart on this Estimate no longer exist in MAC account (deleted or invoiced).',
                message: 'Cart/Quote No longer exist in MAC Account',
                type: 2,
                button: null,
                buttonHidden: true
            }
        }

        objMessages.errorMessage = {
            cartExistingInEstimateImport: {
                title: 'Quote Is already Imported to this Estimate',
                message: "Remove all Quote Lines to estimate before re-importing"
            },
            importIssue: {
                title: 'Import Process encountered issues while Importing the Quote',
                message: "Please close the page and try again. If the problem persists, contact your administrator"
            },
            invalidDataForQuote: {
                title: "Invalid Cart Details",
                message: "Generate Quote cannot process as the data is Invalid."
            },
            internalError: {
                title: 'Internal Error Occured'
            },
            connectionIssue: {
                title: 'Atlassian Server Connection Issue',
                message: "The connection to the Atlassian API is experiencing issues.<br> To check the current status, please visit the page https://status.atlassian.com/api .<br> If the problem persists, kindly reach out to the Administrator for assistance.",
                type: message.Type.WARNING
            }
        }
        const ESTIMATE_OWNER = "Estimate Owner: "
        const TECH_CONTACT_ADD = "Technical Contact/Address: "
        const BILLING = "Billing: "
        const MAC = 1
        let METHOD = libFieldAndDefaultValue.integrator.METHOD
        let PATH = libFieldAndDefaultValue.integrator.PATH
        let URL_PARAM = libFieldAndDefaultValue.integrator.URL_PARAM
        let INTEGRATION = libFieldAndDefaultValue.integrator.INTEGRATION
        let ERROR_400 = libFieldAndDefaultValue.responseCode.response_400;
        let ERROR_409 = libFieldAndDefaultValue.responseCode.response_409;
        let ERROR_500 = libFieldAndDefaultValue.responseCode.response_500;
        let RESPONSE_200 = libFieldAndDefaultValue.responseCode.response_200;
        let STR_SCRIPT = libFieldAndDefaultValue.suitelet.SCRIPT
        let STR_DEPLOYMENT = libFieldAndDefaultValue.suitelet.DEPLOYMENT
        const getGenerateQuoteError = (objCartDetailResponse, objPayload) => {
            var objReturnCartDetail = {}
            if (objCartDetailResponse.httpcode == ERROR_500) {
                var objEntity = {purchaser: [], technical: [], billing: [], xeroid: []}
                for (const entityKey in objEntity) {
                    let arrEntityKey = objEntity[entityKey];
                    for (const Error of objCartDetailResponse.i18nFieldErrors) {
                        if (Error.field.includes(entityKey)) {
                            arrEntityKey.push(Error.errorKey)
                        }
                    }
                }
                log.debug('objCartDetailResponse', objCartDetailResponse)
                var strPurchaser = objEntity.purchaser.length ? ESTIMATE_OWNER + objEntity.purchaser.join(', ') : "";
                var strTechnical = objEntity.technical.length ? TECH_CONTACT_ADD + objEntity.technical.join(', ') : "";
                var strBilling = objEntity.billing.length ? BILLING + objEntity.billing.join(', ') : "";

                let arrErrorFields = objCartDetailResponse.i18nFieldErrors
                let strInvalidValue = '';
                let errorKey = '';
                let errorField = '';
                let strMsg = '';
                if (arrErrorFields.length > 0) {
                    let strErrorField = arrErrorFields[0].field
                    let arrErrorField = strErrorField.split('.')
                    errorKey = arrErrorField[0]
                    errorField = arrErrorField[1]
                    strInvalidValue = (objPayload[errorKey])[errorField]
                }
                log.debug('strInvalidValue', strInvalidValue)

                if (errorField && strInvalidValue) {
                    strMsg = objMessages.errorMessage.invalidDataForQuote.message + "\n" + errorField + ':' + strInvalidValue
                } else {
                    strMsg = objMessages.errorMessage.invalidDataForQuote.message
                }

                objReturnCartDetail = {
                    title: objMessages.errorMessage.invalidDataForQuote.title,
                    msg: strMsg,
                    purchaser: strPurchaser,
                    technical: strTechnical,
                    billing: strBilling,
                    httpcode: objCartDetailResponse.httpcode
                };

                log.debug('objReturnCartDetail', objReturnCartDetail)
            } else if (objCartDetailResponse.httpcode == ERROR_400 || objCartDetailResponse.httpcode == ERROR_409) {
                objReturnCartDetail = {
                    title: objMessages.errorMessage.internalError.title,
                    msg: objCartDetailResponse.message,
                    httpcode: objCartDetailResponse.httpcode
                }
            }
            return objReturnCartDetail
        }
        const validateGenerateQuotePayload = (objRecord, objForm) => {
            // let strSql = "select id from customrecord_adap_atlassian_cart where custrecord_adap_at_cart_estimate = '" + objRecord.id + "' and custrecord_adap_at_quote_status = '1'";
            let strMessage =''
            let objMessage = objMessages.validateNotifMessage.incompleteDetailsGenQuote
            log.debug('objMessage', objMessage)
            let strSql = libSQL.sqlQuery.validateGenerateQuote
            strSql = strSql.replace('{recordId}', objRecord.id)
            let arrCartToGenerate = query.runSuiteQL({
                query: strSql
            }).asMappedResults();
            log.debug('arrCartToGenerate', arrCartToGenerate)
            if (arrCartToGenerate.length > 0) {
                for(let cartToGenerate of arrCartToGenerate){

                }

                log.debug('libFieldAndDefaultValue.estimateFields.fields.macAccount', libFieldAndDefaultValue.estimateFields.fields.macAccount)
                let intMac = objRecord.getValue(libFieldAndDefaultValue.estimateFields.fields.macAccount.id);
                let arrMissingPayloadValues = libPayload.getMissingValuesInPayload({estId: objRecord.id, mac: intMac})
                if (arrMissingPayloadValues.length > 0) {
                    const arrMissingFields = [...new Set(arrMissingPayloadValues)];
                    log.audit('arrMissingFields', arrMissingFields)
                    for (let missingField of arrMissingFields) {
                        for (let field in missingField) {
                            strMessage += '<br>-' + field + ' : ' + missingField[field]
                        }
                    }

                }
                if(strMessage){
                    strMessage += '<br><br>' + objMessages.validateNotifMessage.contactAdmin.message
                    objMessage.message =   objMessage.message + strMessage
                    hideButtonAndShowMessage(objMessage, objForm)
                }


            }
        }

        const validateTechContactAndGenQuoteBtn = (scriptContext) => {
            try {
                let blnReturnValue = true;
                let objForm = scriptContext.form
                let objEstimateRecord = scriptContext.newRecord
                let blnHasTechContact = technicalContactValidation(objEstimateRecord)
                if (!blnHasTechContact) {
                    hideButtonAndShowMessage(objMessages.validateNotifMessage.generateQuoteTechContactBtn, objForm)
                    blnReturnValue = false
                }
                // log.debug('libFieldAndDefaultValue.estimateFields.fields.salesRepId',libFieldAndDefaultValue.estimateFields.fields.salesRepId)
                let intSalesRep = objEstimateRecord.getValue({fieldId: libFieldAndDefaultValue.estimateFields.fields.salesRepId.id})
                if (!intSalesRep) {
                    hideButtonAndShowMessage(objMessages.validateNotifMessage.generateQuoteSalesRepBtn, objForm)
                    blnReturnValue = false
                }
                return blnReturnValue
            } catch (e) {
                log.audit('Issue with validating Technical Contact', e.message)
            }

        }
        const technicalContactValidation = (objEstimateRecord) => {
            try {

                let blnHasTechContact = false

                var contactSearchObj = validationHelper.technicalContactSearch(objEstimateRecord.id)
                var intContactCount = contactSearchObj.runPaged().count;
                // log.debug('intContactCount', intContactCount)
                if (intContactCount > 0) {
                    blnHasTechContact = true
                }

                return blnHasTechContact
            } catch (e) {
                log.audit('Issue with validating Technical Contact', e.message)
            }
        }
        const validateSyncAndAtlassianConnection = (scriptContext) => {
            try {
                let objForm = scriptContext.form
                let objEstimateRecord = scriptContext.newRecord
                hideButtonAndShowMessage(objMessages.validateNotifMessage.refreshQuoteBtn, objForm)
                let objInvoiceButton = objForm.getButton({
                    id: 'createinvoice'
                })
                if (objInvoiceButton) {
                    objInvoiceButton.isHidden = true
                }
                let objRefreshQuoteButton = objForm.getButton({
                    id: 'custpage_refresh_quote'
                })
                if (objRefreshQuoteButton) {
                    objRefreshQuoteButton.isHidden = false
                }


            } catch (e) {
                log.audit('Issue with Sync Notif/Refresh Quote Button Validation', e.message)
            }

        }

        const validateSyncAndAtlassianConnectionForSL = (estId) => {
            try {
                let objEstimateRecord = record.load({
                    type: record.Type.ESTIMATE,
                    id: estId,
                    isDynamic: true
                })

                let response = https.requestSuitelet({
                    scriptId: STR_SCRIPT,
                    deploymentId: STR_DEPLOYMENT,
                    external: true,
                    urlParams: {
                        action: 'getRefreshQuote',
                        estimate: objEstimateRecord.id,
                        mac: objEstimateRecord.getValue(libFieldAndDefaultValue.estimateFields.fields.macAccount.id)
                    }
                });
                log.audit('response validateSyncAndAtlassianConnection', response);

                if (response.code === RESPONSE_200) {
                    let isSynced = true
                    let responseBody = JSON.parse(response.body);
                    //log.debug('Response Body', responseBody);
                    log.audit('responseBody validateSyncAndAtlassianConnection', responseBody);
                    //checking if server is down
                    if (responseBody.length > 0) {
                        let intHttpCode = responseBody[0].httpcode
                        log.debug('end validate estimate', intHttpCode)
                        if (intHttpCode == RESPONSE_200) {
                            try {
                                for (const responseItem of responseBody) {
                                    log.debug('responseItem refresh', responseItem)
                                    for (let responseItemKeys in responseItem) {
                                        let arrItemsNotSynced = responseItem[responseItemKeys]
                                        if (responseItemKeys == 'toUpdateTechContact'
                                            || responseItemKeys == 'toDelete'
                                            || responseItemKeys == 'toUpdate'
                                            || responseItemKeys == 'toAdd'
                                        ) {
                                            //  log.debug('responseItemKeys', responseItemKeys)
                                            // log.debug('arrItemsNotSynced', arrItemsNotSynced)
                                            if (arrItemsNotSynced.length > 0) {
                                                isSynced = false;
                                            }
                                        }
                                    }

                                }
                            } catch (e) {
                                log.audit('no response')
                            }
                            log.debug('isSynced', isSynced);
                            return isSynced;
                        }
                    } else {
                        // let objForm = scriptContext.form
                        // showATLConnectionIssueMessage(objForm)
                    }
                } else {
                    log.error('GET request failed', 'Response code: ' + response.code);
                }
            } catch (e) {
                log.audit('Issue with Sync Notif/Refresh Quote Button Validation', e.message)
            }

        }
        const hideButtonAndShowMessage = (objMessageDetail, objForm) => {
            let objMessage = message.create({
                title: objMessageDetail.title,
                message: objMessageDetail.message,
                type: objMessageDetail.type
            });
            objMessage.show();
            objForm.addPageInitMessage({message: objMessage});
            if (objMessageDetail.button) {
                let objRefreshQuoteButton = objForm.getButton({
                    id: objMessageDetail.button
                })
                if (objRefreshQuoteButton) {
                    objRefreshQuoteButton.isHidden = objMessageDetail.buttonHidden
                }
            }
        }


        const checkATLConnection = (objForm) => {
            var objConnectionCheck = integrator.integrate({
                method: METHOD,
                mac: MAC,
                path: PATH,
                urlParam: URL_PARAM,
                integration: INTEGRATION
            });
            log.audit('objConnectionCheck', objConnectionCheck)
            // objConnectionCheck.httpcode=201
            log.audit('objConnectionCheck.httpcode', objConnectionCheck.httpcode)

            if (objConnectionCheck.httpcode != RESPONSE_200) {
                // if (objConnectionCheck.httpcode != 201) {
                showATLConnectionIssueMessage(objForm)
            }
        }
        const validateCartsIfLinkedToEstimate = (objEstRecord) => {
            let blnIsLinked = true;
            let intRecordId = parseInt(objEstRecord.id)
            let arrNotLinkedCarts = [];
            log.debug('intRecordId', intRecordId)
            let intItemCount = objEstRecord.getLineCount(libFieldAndDefaultValue.sublists.item)
            let arrAllCarts = [];
            for (let intItemIndex = 0; intItemIndex < intItemCount; intItemIndex++) {
                let intAtlCart = objEstRecord.getSublistValue({
                    sublistId: libFieldAndDefaultValue.sublists.item,
                    // fieldId: 'custcol_adap_atlassian_cart_holder',
                    fieldId: libFieldAndDefaultValue.estimateFields.sublist.item.cartId.id,
                    line: intItemIndex
                })
                if (intAtlCart) {
                    arrAllCarts.push(intAtlCart)
                }
            }
            let arrCartIds = [...new Set(arrAllCarts)]
            log.debug('arrCartIds', arrCartIds)
            for (let intCart of arrCartIds) {
                log.debug('intCart', intCart)
                // custrecord_adap_at_cart_estimate
                var objEstimate = search.lookupFields({
                    type: libFieldAndDefaultValue.atlassianCart.id,
                    id: intCart,
                    columns: ['custrecord_adap_at_cart_estimate', 'name']
                });
                log.debug('objEstimate', objEstimate)
                let intLinkedEstimate = parseInt((objEstimate.custrecord_adap_at_cart_estimate)[0].value)
                log.debug('intLinkedEstimate', intLinkedEstimate)
                if (intLinkedEstimate != intRecordId) {
                    // blnIsLinked = false
                    if ((objEstimate.name).includes('AT-')) {
                        arrNotLinkedCarts.push(objEstimate.name)
                    }

                }
            }
            log.debug('arrNotLinkedCarts', arrNotLinkedCarts)
            return arrNotLinkedCarts
        }
        const showATLConnectionIssueMessage = (objForm) => {
            log.debug('showing atlconnection issue')
            let objMessage = message.create(objMessages.errorMessage.connectionIssue);
            objMessage.show();
            objForm.addPageInitMessage({message: objMessage});
            validationHelper.hideAllAttlasianButton(objForm)
        }

        const setFailedMessage = (option) => {
            log.debug('setFailedMessage', option)
            try {
                var objRecord;
                var strCurrentFailedMessage = '';
                if (!option.textOnly) {
                    objRecord = record.load({
                        type: record.Type.ESTIMATE,
                        id: option.estid,
                        isDynamic: true
                    });
                    strCurrentFailedMessage = objRecord.getValue('custbody_adap_fail_reason');
                }

                if (option.cartId) {
                    let objCart = search.lookupFields({
                        type: libFieldAndDefaultValue.atlassianCart.id,
                        id: option.cartId,
                        columns: ['name']
                    });
                    log.debug('objCart', objCart);
                    let strATNumber = objCart.name;
                    option.message = strATNumber + ' : ' + option.message;
                } else {
                    var strEstimateNumber
                    if (!option.textOnly) {
                        strEstimateNumber = objRecord.getValue('tranid');
                    } else {
                        strEstimateNumber = option.tranid
                    }
                    option.message = 'Estimate #' + strEstimateNumber + ' : ' + option.message;
                }
                strCurrentFailedMessage += ' <br> ' + option.message;

                if (!option.textOnly) {
                    objRecord.setValue({fieldId: 'custbody_adap_fail_reason', value: strCurrentFailedMessage});
                    objRecord.save();
                }
                return strCurrentFailedMessage
            } catch (e) {
                log.error('error setFailedMessage', e.message)
            }
        }

        const checkExpiredCart = (objEstimate, objForm) => {
            let arrAllEstimateCart = []
            let intItemCount = objEstimate.getLineCount('item')
            for (let itemIndex = 0; itemIndex < intItemCount; itemIndex++) {
                let intCartId = objEstimate.getSublistValue({
                    sublistId: 'item',
                    fieldId: libFieldAndDefaultValue.estimateFields.sublist.item.cartId.id,
                    line: itemIndex
                })
                arrAllEstimateCart.push(intCartId)

            }
            arrAllEstimateCart = [...new Set(arrAllEstimateCart)]
            arrAllEstimateCart = arrAllEstimateCart.filter(function(value) {
                return value !== "";
            });
            log.debug('arrAllEstimateCart unique', arrAllEstimateCart)

            let arrExpiredCarts = [];
            if (arrAllEstimateCart.length > 0) {
                let strUUIDQuery = libSQL.sqlQuery.getMultipleATLCartByUUID
                strUUIDQuery = strUUIDQuery.replace('{cartId}', arrAllEstimateCart)
                log.debug('strUUIDQuery', strUUIDQuery)

                let arrQueryResult = query.runSuiteQL({
                    query: strUUIDQuery
                }).asMappedResults();
                log.debug('arrQueryResult ', arrQueryResult)

                for (let objCartInfo of arrQueryResult) {
                    if ((objCartInfo.name).includes('ORDER')) {
                        if (objCartInfo.custrecord_adap_at_cart_uuid) {
                            let objOrderResponse = integrator.integrate({
                                method: 'get',
                                mac: INT_MAC_ACCOUNT,
                                path: libFieldAndDefaultValue.integrator.PATH_CART_GET,
                                urlParam: objCartInfo.custrecord_adap_at_cart_uuid,
                                integration: libFieldAndDefaultValue.integrator.INTEGRATION
                            });
                            log.debug('objOrderResponse', objOrderResponse)

                            let intHTTPCode = objOrderResponse.httpcode
                            log.debug('intHTTPCode', intHTTPCode)
                            if (intHTTPCode !== libFieldAndDefaultValue.responseCode.response_200) {
                                arrExpiredCarts.push(objCartInfo.name)
                            }
                        }
                    }else if((objCartInfo.name).includes('AT')){
                        let objQuotedCart = integrator.integrate({
                            method: 'get',
                            mac: INT_MAC_ACCOUNT,
                            path: libFieldAndDefaultValue.integrator.PATH_GET_QUOTE,
                            urlParam: objCartInfo.name.split('-')[1],
                            integration: libFieldAndDefaultValue.integrator.INTEGRATION
                        });
                        log.debug('objQuotedCart',objQuotedCart)
                        let intHTTPCode = objQuotedCart.httpcode
                        log.debug('intHTTPCode', intHTTPCode)
                        if (intHTTPCode !== libFieldAndDefaultValue.responseCode.response_200) {
                            arrExpiredCarts.push(objCartInfo.name)
                        }
                    }
                }
                arrExpiredCarts = arrExpiredCarts.filter(function(value) {
                    return value !== "";
                });
                log.debug('arrExpiredCarts', arrExpiredCarts)

                if (arrExpiredCarts.length > 0) {
                    let objMessage = objMessages.validateNotifMessage.cartExpired
                    let strMessage = objMessage.message
                    for (let strCart of arrExpiredCarts) {
                        strMessage = strMessage + '<br>*' + strCart
                    }
                    objMessage.message = strMessage
                    hideButtonAndShowMessage(objMessage, objForm)
                }

            }

        }

        return {
            objMessages,
            getGenerateQuoteError,
            validateGenerateQuotePayload,
            validateTechContactAndGenQuoteBtn,
            validateSyncAndAtlassianConnection,
            checkATLConnection,
            validateCartsIfLinkedToEstimate,
            validateSyncAndAtlassianConnectionForSL,
            setFailedMessage,
            checkExpiredCart
        }
    });
