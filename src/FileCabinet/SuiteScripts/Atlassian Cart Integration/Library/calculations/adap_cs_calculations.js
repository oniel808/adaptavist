/**
 * @NApiVersion 2.1
 */
define(['N/currency', './calculations.js', '../FieldAndValueMapper/adap_field_and_def_value_mapper.js'],

    (currency, libCalculations, libMapper) => {

        PUBLIC = {};
        PRIVATE = {};

        const CURRENCY_USD = libMapper.currency.usd.text
        PUBLIC.reCalculateInsertedItems = (options) => {
            try {
                console.log('reCalculateInsertedItems | options', options);
                const CUSTOMER_DISCOUNT_RATE_FIELD = 'customerDiscountRate'
                const CUSTOMER_DISCOUNT_AMOUNT_FIELD = 'customerDiscountAmount'
                var curRec = options.record;
                var objBodyfields = libMapper.estimateFields.fields;
                var intCurrencyBuffer = curRec.getValue(objBodyfields.currencyBuffer.id);
                var intToUSDCurrencyRate = curRec.getValue(objBodyfields.toUsdConversion.id);
                var intUSDCurrencyRate = curRec.getValue(objBodyfields.usdConversion.id);
                var strCurrency = curRec.getValue('currencysymbol');
                var intLineCount = curRec.getLineCount({ sublistId: 'item' });
                var sublistItemFields = libMapper[libMapper.estimateFields.id + 'Fields'].sublist.item;
                var ignoreSublistFields = ['newListPrice_rate', 'newListPrice_amount', 'totalDiscount'];

                for (let intLineIndex = 0; intLineIndex < intLineCount; intLineIndex++) {
                    var objUnfixedValues = {}
                    curRec.selectLine({ sublistId: 'item', line: intLineIndex });
                    var strUnFixedValues = curRec.getCurrentSublistValue({
                        sublistId: libMapper.sublists.item,
                        fieldId: sublistItemFields.unfixedValues.id
                    });

                    if (strUnFixedValues) {
                        objUnfixedValues = JSON.parse(strUnFixedValues)
                    }
                    for (const field in sublistItemFields) {
                        var fltToFixedValue = 0;
                        var objField = { ...sublistItemFields[field] };
                        if (!strUnFixedValues) {
                            fltToFixedValue = curRec.getCurrentSublistValue({
                                sublistId: libMapper.sublists.item,
                                fieldId: sublistItemFields[field].id
                            });
                        } else {
                            fltToFixedValue = objUnfixedValues[field]
                        }
                        console.log('fltToFixedValue', fltToFixedValue)
                        var fltUnfixedValue = fltToFixedValue;

                        fltToFixedValue = libCalculations.toFixNumber(fltToFixedValue)
                        if (objField.type != 'currency' || ignoreSublistFields.includes(sublistItemFields[field].id)) {
                            continue
                        }

                        if (objField.type == 'currency' && objField.inputType != 'special' && CURRENCY_USD != strCurrency) {
                            fltUnfixedValue = libCalculations.applyCurrencyExchange({ value: fltToFixedValue, rate: intUSDCurrencyRate })
                        } else if (objField.type == 'currency' && objField.inputType != 'special' && CURRENCY_USD == strCurrency) {
                            fltUnfixedValue = libCalculations.removeCurrencyExchange({ value: fltToFixedValue, rate: intToUSDCurrencyRate })
                        }
                        fltToFixedValue = libCalculations.toFixNumber(fltUnfixedValue);

                        if (objField.hasBuffer && CURRENCY_USD != strCurrency) {
                            fltUnfixedValue = libCalculations.applyCurrencyBuffer({ value: fltUnfixedValue, currencyBuffer: intCurrencyBuffer });
                            fltToFixedValue = libCalculations.toFixNumber(fltUnfixedValue);
                        } else if (objField.hasBuffer && CURRENCY_USD == strCurrency) {
                            fltUnfixedValue = libCalculations.removeCurrencyBuffer({ value: fltUnfixedValue, currencyBuffer: intCurrencyBuffer });
                            fltToFixedValue = libCalculations.toFixNumber(fltUnfixedValue);
                        }

                        objField.type = 'value';
                        objUnfixedValues[field] = fltUnfixedValue

                        if (fltToFixedValue >= 0 && field != CUSTOMER_DISCOUNT_RATE_FIELD) {
                            curRec.setCurrentSublistValue({
                                sublistId: libMapper.sublists.item,
                                fieldId: sublistItemFields[field].id,
                                value: fltToFixedValue,
                                ignoreFieldChange: true
                            });
                        }
                    }
                    objUnfixedValues.customerDiscountRate = (objUnfixedValues.customerDiscountAmount / objUnfixedValues.newListPrice) * 100;
                    objUnfixedValues.margin = objUnfixedValues.customerPrice - objUnfixedValues.avstTotal;

                    curRec.setCurrentSublistValue({
                        sublistId: libMapper.sublists.item,
                        fieldId: sublistItemFields.margin.id,
                        value: libCalculations.toFixNumber(objUnfixedValues.margin),
                        ignoreFieldChange: true
                    });
                    curRec.setCurrentSublistValue({
                        sublistId: libMapper.sublists.item,
                        fieldId: sublistItemFields.newListPrice_rate.id,
                        value: libCalculations.toFixNumber(objUnfixedValues.newListPrice),
                        ignoreFieldChange: true
                    });
                    curRec.setCurrentSublistValue({
                        sublistId: libMapper.sublists.item,
                        fieldId: sublistItemFields.newListPrice_amount.id,
                        value: libCalculations.toFixNumber(objUnfixedValues.newListPrice),
                        ignoreFieldChange: true
                    });
                    var strUnfixedValues = JSON.stringify(objUnfixedValues)
                    console.log('strUnfixedValues', strUnfixedValues)
                    curRec.setCurrentSublistValue({
                        sublistId: libMapper.sublists.item,
                        fieldId: sublistItemFields.unfixedValues.id,
                        value: strUnfixedValues,
                        ignoreFieldChange: true
                    });

                    curRec.commitLine({ sublistId: 'item' });
                }
                if (CURRENCY_USD == strCurrency) {
                    curRec.setValue({ fieldId: objBodyfields.toUsdConversion.id, value: 1 });
                    curRec.setValue({ fieldId: objBodyfields.usdConversion.id, value: 1 });
                }
            } catch (e) {
                console.error('reCalculateInsertedItems', e);
            }
        }

        return PUBLIC
    })