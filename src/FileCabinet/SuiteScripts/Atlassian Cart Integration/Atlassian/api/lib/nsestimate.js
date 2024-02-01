define([
    'N/query', 'N/record', 'N/task',
    './mapper.js', '../../../Library/integrator/integrator.js',
    '../../../Opportunity/UserEvent/lib/ada_ue_helper.js', 'N/file',
    '../../../Library/Items/netsuiteItem.js', '../../../Library/saveSearch.js',
    '../../../Library/SQL/adap_sql_library.js',
    '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../../../Library/NotifAndErrorMessage/adap_notif_error_msg.js','N/redirect'],

    (query, record, task,
        mapper, integrator,
        libContactHelper, file,
        libNetsuiteItem, savedSearch, libSQL,
        libFieldAndDefaultValue, libNotifAndErrorMsg,redirect) => {

        const appendItems = (options) => {
            const id = options.id
            const arrData = options.data
            const recType = options.recType

            const arrItems = arrData

            let rec = record.load({
                type: recType,
                id: id,
                isDynamic: true
            })

            const intLineCount = rec.getLineCount({
                sublistId: 'item'
            })

            for (let objItem of arrItems) {

                let item = objItem

                rec.selectNewLine({ sublistId: 'item' })

                let mapping = libFieldAndDefaultValue.netsuiteEstimateItems.fields

                for (let field in mapping) {
                    let type = mapping[field].type
                    let fieldId = mapping[field].id
                    let value = ''

                    if (mapping[field].hasOwnProperty('default')) {
                        value = mapping[field].default
                    } else {
                        value = item[field]
                    }

                    log.debug('sublist value', {
                        sublistId: 'item',
                        fieldId: fieldId,
                        value: value,
                    })

                    if (type == 'value') {
                        rec.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: fieldId,
                            value: value,
                        })
                    } else if (type == 'text') {
                        rec.setCurrentSublistText({
                            sublistId: 'item',
                            fieldId: fieldId,
                            text: value,
                        })
                    }
                }

                rec.commitLine({ sublistId: 'item' })
            }
            // }

            let stopper = null
            return rec.save()

        }

        const removeWhiteSpace = (str) => str.replace(/\s/g, '');

        const getRefreshQuote = (options) => {
            try {
                log.debug('getRefreshQuote | options', options)
                var arrNetsuiteQuotes = libSQL.search({
                    type: 'getRefreshQuote',
                    params: {
                        estid: options.estimate,
                    }
                });
                var arrCompared = [];
                let intEstId = options.estimate;
                log.debug('arrNetsuiteQuotes', arrNetsuiteQuotes)
                log.debug('arrNetsuiteQuotes length', arrNetsuiteQuotes.length)
                for (let objNetsuiteQuote of arrNetsuiteQuotes) {
                    var objAtlassianQuote = integrator.integrate({
                        method: libFieldAndDefaultValue.integrator.METHOD,
                        mac: options.mac,
                        path: libFieldAndDefaultValue.integrator.PATH_GET_QUOTE,
                        urlParam: objNetsuiteQuote.name.slice(3),
                        integration: libFieldAndDefaultValue.integrator.INTEGRATION
                    });
                    // log.debug('objAtlassianQuote', objAtlassianQuote)

                    if (objAtlassianQuote.httpcode == libFieldAndDefaultValue.responseCode.response_500) {
                        log.debug('objAtlassianQuote', objAtlassianQuote)
                        return objAtlassianQuote
                    }
                    let objNSQuote = JSON.parse(objNetsuiteQuote.json || '{}')
                    let objAtlQuote = objAtlassianQuote

                    var objDifferences = differenceConsolidation({
                        cartid: objNetsuiteQuote.id,
                        nsQuote: objNSQuote,
                        atlQuote: objAtlQuote
                    });
                    log.debug('objDifferences', objDifferences);


                    if (Object.keys(objDifferences).length > 0) {
                        if (objDifferences.toAdd.length > 0 || objDifferences.toUpdate.length > 0 || objDifferences.toDelete.length > 0 || objDifferences.toUpdateTechContact.length > 0) {

                            record.submitFields({
                                type: libFieldAndDefaultValue.atlassianCart.id,
                                id: objNetsuiteQuote.id,
                                values: {
                                    [libFieldAndDefaultValue.quoteForRefreshField]: false,
                                    [libFieldAndDefaultValue.atlassianCart.fields.quoteRefreshDataJson.id]: JSON.stringify(objAtlassianQuote || '{}')
                                }
                            });
                        }
                    }
                    log.debug('nsQuote', JSON.parse(objNetsuiteQuote.json || '{}'))
                    log.debug('atlQuote', objAtlassianQuote);
                    log.audit('getRefreshQuote : objDifferences', objDifferences);

                    arrCompared.push({
                        name: objNetsuiteQuote.name,
                        id: objNetsuiteQuote.id,
                        httpcode: objAtlassianQuote.httpcode, ...objDifferences
                    });
                }
                return arrCompared;
            } catch (e) {
                log.error('error', e.message)
                return [{ httpcode: 400 }]
            }
        }


        const differenceConsolidation = (options) => {
            const cartid = options.cartid
            let nsCartItems = (options.nsQuote.orderItems).slice()
            let atlQuoteItems = (options.atlQuote.orderItems).slice()

            log.debug('nsCartItems', nsCartItems)
            log.debug('atlQuoteItems', atlQuoteItems);
            let arrToDelete = [];
            let arrToUpdate = [];
            let arrToAdd = [];
            let arrNoChanges = [];


            // Compare nsCartItems to atlQuoteItems
            nsCartItems.forEach((oldItem, oldIndex) => {
                // log.debug(oldIndex,oldItem)
                let newItemIndex = -1;
                if (oldItem.supportEntitlementNumber) {
                    log.debug('oldItem.supportEntitlementNumber', oldItem.supportEntitlementNumber)
                    newItemIndex = atlQuoteItems.findIndex((newItem) =>
                        newItem.supportEntitlementNumber == oldItem.supportEntitlementNumber
                    );
                    log.debug('newItemIndex', newItemIndex)
                    // log.debug('atlQuoteItems[newItemIndex].supportEntitlementNumber', atlQuoteItems[newItemIndex].supportEntitlementNumber)
                } else {
                    log.debug('oldItem.productName', oldItem.productName)
                    newItemIndex = atlQuoteItems.findIndex((newItem) =>
                        !newItem.supportEntitlementNumber &&
                        newItem.productName == oldItem.productName &&
                        newItem.platform == oldItem.platform &&
                        newItem.unitCount == oldItem.unitCount &&
                        newItem.licenseType == oldItem.licenseType &&
                        newItem.total == oldItem.total
                    );
                    log.debug('newItemIndex', newItemIndex)
                }


                if (newItemIndex === -1) {
                    // Item is deleted
                    arrToDelete.push(oldItem);
                } else {
                    // Item exists in atlQuoteItems, compare JSON objects
                    const newItem = atlQuoteItems[newItemIndex];
                    if (JSON.stringify(oldItem) === JSON.stringify(newItem)) {
                        // No changes, push to "No Changes" array
                        // if (!oldItem.supportEntitlementNumber) {
                        arrNoChanges.push(oldItem);
                        //}
                    } else {
                        // Changes detected, push to "Updated Items" array
                        if (oldItem.supportEntitlementNumber) {
                            arrToUpdate.push(newItem);

                        } else {
                            arrToDelete.push(oldItem);
                            arrToAdd.push(newItem)
                        }
                    }
                    //remove the object in the array once its already been compared
                    atlQuoteItems.splice(newItemIndex, 1)
                }
            });

            log.debug('atlQuoteItems after Processs', atlQuoteItems)
            log.debug('nsCartItems after Splice', nsCartItems)

            //all remaining objects insite the atlQuote will be considered as new line
            for (let objATLQuote of atlQuoteItems) {
                arrToAdd.push(objATLQuote)
            }


            const nsTechContacts = options.nsQuote.technicalContact
            const atlTechContacts = options.atlQuote.technicalContact
            log.audit('nsTechContacts', nsTechContacts)
            log.audit('atlTechContacts', atlTechContacts)
            let arrTechContactToUpdate = [];
            const fieldsToCompare = ["firstName", "lastName", "email", "phone"];

            const objTechContactToUpdate = {};

            fieldsToCompare.forEach(field => {
                if (nsTechContacts[field] !== atlTechContacts[field]) {
                    for (let fields of fieldsToCompare) {
                        objTechContactToUpdate[fields] = atlTechContacts[fields]
                    }
                    //arrTechContactToUpdate.push(objTechContactToUpdate)
                    const exists = arrTechContactToUpdate.some(existingContact => (
                        existingContact.firstName === objTechContactToUpdate.firstName &&
                        existingContact.lastName === objTechContactToUpdate.lastName &&
                        existingContact.email === objTechContactToUpdate.email &&
                        existingContact.phone === objTechContactToUpdate.phone
                    ));

                    if (!exists) {
                        arrTechContactToUpdate.push(objTechContactToUpdate);
                        log.audit("New contact added:", objTechContactToUpdate);
                    }
                }
            });

            // log.audit("arrTechContactToUpdate", arrTechContactToUpdate);
            // log.debug('atlQuoteItems before function end', atlQuoteItems);
            return {
                toUpdateTechContact: arrTechContactToUpdate,
                toDelete: arrToDelete,
                toUpdate: arrToUpdate,
                toAdd: arrToAdd,
                NoChange: arrNoChanges
            }

        }


        const getQuoteIdFromNSEstimate = (objNSQuote, intEstId, intCartId) => {
            log.debug('objNSQuote in getQuoteIdFromNSEstimate', objNSQuote)
            log.debug('intEstId', intEstId)
            log.debug('intCartId', intCartId)
            let objEst = record.load({
                type: record.Type.ESTIMATE,
                id: intEstId,
                isDynamic: true
            })
            let arrObjNSQuoteOrderItems = objNSQuote.orderItems
            let intItemCount = objEst.getLineCount('item')
            let arrQuoteLineIds = [];
            for (let i = 0; i < intItemCount; i++) {
                let intEstCartId = objEst.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_adap_atlassian_cart_holder',
                    line: i
                })
                if (intEstCartId == intCartId) {
                    let intEstQuoteLineId = objEst.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_adap_atl_item_id',
                        line: i
                    })
                    if (intEstQuoteLineId) {
                        arrQuoteLineIds.push(intEstQuoteLineId)
                    }
                }
            }
            log.debug('arrQuoteLineIds', arrQuoteLineIds)

            if (arrQuoteLineIds.length == arrObjNSQuoteOrderItems.length) {
                // log.debug('objNSQuote.orderItems',objNSQuote.orderItems)
                // log.debug('arrQuoteLineIds',arrQuoteLineIds)
                for (let i = 0; i < (objNSQuote.orderItems).length; i++) {
                    (objNSQuote.orderItems)[i].id = arrQuoteLineIds[i];
                    log.debug(arrQuoteLineIds[i], (objNSQuote.orderItems)[i])
                }
                return true
            }
        }

        const refreshQuote = (options) => {
            log.debug('options refreshQuote', options)
            // libContactHelper.syncEstimateContactToJSON(options.estimate)
            var objTask = {
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: libFieldAndDefaultValue.mr.parent,
                deploymentId: null,//'customdeploy_adap_atlassianqt_refresh_mr'
                params: {
                    [libFieldAndDefaultValue.mr.params.estimate]: options.estimate
                }
            };
            var objMrTask = task.create(objTask);
            var strMrTaskId = objMrTask.submit();

            record.submitFields({
                type: record.Type.ESTIMATE,
                id: options.estimate,
                values: {
                    [libFieldAndDefaultValue.estimateFields.fields.refreshQuoteStatus.id]: strMrTaskId
                }
            });

            log.debug('a', strMrTaskId)
            // redirect.toRecord({
            //     type:record.Type.ESTIMATE,
            //     id:options.estimate
            // })
            return { httpcode: 200, mapreduce: strMrTaskId }
        }




        function removeWhiteSpaceAndSpecialChars(strKey) {
            const regex = /[\s\W_]+/g;
            const result = strKey.replace(regex, '');

            return result;
        }



        const getMrStatus = (options) => {

            log.debug('getMrStatus', options)
            var objMessageBanner = {
                "CONFIRMATION": 0,
                "INFORMATION": 1,
                "WARNING": 2,
                "ERROR": 3
            }


            try {
                let intCurrentRecordId = options.estid
                var objMessage = {
                    type: objMessageBanner.INFORMATION,
                    duration: 999999
                }
                var objMRStatus = libSQL.search({
                    type: 'getMrStatus',
                    params: {
                        estid: intCurrentRecordId || '',
                    }
                })[0]
                log.debug('objMRStatus', objMRStatus)
                if (objMRStatus.status) {
                    if (objMRStatus.type == "Estimate" &&
                        (objMRStatus.status.includes('DONE') || objMRStatus.status.includes('FAILED'))
                    ) {

                        objMessage = {
                            type: objMessageBanner.CONFIRMATION,
                            duration: 60000
                        }

                        var objMapReduceMessage = libNotifAndErrorMsg.objMessages.mapReduceMessage;

                        // genericEstimate
                        // doneGenericEstimate
                        // failedGenericEstimate
                        switch (objMRStatus.status) {
                            case 'DONE_GENERATE_QUOTE':
                                objMessage.title = objMapReduceMessage.doneGenericEstimate.title
                                objMessage.message = objMapReduceMessage.doneGenericEstimate.message
                                break;
                            case 'FAILED_GENERATE_QUOTE':
                                objMessage.title = objMapReduceMessage.failedGenericEstimate.title
                                objMessage.message = objMapReduceMessage.failedGenericEstimate.message
                                break;
                            case 'DONE_REFRESH_QUOTE':
                                objMessage.title = objMapReduceMessage.doneGenericEstimate.title
                                objMessage.message = objMapReduceMessage.doneGenericEstimate.message
                                break;
                            case 'FAILED_REFRESH_QUOTE':
                                objMessage.title = objMapReduceMessage.failedGenericEstimate.title
                                objMessage.message = objMapReduceMessage.failedGenericEstimate.message
                                break;
                        }

                        if (objMRStatus.status.includes('FAILED')) {
                            objMessage.type = message.Type.ERROR
                        }

                        var objEstRecord = record.load({
                            type: 'estimate',
                            id: intCurrentRecordId,
                            defaultValues: { cf: 145 }
                        });
                        objEstRecord.setValue({ fieldId: libFieldAndDefaultValue.estimateFields.fields.refreshQuoteStatus.id, value: '', });
                        objEstRecord.save();
                    } else if (objMRStatus.status.includes('MAPREDUCETASK')) {

                        var getRunningMRScript = savedSearch.ssearch({
                            type: 'getMRScript',
                            record: 'scheduledscriptinstance',
                            filters: [
                                ["taskid", "contains", objMRStatus.status],
                                "AND",
                                ["mapreducestage", "anyof", "GET_INPUT"]
                            ]
                        })

                        if (mapper.mr.parent.toUpperCase() == getRunningMRScript[0].scriptid) {
                            objMessage = { ...objMessage, ...libNotifAndErrorMsg.objMessages.mapReduceMessage.refresh }
                        } else if (mapper.generateQuoteMR.parent.toUpperCase() == getRunningMRScript[0].scriptid) {
                            objMessage = { ...objMessage, ...libNotifAndErrorMsg.objMessages.mapReduceMessage.generateQuote }
                        }
                    }
                }

                log.debug('objCurrentRecord | strMrStatus', objMRStatus)

            } catch (e) {
                log.debug('ClientScript | ', e)
            }
            return objMessage
        }


        return {
            appendItems,
            getRefreshQuote,
            refreshQuote,
            getMrStatus
        }
    })