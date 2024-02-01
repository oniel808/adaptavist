/**
 * @NApiVersion 2.1
 */
define(['N/query', 'N/search',
        '../../Library/saveSearch.js', '../../Library/SQL/adap_sql_library.js', '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],

    (query, search,
     savedSearch, libSQL, libFieldAndDefaultValue) => {

        const TECHNICAL_CONTACT = 'Technical Contact'
        const SALES_REP = 'SalesRep'
        const COMPANY_ADDRESS = 'Company Address'
        const TECHNICAL_CONTACT_ADDRESS = 'Technical Contact Address'
        const END_USER_ADDRESS = 'End User Address'
        const getMissingValuesInPayload = (option) => {
            let objPayloadReturn = getPayload(option)
            let objPayload = objPayloadReturn.payload
            let arrMissingData = []

            log.debug('objPayload', objPayload)
            getObjectMissingValue(TECHNICAL_CONTACT, objPayload.technicalContactDetails)
            getObjectMissingValue(SALES_REP, objPayload.purchaserContactDetails)
            getObjectMissingValue(SALES_REP, objPayload.billingContactDetails)
            let strMessageKey = ''
            if (objPayloadReturn.isCustomer) {
                strMessageKey = COMPANY_ADDRESS
            } else if (objPayloadReturn.isTechContact) {
                strMessageKey = TECHNICAL_CONTACT_ADDRESS
            } else {
                strMessageKey = END_USER_ADDRESS
            }
            getObjectMissingValue(strMessageKey, objPayload.technicalOrganisationDetails)

            function getObjectMissingValue(mainKey, objDetail) {
                // let exceptions = ["address2", "taxId", "xeroId", "state", "isoCountryCode"];
                let exceptions = libFieldAndDefaultValue.payloadException;
                if (objDetail.country == 'United States' || objDetail.country == 'India' || objDetail.country == 'Canada') {
                    exceptions = exceptions.filter(item => item !== "state");
                }
                for (let key in objDetail) {
                    if (objDetail[key] === null || objDetail[key] === '' || !objDetail[key]) {
                        let objMissingData = {}
                        objMissingData[mainKey] = key
                        if (!exceptions.includes(key)) {
                            arrMissingData.push(objMissingData)
                        }
                    }
                }
            }

            log.debug('arrMissingData', arrMissingData)
            return arrMissingData
        }

        const getPayload = (option) => {
            var objPayload = {}
            let isCustomer = false;
            let isTechContact = false;
            //get estimate details
            getEstimateDetailandEndUserAddress(option, objPayload)
            // get customer default billing if End User address is not  present
            if (!objPayload.technicalOrganisationDetails.address1 && !objPayload.technicalOrganisationDetails.country) {
                getDefaultBillingAddress(option, objPayload)
                isCustomer = true;
            } else {
                //get state shortName
                if (objPayload.technicalOrganisationDetails.state) {
                    log.debug('objPayload.technicalOrganisationDetails.state', objPayload.technicalOrganisationDetails.state)
                    let strGetStateShortName = libSQL.sqlQuery.getStateShortName
                    strGetStateShortName = strGetStateShortName.replace('{{stateId}}', objPayload.technicalOrganisationDetails.state)
                    log.debug('strGetStateShortName ', strGetStateShortName)

                    let arrStateShortName = query.runSuiteQL({
                        query: strGetStateShortName
                    }).asMappedResults();
                    objPayload.technicalOrganisationDetails.state = (arrStateShortName[0]).stateshortname
                }
            }

            let objTechContactDetail = search.lookupFields({
                type: search.Type.ESTIMATE,
                id: option.estId,
                columns: ['custbody_adap_override_cust_add', 'custbody_atl_tech_contact_email', 'custbody_atl_tech_contact_name']
            })
            log.debug('objTechContactDetail', objTechContactDetail)
            //set technical address as technical contact address is checkbox is checked
            if (objTechContactDetail.custbody_adap_override_cust_add) {
                setTechnicalAddressForContact(objTechContactDetail, objPayload)
                isTechContact = true
                isCustomer = false
            }
            log.audit('objPayload complete', objPayload)
            return {payload: objPayload, isCustomer: isCustomer, isTechContact: isTechContact}
        }

        const setTechnicalAddressForContact = (objTechContactDetail, objPayload) => {
            let strGetTechContactAddress = libSQL.sqlQuery.getTechnicalContactAddress
            strGetTechContactAddress = strGetTechContactAddress.replace('{{name}}', objTechContactDetail.custbody_atl_tech_contact_name)
            strGetTechContactAddress = strGetTechContactAddress.replace('{{email}}', objTechContactDetail.custbody_atl_tech_contact_email)
            let arrCompleteName = (objTechContactDetail.custbody_atl_tech_contact_name).split(" ")
            objPayload.technicalContactDetails.firstName = arrCompleteName[0]
            objPayload.technicalContactDetails.lastName = arrCompleteName[1]
            objPayload.technicalContactDetails.email = objTechContactDetail.custbody_atl_tech_contact_email
            // objPayload.technicalOrganisationDetails = {}
            log.debug('strGetTechContactAddress ', strGetTechContactAddress)

            let arrTechContactAddress = query.runSuiteQL({
                query: strGetTechContactAddress
            }).asMappedResults();
            log.debug('arrTechContactAddress ', arrTechContactAddress)
            if (arrTechContactAddress.length > 0) {
                let objDefaultBilling = arrTechContactAddress[0]
                const defaultAddressMapping = libFieldAndDefaultValue.companyDefaultBillingToPayload;
                objDefaultBilling.state = objDefaultBilling.shortname
                // let strCountryShortName = "select id from country where name='" + objDefaultBilling.country + "'"
                let strCountryShortName = libSQL.sqlQuery.getCountryShortName
                strCountryShortName = strCountryShortName.replace('{country}', objDefaultBilling.country)
                let arrCountryCode = query.runSuiteQL({
                    query: strCountryShortName
                }).asMappedResults();
                log.debug('arrCountryCode ', arrCountryCode)
                if (arrCountryCode.length > 0) {
                    objDefaultBilling.country = arrCountryCode[0].id
                }
                setTechOrgDetails(objPayload, objDefaultBilling)
            } else {
                // setTechOrgDetails(objPayload,null)
            }

        }

        const setTechOrgDetails = (objPayload, objDefaultBilling) => {
            const defaultAddressMapping = libFieldAndDefaultValue.companyDefaultBillingToPayload;
            for (let addressField in defaultAddressMapping) {
                if (addressField != 'organisationName') {
                    log.debug()
                    if (objDefaultBilling === null) {
                        objPayload.technicalOrganisationDetails[addressField] = ''
                    } else {
                        objPayload.technicalOrganisationDetails[addressField] = objDefaultBilling[defaultAddressMapping[addressField]]
                    }
                }
            }
        }

        const getEstimateDetailandEndUserAddress = (option, objPayload) => {
            var objDetails = savedSearch.ssearch({
                type: 'addCartDetails',
                filters: [
                    ["internalid", "anyof", option.estId],
                    "AND",
                    ["mainline", "is", "T"]
                ]
            })[0];
            log.debug('objDetails | 1', objDetails)

            //get Estimate billing Details
            var objBillingDetails = libSQL.search({
                type: 'getBillingDetails',
                params: {
                    countryCode: objDetails.technicalcountryinternalid || "''",
                    mac: option.mac || 1,
                }
            })[0];
            log.debug('objBillingDetails', objBillingDetails)

            let objAddressMapping = libFieldAndDefaultValue.EndUserAddressToPayload

            for (let payloadField in objAddressMapping) {
                objDetails[payloadField] = objBillingDetails[objAddressMapping[payloadField]]
            }
            log.debug('mapped details', objDetails)
            var objDetailsContact = getTechContact(option)

            objDetails = {
                ...objDetails,
                ...objDetailsContact,
                ...option
            }

            //map estimate details to payload object
            for (const parentKey in libFieldAndDefaultValue.addCartDetails) {
                log.debug('parentKey', parentKey)
                //  if (parentKey !== 'technicalOrganisationDetails') { //techOrgDetails will be set base on tech contact address
                objParentKeyValue = libFieldAndDefaultValue.addCartDetails[parentKey]
                log.debug('objParentKeyValue', objParentKeyValue)
                if (typeof objParentKeyValue != 'object') {
                    objPayload[parentKey] = objDetails[parentKey]
                    log.debug('objPayload[parentKey]', objPayload[parentKey])
                    log.debug(' objDetails[parentKey]', objDetails[parentKey])
                } else {
                    objPayload[parentKey] = {}
                    for (const childKey in objParentKeyValue) {
                        objPayload[parentKey][childKey] = objDetails[objParentKeyValue[childKey].id] || objParentKeyValue[childKey].default
                        log.debug(' objPayload[parentKey][childKey]', objPayload[parentKey][childKey])
                        log.debug(' objDetails[objParentKeyValue[childKey].id]', objDetails[objParentKeyValue[childKey].id])
                    }
                }
                //}
            }
            objPayload.purchaserContactDetails.email = objBillingDetails.auth_email;
            objPayload.billingContactDetails.email = objBillingDetails.auth_email;
            log.debug('objPayload after mapped details', objPayload)

        }

        const getTechContact = (option) => {
            var objDetailsContact = savedSearch.ssearch({
                type: 'addCartDetailsContacts',
                record: 'contact',
                filters: [["transaction.internalid", "anyof", option.estId]]
            })[0];

            return objDetailsContact
        }

        const getDefaultBillingAddress = (option, objPayload) => {
            let objEntity = search.lookupFields({
                type: search.Type.ESTIMATE,
                id: option.estId,
                columns: ['entity']
            });
            log.debug('objEntity', objEntity)
            let intEntity = (objEntity.entity)[0].value
            let strGetDefaultBillingQuery = libSQL.sqlQuery.getDefaultBilling
            strGetDefaultBillingQuery = strGetDefaultBillingQuery.replace('{{customerid}}', intEntity)
            log.debug('strGetDefaultBillingQuery ', strGetDefaultBillingQuery)

            let arrDefaultBilling = query.runSuiteQL({
                query: strGetDefaultBillingQuery
            }).asMappedResults();
            log.debug('arrDefaultBilling', arrDefaultBilling)

            if (arrDefaultBilling.length > 0) {
                let objDefaultBilling = arrDefaultBilling[0]
                const defaultAddressMapping = libFieldAndDefaultValue.companyDefaultBillingToPayload;
                for (let addressField in defaultAddressMapping) {
                    objPayload.technicalOrganisationDetails[addressField] = objDefaultBilling[defaultAddressMapping[addressField]]
                }
            }
        }


        return {getPayload, getMissingValuesInPayload}

    });
