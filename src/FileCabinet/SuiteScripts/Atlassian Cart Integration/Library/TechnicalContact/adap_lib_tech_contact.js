/**
 * @NApiVersion 2.1
 */
define(['N/query', 'N/record', 'N/search',
    'SuiteScripts/Atlassian Cart Integration/Purchase Order/Library/adap_mod_handlebars.js',
    '../../Library/SQL/adap_sql_library.js', '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],

    (query, record, search,
        modHandleBars,
        libSQL, libFieldAndDefaultValue) => {

        const MIN_PHONE_LENGTH = 7
        const DEFAULT_PHONE = "00000000"
        const attachContactToEstimate = (estimateId) => {
            log.audit('attachContactToEstimate', estimateId)
            try {
                let intContactId = null;
                if (estimateId) {
                    let objEstRecord = record.load({
                        type: record.Type.ESTIMATE,
                        id: estimateId,
                        isDynamic: true
                    })

                    let intItemCount = objEstRecord.getLineCount('item')

                    let intNewestCartId = objEstRecord.getSublistValue({
                        sublistId: libFieldAndDefaultValue.sublists.item,
                        fieldId: libFieldAndDefaultValue.estimateFields.sublist.item.cartId.id,
                        line: intItemCount - 1
                    })
                    log.audit('intNewestCartId', intNewestCartId)

                    if (intNewestCartId) {
                        let objCartRecord = record.load({
                            type: libFieldAndDefaultValue.atlassianCart.id,
                            id: intNewestCartId
                        })

                        let strReturnObj = objCartRecord.getValue(libFieldAndDefaultValue.atlassianCart.fields.quoteDataJson.id)

                        if (strReturnObj) {
                            let objReturn = JSON.parse(strReturnObj)
                            log.debug('objReturn', objReturn)
                            let objTechContact = objReturn.technicalContact
                            log.audit('objTechContact', objTechContact)
                            // if(!objTechContact){
                            //     let objEstimateFields = libFieldAndDefaultValue.estimateFields.fields
                            //     objTechContact = {
                            //         firstName: objEstRecord.getValue(objEstimateFields.techContactName.id),
                            //         lastName: '',
                            //         email: objEstRecord.getValue(objEstimateFields.techContactEmail.id),
                            //     }
                            // }
                            if (objTechContact) {
                                let arrAllEstimateContact = getEstimateContacts(estimateId)
                                log.audit('arrAllEstimateContact', arrAllEstimateContact)


                                let blnIsContactAttached = false;
                                let strEmailToCheck = objTechContact.email
                                //check if tech contact email is already attached in estimate
                                if (strEmailToCheck) {
                                    const arrMatchedTechContact = arrAllEstimateContact.filter(obj =>
                                        obj.email === objTechContact.email &&
                                        obj.firstname === objTechContact.firstName &&
                                        obj.lastname === objTechContact.lastName
                                    );
                                    // log.audit('arrMatchedTechContact', arrMatchedTechContact)
                                    if (arrMatchedTechContact.length > 0) {
                                        blnIsContactAttached = true;
                                        intContactId = arrMatchedTechContact[0].internalid
                                    }

                                    log.audit('blnIsContactAttached', blnIsContactAttached)
                                    if (!blnIsContactAttached) {
                                        //search is contact exist, if yes attach to record, if not create contact and attach to record
                                        let objContactDetailsForData = {
                                            email: objTechContact.email,
                                            firstname: objTechContact.firstName,
                                            lastname: objTechContact.lastName
                                        }
                                        let arrContacts = queryContactBaseOnName(objContactDetailsForData)
                                        log.audit('arrContacts to set Header', arrContacts)

                                        if (arrContacts.length > 0) {
                                            intContactId = arrContacts[0].id
                                        } else {
                                            intContactId = createContact(objEstRecord, objTechContact)
                                        }
                                    }
                                    let objValuesToAttachToEstimateLine = {
                                        // name: !objTechContact.lastName? objTechContact.firstName : objTechContact.firstName + ' ' + objTechContact.lastName,
                                        name: objTechContact.firstName + ' ' + objTechContact.lastName,
                                        email: objTechContact.email,
                                        cartId: intNewestCartId
                                    }
                                    if (intContactId) {
                                        attachValidatedContactToEstimate(intContactId, estimateId, objValuesToAttachToEstimateLine)
                                    }

                                    let objValuesToAttachToCart = {
                                        custrecord_adap_at_cart_tc_name: objTechContact.firstName + ' ' + objTechContact.lastName,
                                        custrecord_adap_at_cart_tc_email: objTechContact.email,
                                        custrecord_adap_at_cart_tc_link: intContactId
                                    }
                                    attachTechContactToCart({ cartid: intNewestCartId, data: objValuesToAttachToCart })
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                log.error('error contact Validation for Import/Refresh Quote', e.message)
            }
        }
        const syncEstimateContactToJSON = (estimateId) => {
            let objEstimate = loadDynamicEstimate(estimateId)
            let arrAllATLCarts = [];
            let arrAllEstimateContact = getEstimateContacts(estimateId)
            let intItemCount = objEstimate.getLineCount(libFieldAndDefaultValue.sublists.item)
            for (let intItemIndex = 0; intItemIndex < intItemCount; intItemIndex++) {
                let intATLCart = objEstimate.getSublistValue({
                    sublistId: libFieldAndDefaultValue.sublists.item,
                    fieldId: libFieldAndDefaultValue.estimateFields.sublist.item.cartId.id,
                    line: intItemIndex
                })
                arrAllATLCarts.push(intATLCart)
            }
            // log.audit('arrAllATLCarts', arrAllATLCarts)
            const arrATLCarts = [...new Set(arrAllATLCarts)];
            // log.audit('arrATLCarts', arrATLCarts)

            //get JSON tech Contact of ATL Cart compare with Estimate contacts //add or update if needed
            for (let intCart of arrATLCarts) {
                //   log.audit('intCart', intCart)
                if (intCart) {
                    let objCart = record.load({
                        type: libFieldAndDefaultValue.atlassianCart.id,
                        id: intCart,
                        isDynamic: true
                    })
                    let strJSON = objCart.getValue(libFieldAndDefaultValue.atlassianCart.fields.quoteDataJson.id)
                    let objTechContactJSON = (JSON.parse(strJSON)).technicalContact
                    //log.audit('objTechContactJSON', objTechContactJSON)
                    let intContactId = null;
                    if (objTechContactJSON) {
                        let hasMatch = false;
                        let strFirstNameToUpdate;
                        let strLastNameToUpdate;

                        for (const entry of arrAllEstimateContact) {

                            if (entry.firstname === objTechContactJSON.firstName && entry.lastname === objTechContactJSON.lastName) {
                                hasMatch = true;
                                strFirstNameToUpdate = objTechContactJSON.firstName;
                                strLastNameToUpdate = objTechContactJSON.lastName
                                break; // Exit the loop since a match is found
                            }
                        }
                        let objContactDetailsForData = {
                            email: objTechContactJSON.email,
                            firstname: objTechContactJSON.firstName,
                            lastname: objTechContactJSON.lastName
                        }
                        let arrContacts = queryContactBaseOnName(objContactDetailsForData)
                        // log.audit('hasMatchInEstimate', hasMatch)
                        // log.audit('strFirstNameToUpdate', strFirstNameToUpdate)
                        // log.audit('strLastNameToUpdate', strLastNameToUpdate)
                        log.audit('arrContacts', arrContacts)

                        if (hasMatch) {
                            if (arrContacts.length > 0) {
                                intContactId = arrContacts[0].id
                                let phone = objTechContactJSON.phone;
                                record.submitFields({
                                    type: record.Type.CONTACT,
                                    id: intContactId,
                                    values: {
                                        entityid: objTechContactJSON.firstName + ' ' + objTechContactJSON.lastName,
                                        firstname: objTechContactJSON.firstName,
                                        lastname: objTechContactJSON.lastName,
                                        email: objTechContactJSON.email,
                                        phone: phone,
                                    }
                                })
                            }
                        } else {
                            if (arrContacts.length > 0) {
                                intContactId = arrContacts[0].id
                            } else {
                                intContactId = createContact(objEstimate, objTechContactJSON)
                            }
                            // log.debug('intContactId', intContactId)

                        }
                        if (intContactId) {
                            let objValuesToAttachToEstimateLine = {
                                name: objTechContactJSON.firstName + ' ' + objTechContactJSON.lastName,
                                email: objTechContactJSON.email,
                                cartId: intCart
                            }
                            attachValidatedContactToEstimate(intContactId, estimateId, objValuesToAttachToEstimateLine)
                        }

                        let objValuesToAttachToCart = {
                            custrecord_adap_at_cart_tc_name: objTechContactJSON.firstName + ' ' + objTechContactJSON.lastName,
                            custrecord_adap_at_cart_tc_email: objTechContactJSON.email,
                            custrecord_adap_at_cart_tc_link: intContactId,
                        }
                        attachTechContactToCart({ cartid: intCart, data: objValuesToAttachToCart })

                    }
                }
            }
        }

        const attachTechContactToCart = (options) => {
            log.debug('attachTechContactToCart', options)
            record.submitFields({
                type: libFieldAndDefaultValue.atlassianCart.id,
                id: options.cartid,
                values: options.data
            })
        }
        const getEstimateContacts = (estimateId) => {
            let arrAllEstimateContact = [];
            var contactSearchObj = technicalContactSearch(estimateId)
            contactSearchObj.run().each(function (result) {
                let objResultFields = {
                    id: "entityid",
                    email: "email",
                    firstname: "firstname",
                    lastname: "lastname",
                    internalid: "internalid"
                }
                let objResultData = {}
                for (let field in objResultFields) {
                    objResultData[field] = result.getValue({
                        name: objResultFields[field],
                        summary: "GROUP"
                    });
                }
                arrAllEstimateContact.push(objResultData)
                return true;
            });
            log.debug('arrAllEstimateContact', arrAllEstimateContact)
            return arrAllEstimateContact
        }


        const queryContactBaseOnName = (data) => {
            let strFirstName = (data.firstname).replace("'", "''")
            let strLastName = (data.lastname).replace("'", "''")
            let strEmailToCheck = data.email
            let strSql = modHandleBars.getResponse({
                templateContent: libSQL.sqlQuery.getTechContactIfExisting,
                data: {
                    firstname: strFirstName,
                    lastname: strLastName
                }
            });
            log.audit('strSql getTechContactIfExisting', strSql)

            let arrContacts = query.runSuiteQL({
                query: strSql
            }).asMappedResults();

            log.debug('arrContacts', arrContacts)

            if (arrContacts.length > 0) {
                return arrContacts
            } else {
                let strSqlEmail = modHandleBars.getResponse({
                    templateContent: libSQL.sqlQuery.getContactBaseOnNameAndEmail,
                    data: {
                        firstname: strFirstName,
                        email: strEmailToCheck
                    }
                });
                arrContacts = query.runSuiteQL({
                    query: strSqlEmail
                }).asMappedResults();
                log.audit('strSqlEmail getTechContactIfExisting', strSqlEmail)
                return arrContacts
            }

        }
        const createContact = (objEstRecord, objTechContact) => {
            try {
                let phone = objTechContact.phone
                if (phone.length < MIN_PHONE_LENGTH) {
                    phone = DEFAULT_PHONE
                }
                log.debug('phone.length', phone.length)

                let objFieldAndValues = {
                    entityid: objTechContact.firstName + ' ' + objTechContact.lastName,
                    firstname: objTechContact.firstName,
                    lastname: objTechContact.lastName,
                    email: objTechContact.email,
                    phone: phone,
                    company: objEstRecord.getValue({ fieldId: 'entity' })
                }
                let objContact = record.create({
                    type: record.Type.CONTACT,
                })

                for (let field in objFieldAndValues) {
                    objContact.setValue({
                        fieldId: field,
                        value: objFieldAndValues[field]
                    })
                }
                let intContactId = objContact.save({
                    ignoreMandatoryFields: true
                })
                log.audit('created Contact', intContactId)
                return intContactId
            } catch (e) {
                log.audit('Issue Creating Contact', e.message)
            }
        }

        const attachValidatedContactToEstimate = (intContactId, intEstimateId, objValuesToAttachToEstimateLine) => {
            log.debug('objValuesToAttachToEstimateLine', objValuesToAttachToEstimateLine)
            var id = record.attach({
                record: {
                    type: 'contact',
                    id: intContactId
                },
                to: {
                    type: 'estimate',
                    id: intEstimateId
                }
            });

            //log.audit('attaching contact', intContactId)
            try {
                if (intContactId) {
                    log.audit('loading Contact', intContactId)
                    // log.audit('For Estimate', intEstimateId)
                    let objContact = record.load({
                        type: record.Type.CONTACT,
                        id: intContactId
                    })
                    //log.audit(objContact.getValue('entityid'), objContact.getValue('email'))
                    let strName = objContact.getValue('entityid');
                    let strEmail = objContact.getValue('email')

                    let objEstimate = record.load({
                        type: record.Type.ESTIMATE,
                        id: parseInt(intEstimateId),
                        isDynamic: true,
                    })
                    objEstimate.setValue({
                        fieldId: libFieldAndDefaultValue.estimateFields.fields.techContactName,
                        value: strName,
                    })
                    objEstimate.setValue({
                        fieldId: libFieldAndDefaultValue.estimateFields.fields.techContactEmail,
                        value: strEmail,
                    })

                    let intItemCount = objEstimate.getLineCount(libFieldAndDefaultValue.sublists.item)

                    for (let i = 0; i < intItemCount; i++) {
                        let intCartId = objEstimate.getSublistValue({
                            sublistId: libFieldAndDefaultValue.sublists.item,
                            fieldId: libFieldAndDefaultValue.estimateFields.sublist.item.cartId.id,
                            line: i
                        })
                        log.debug(intCartId, objValuesToAttachToEstimateLine.cartId)
                        if (intCartId == objValuesToAttachToEstimateLine.cartId) {
                            log.debug('intCartId and objValuesToAttachToEstimateLine.cartId is equal')
                            let objLine = objEstimate.selectLine({
                                sublistId: libFieldAndDefaultValue.sublists.item,
                                line: i
                            })
                            objLine.setCurrentSublistValue({
                                sublistId: libFieldAndDefaultValue.sublists.item,
                                fieldId: 'custcol_adap_tech_name',
                                value: objValuesToAttachToEstimateLine.name
                            })
                            objLine.setCurrentSublistValue({
                                sublistId: libFieldAndDefaultValue.sublists.item,
                                fieldId: 'custcol_adap_tech_email',
                                value: objValuesToAttachToEstimateLine.email
                            })
                            objLine.commitLine(libFieldAndDefaultValue.sublists.item)

                        }
                    }

                    let intSavedEstimate = objEstimate.save()

                    log.audit('intSavedEstimate', intSavedEstimate)
                }
            } catch (e) {
                log.error('error updating Tech Contact Header field', e.message)
            }

        }
        const technicalContactSearch = (estimateId) => {
            var contactSearchObj = search.create({
                type: "contact",
                filters:
                    [
                        ["transaction.internalidnumber", "equalto", estimateId]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "entityid",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "company",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "company"
                        }),
                        search.createColumn({
                            name: "email",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "email"
                        }),
                        search.createColumn({
                            name: "firstname",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "email"
                        }),
                        search.createColumn({
                            name: "lastname",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "email"
                        }),
                        search.createColumn({
                            name: "internalid",
                            summary: "GROUP",
                            sort: search.Sort.ASC,
                            label: "internalid"
                        }),
                    ]
            });
            return contactSearchObj
        }
        const loadDynamicEstimate = (id) => {
            let objEstRecord = record.load({
                type: record.Type.ESTIMATE,
                id: id,
                isDynamic: true
            })
            return objEstRecord
        }
        const updateCartContacts = (options) => {
            const { arrCartIdsToUpdate, strContactName, strEmail } = options;
            let objAtlCartFields = libFieldAndDefaultValue.atlassianCart.fields
            log.debug('arrCartIdsToUpdate', arrCartIdsToUpdate)
            for (const cartid of arrCartIdsToUpdate) {
                record.submitFields({
                    type: libFieldAndDefaultValue.atlassianCart.id,
                    id: cartid,
                    values: {
                        [objAtlCartFields.technicalContactName.id]: strContactName,
                        [objAtlCartFields.technicalContactEmail.id]: strEmail
                    }
                })
            }
        }
        return {
            syncEstimateContactToJSON,
            attachContactToEstimate,
            getEstimateContacts,
            updateCartContacts
        }

    });
