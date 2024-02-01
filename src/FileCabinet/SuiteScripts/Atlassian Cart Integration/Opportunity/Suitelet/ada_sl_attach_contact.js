/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/redirect', 'N/query', '../../Opportunity/UserEvent/lib/ada_ue_validations_mapper.js',
        '../../Purchase Order/Library/adap_mod_handlebars.js', '../../Opportunity/UserEvent/lib/ada_ue_helper.js',
        '../../Library/TechnicalContact/adap_lib_tech_contact.js',
        '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js',
        '../../Library/SQL/adap_sql_library.js', '../../Library/NotifAndErrorMessage/adap_notif_error_msg.js'],

    (record, redirect, query, MAPPER, modHandleBars, libHelper,
     libTechContact, libFieldAndDefaultValue, libSQL, notifErrorMsgHelper) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            log.debug('Attaching Contact Start')
            let objParams = scriptContext.request.parameters;
            log.debug('objParams', objParams)
            let intEstimateId = objParams.estId
            log.debug('intEstimateId', intEstimateId)
            //unable to get the actual contact id from DOM
            let strContact = objParams.contact
            log.debug('strContact', strContact)

            try {
                if (strContact && intEstimateId) {
                    let arrContact = strContact.split(':')
                    log.debug('arrContact', arrContact)
                    //get the tech contact name
                    let strContactToSearch = arrContact[arrContact.length - 1]
                    strContactToSearch = strContactToSearch.trim()
                    log.debug('strContactToSearch', strContactToSearch)
                    if (strContactToSearch) {
                        let arrEstimateContacts = libTechContact.getEstimateContacts(intEstimateId)
                        log.debug('arrEstimateContacts', arrEstimateContacts)
                        let strContactName = strContactToSearch;
                        let strEmail = ''
                        for (const item of arrEstimateContacts) {
                            if (item.id === strContactToSearch) {
                                strEmail = item.email
                                break; // Exit the loop once a match is found
                            }
                        }

                        log.debug('strContactName', strContactName)
                        log.debug('strEmail', strEmail)

                        var arrUnsetCarts = libSQL.search({
                            type: 'getUnsetTechnicalContactInCarts',
                            params: {
                                estimate: intEstimateId || '',
                            }
                        });
                        log.debug('arrUnsetCarts', arrUnsetCarts)

                        let arrCartIdsToUpdate = []
                        let objEstimateRecord = loadDynamicRecord(record.Type.ESTIMATE, intEstimateId)
                        let objEstimateSublistFields = libFieldAndDefaultValue.estimateFields.sublist.item

                        //record.submitfields not working on the ff fields
                        objEstimateRecord.setValue({
                            fieldId: 'custbody_atl_tech_contact_email',
                            value: strEmail
                        })
                        objEstimateRecord.setValue({
                            fieldId: 'custbody_atl_tech_contact_name',
                            value: strContactName
                        })

                        // for (const cart of arrUnsetCarts) {
                        //     if (!arrCartIdsToUpdate.includes(cart.atlcartid)) {
                        //         arrCartIdsToUpdate.push(cart.atlcartid)
                        //     }
                        //     let objSublistValue = {
                        //         sublistId: 'item',
                        //         fieldId: objEstimateSublistFields.techName.id,
                        //         value: strContactName,
                        //         line: cart.lineid - 1,
                        //         ignoreFieldChange: true
                        //     }
                        //     objEstimateRecord.selectLine(objSublistValue)
                        //     objEstimateRecord.setCurrentSublistValue(objSublistValue)
                        //     objSublistValue.fieldId = objEstimateSublistFields.techEmail.id
                        //     objSublistValue.value = strEmail
                        //     objEstimateRecord.setCurrentSublistValue(objSublistValue)
                        //     objEstimateRecord.commitLine(objSublistValue)
                        // }
                        updateAddressFromTechContact(objEstimateRecord)
                        let intEstSaved = objEstimateRecord.save()
                        log.debug('intEstSaved', intEstSaved)
                        // libTechContact.updateCartContacts({ arrCartIdsToUpdate, strContactName, strEmail })
                    }

                }
                redirect.redirect({
                    url: MAPPER.estimateLink + intEstimateId
                })
            } catch (e) {
                log.debug('Error:', e)
            }

        }

        const loadDynamicRecord = (strRecType, id) => {
            let objRecord = record.load({
                type: strRecType,
                id: id,
                isDynamic: true
            })
            return objRecord
        }


        const updateAddressFromTechContact = (objEstimate) => {
            let strTechContactName = objEstimate.getValue('custbody_atl_tech_contact_name')
            let strTechContactEmail = objEstimate.getValue('custbody_atl_tech_contact_email')
            let strGetTechContactAddress = libSQL.sqlQuery.getTechnicalContactAddress
            strGetTechContactAddress = strGetTechContactAddress.replace('{{name}}', strTechContactName)
            strGetTechContactAddress = strGetTechContactAddress.replace('{{email}}', strTechContactEmail)
            log.debug('strGetTechContactAddress ', strGetTechContactAddress)

            let arrTechContactAddress = query.runSuiteQL({
                query: strGetTechContactAddress
            }).asMappedResults();
            log.debug('arrTechContactAddress ', arrTechContactAddress)
            if (arrTechContactAddress.length > 0) {
                let objAddressDetail = {
                    country: arrTechContactAddress[0].country,
                    state: arrTechContactAddress[0].shortname,
                    addressee: arrTechContactAddress[0].addressee,
                    addr1: arrTechContactAddress[0].addr1,
                    addr2: null,
                    city: arrTechContactAddress[0].city,
                    zip: arrTechContactAddress[0].zip,
                }

                let strAddress = formatAddress(objAddressDetail)
                objEstimate.setValue('custbody_atl_tech_contact_address', strAddress)
                objAddressDetail.country = getCountryShortName(arrTechContactAddress[0].country)


            } else {
                objEstimate.setValue('custbody_atl_tech_contact_address', notifErrorMsgHelper.objMessages.validateNotifMessage.noTechAddress.message)
                objEstimate.setValue('custbody_adap_override_cust_add', false)
            }
        }

        function formatAddress(addressObj) {
            let strAddress = '';
            let arrAddressSequence = ['addressee', 'addr1', 'city', 'state', 'zip', 'country']
            for (let addrField of arrAddressSequence) {
                if (addressObj[addrField]) {
                    if (addrField == 'city' || addrField == 'state') {
                        strAddress += addressObj[addrField] + ' '
                    } else {
                        strAddress += addressObj[addrField] + '\n'
                    }
                }
            }
            return strAddress;
        }

        const getCountryShortName = (country) => {
            let strQuery = libSQL.sqlQuery.getCountryShortName
            strQuery = strQuery.replace('{country}', country)
            let arrQueryResult = query.runSuiteQL({
                query: strQuery
            }).asMappedResults();
            if (arrQueryResult.length > 0) {
                return arrQueryResult[0].id
            }
        }

        return {onRequest}

    });
