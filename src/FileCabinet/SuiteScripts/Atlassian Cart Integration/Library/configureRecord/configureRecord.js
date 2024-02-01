/**
 * @NApiVersion 2.1
 */
define(['N/record',
    '../calculations/calculations.js', '../../Opportunity/UserEvent/lib/ada_ue_helper.js', '../TechnicalContact/adap_lib_tech_contact.js',
    '../../Atlassian/api/lib/mapper.js', '../htmllib/moment/momentjs.js'],
    /**
 * @param{record} record
 */
    (record,
        libCalculations, libMaintenancePeriod, libTechContact,

        MAPPER, moment) => {
        PUBLIC = {};
        PRIVATE = {};

        PUBLIC.configRecord = (option) => {
            let maptype = option.type;
            let data = option.data;
            let intIDReturn;
            let objRecord;
            let intCurrencyBuffer;
            if (option.method == METHOD_CREATE || (option.method == METHOD_ADDITEMS && (option.option.estid == 'null' || !option.option.estid))) {
                objRecord = record.create({
                    type: MAPPER[maptype].id,
                    isDynamic: true,
                });
            } else if (option.method == METHOD_UPDATE || (option.method == METHOD_ADDITEMS && (option.option.estid != 'null' || option.option.estid))) { //|| option.method == METHOD_ADDITEMS)

                var objDataRec = {
                    type: MAPPER[maptype].id,
                    id: option.id,
                    values: {},
                    defaultValues: {},
                    isDynamic: true
                }
                log.debug('configureRecord | cf: ', option.cf)
                if (option.method == METHOD_ADDITEMS) {
                    objDataRec.defaultValues.cf = MAPPER.customForms.estimate
                }
                objRecord = record.load(objDataRec);
            } else if (option.method == 'addedToEstimate') {
                var objDataRec = {
                    type: MAPPER[maptype].id,
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
                    type: MAPPER[maptype].id,
                    id: option.id,
                    values: {
                        [MAPPER[maptype].fields.cartEstimate.id]: option.estimate,
                        isinactive: false
                    },
                    option: {
                        ignoreMandatoryFields: true
                    }
                });
            } else if (option.method == 'delete') {
                return record.delete({
                    type: MAPPER[maptype].id,
                    id: option.id,
                })
            }


            let objFieldIds = MAPPER[maptype].fields;

            //add bodyfield values
            for (const fieldkey in objFieldIds) {
                var dataValue = maptype == record.Type.ESTIMATE ? option.option[fieldkey] : data[fieldkey]

                let field = objFieldIds[fieldkey]
                let fieldType = ''
                if (typeof dataValue == 'undefined' ||
                    typeof dataValue == 'null' ||
                    dataValue == 'undefined' ||
                    dataValue == 'null' ||
                    dataValue == null ||
                    dataValue == undefined
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
            }

            //add sublist values
            if (option.method == METHOD_ADDITEMS) {
                if (maptype == record.Type.ESTIMATE) {
                    libCalculations.setCurrencyRateBuffer({
                        record: objRecord,
                        fieldId: 'currency'
                    });
                    intCurrencyBuffer = objRecord.getValue(MAPPER.estimate.fields.currencyBuffer.id);
                }

                let strCurrencyCode
                try {
                    let strTrandate = objRecord.getValue("trandate");
                    strCurrencyCode = objRecord.getValue("currencysymbol");
                    let objTransactionDate = strTrandate ? new Date(strTrandate) : new Date();
                    intCurrencyRate = libCalculations.currencyExchange({
                        to: strCurrencyCode,
                        date: objTransactionDate
                    });
                    intUSDCurrencyRate = libCalculations.currencyExchange({
                        from: strCurrencyCode,
                        date: objTransactionDate
                    });
                    objRecord.setValue(MAPPER.estimate.fields.usdConversion.id, intCurrencyRate);
                    objRecord.setValue(MAPPER.estimate.fields.toUsdConversion.id, intUSDCurrencyRate);
                } catch (e) {
                    log.debug('intCurrencyRate Error', e)
                }

                //update ship and bill address before setting lines
                log.debug('updateShipAndBillAddress');
                log.audit('Available Governance Score | START OF updateShipAndBillAddress', objScript.getRemainingUsage());
                libMaintenancePeriod.updateShipAndBillAddress(objRecord, true);
                log.audit('Available Governance Score | END OF updateShipAndBillAddress', objScript.getRemainingUsage());

                var sublistItemFields = MAPPER[maptype].sublist.item;
                for (const items of option.data) {
                    var intLineItem = objRecord.findSublistLineWithValue({
                        sublistId: SUBLISTID,
                        fieldId: MAPPER[maptype].sublist.item.cartitemid.id,
                        value: items.cartitemid,
                    })
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
                                if (field == 'lineItemRate') {
                                    objRateLine = {
                                        sublistId: SUBLISTID,
                                        fieldId: 'rate',
                                        line: intLineItem
                                    }
                                    value = objRecord.getCurrentSublistValue(objRateLine);
                                    objRateLine.value = value
                                    objRateLine.fieldId = 'amount'
                                    objRecord.setCurrentSublistValue(objRateLine);
                                    objItemToBeSet[objRateLine.fieldId] = objRateLine.value
                                    continue
                                }
                            } else {
                                continue
                            }
                        }

                        var objField = { ...sublistItemFields[field] };
                        if (objField.type == 'currency' && objField.inputType != 'special') {
                            value = libCalculations.toFixNumber(value / intUSDCurrencyRate);
                            if (MAPPER.bufferFields.includes(field) && strCurrencyCode != MAPPER.currency.usd.text) {
                                value = libCalculations.toFixNumber(value * (1 + (intCurrencyBuffer / 100)));
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
                                text: value,
                                line: intLineItem
                            };
                            if (objSublistValue.fieldId == 'item' && !objSublistValue.value) {
                                hasItemId = false;
                            }
                            if (objField.type == 'value') {
                                objRecord.setCurrentSublistValue(objSublistValue);
                            } else {
                                objRecord.setCurrentSublistText(objSublistValue);
                            }
                            objItemToBeSet[objField.id] = value
                        }
                        arrLogItem.push(objSublistValue)
                    }
                    if (hasItemId) {
                        log.debug('TAX CODE value |' + objRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                        }), objRecord.getCurrentSublistText({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                        }))
                        log.debug('objItemToBeSet', objItemToBeSet)
                        objRecord.commitLine({ sublistId: SUBLISTID })
                    }
                }

                for (const line of option.removeLines) {

                    var intLineItem = objRecord.findSublistLineWithValue({
                        sublistId: SUBLISTID,
                        fieldId: MAPPER[maptype].sublist.item.cartitemid.id,
                        value: line.cartitemid,
                    });
                    objRecord.removeLine({
                        sublistId: SUBLISTID,
                        line: intLineItem
                    });

                }
                libMaintenancePeriod.updateMaintenancePeriod(objRecord)
                libCalculations.estimateSummaryCalculation(objRecord)
            }
            intIDReturn = objRecord.save();
            log.audit('Available Governance Score | SAVING RECORD ............... ', objScript.getRemainingUsage());

            if (option.method == METHOD_ADDITEMS || option.type == 'estimate') {
                libTechContact.attachContactToEstimate(intIDReturn)
            }
            return intIDReturn
        }

        return PUBLIC

    });
