/**
 * @NApiVersion 2.1
 */
define(['N/currency',
    '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../SQL/adap_sql_library.js', '../configureRecord/configureRecordClientSide.js'],

    (currency,
        libMapper, libSuitesQl, libConfigureRecordForCS) => {
        const PRIVATE = {};
        const PUBLIC = {};
        const USD_CURRENCY = 'USD';
        const CURRENCY_FIELD = 'currency';
        const UKRAINIAN_HRYVNIA = 11;
        const UKRAINIAN_HRYVNIA_BUFFER_RATE = 3;
        const NON_US_BUFFER_RATE = 5;
        const CURRENCY_SYMBOL_FIELD = 'currencysymbol';
        const TRANSACTION_DATE = 'trandate'
        const NEW_UPGRADE_SALES_TYPE = 'NEW UPGRADE';
        const UPGRADE_CREDIT = 'UPGRADE_CREDIT';
        const MARKETPLACE_PROMOTION = 'MARKETPLACE_PROMOTION';
        const SALES_TYPE_NEW = 'NEW';
        const TOTALTRANSACTIONDISCOUNT_PROP = 'totalTransactionDiscount';
        const SALES_TYPE_UPGRADE = 'UPGRADE';

        /* 
        sample use:
            var objCartSummary = libCalculation.atlassianCartSummaryCalculation({
                items:arrItems
            })
        */
        PUBLIC.atlassianCartSummaryCalculation = (options) => {
            try {
                var arrItems = options.items
                let objSummary = {
                    totalAvstPrice: 0,
                    totalAvstDiscount: 0,
                    totalCreditAmount: 0,
                    totalCustomerPrice: 0,
                    totalMargin: 0,
                    totalCustomerDiscount: 0,
                    totalDiscountRate: 0,
                    totalListPrice: 0,
                    totalNewListPrice: 0,
                    totalListPriceAdjustment: 0,
                    totalUpgradeCredit: 0,
                    totalListPriceWAdjustment: 0,
                    totalTransactionDiscount: 0
                }
                arrItems.forEach((line, index) => {
                    objSummary.totalAvstPrice += PUBLIC.toFixNumber(line.avstTotal || 0);
                    objSummary.totalAvstDiscount += PUBLIC.toFixNumber(line.avstDiscountAmount || 0);
                    objSummary.totalCreditAmount += PUBLIC.toFixNumber(line.creditAmount || 0);
                    objSummary.totalCustomerPrice += PUBLIC.toFixNumber(line.customerPrice || 0);
                    objSummary.totalMargin = PUBLIC.toFixNumber(objSummary.totalMargin + line.margin || 0);
                    objSummary.totalCustomerDiscount += PUBLIC.toFixNumber(line.customerDiscountAmount || 0);
                    objSummary.totalDiscountRate += PUBLIC.toFixNumber(line.customerDiscountRate || 0);
                    objSummary.totalListPrice += PUBLIC.toFixNumber(line.listPrice || 0);
                    objSummary.totalNewListPrice += PUBLIC.toFixNumber(line.newListPrice || 0);
                    objSummary.totalListPriceAdjustment += PUBLIC.toFixNumber(line.priceAdjustment || 0);
                    objSummary.totalUpgradeCredit += PUBLIC.toFixNumber(line.upgradeCredit || 0);

                    objSummary.totalListPriceWAdjustment = PUBLIC.toFixNumber(objSummary.totalListPrice - objSummary.totalCreditAmount);
                });
                objSummary.totalAvstPrice = PUBLIC.toFixNumber(objSummary.totalAvstPrice);
                objSummary.totalAvstDiscount = PUBLIC.toFixNumber(objSummary.totalAvstDiscount);

                objSummary.totalTransactionDiscount = objSummary.totalCustomerDiscount;

                for (const summaryKey in objSummary) {
                    objSummary[summaryKey] = PUBLIC.toFixNumber(objSummary[summaryKey])
                }
                return objSummary
            } catch (e) {
                log.debug('atlassianCartSummaryCalculation | error ', e)
            }
        }

        /*
        sample use:
            objCurrentRecord = record.load(...)
            estimateSummaryCalculation(objCurrentRecord)
            objCurrentRecord.save()
        */
        PUBLIC.estimateSummaryCalculation = (objRecord) => {
            try {
                var strCurrencySymbol = objRecord.getValue(CURRENCY_SYMBOL_FIELD);
                var strTrandate = objRecord.getValue(TRANSACTION_DATE);
                var fltCurrencyBuffer = objRecord.getValue(libMapper.estimateFields.fields.currencyBuffer.id)

                var intCurrencyRate = PUBLIC.currencyExchange({
                    to: strCurrencySymbol,
                    date: strTrandate || new Date()
                });

                var intUSDCurrencyRate = PUBLIC.currencyExchange({
                    from: strCurrencySymbol,
                    date: strTrandate || new Date()
                });

                var intRate = 0;
                var objEstimateSummary = {
                    totalAvstPrice: 0,
                    totalAvstDiscount: 0,
                    totalCreditAmount: 0,
                    totalCustomerPrice: 0,
                    totalMargin: 0,
                    totalMarginPercentage: 0,
                    totalCustomerDiscount: 0,
                    totalTransactionDiscount: 0,
                    totalDiscountRate: 0,
                    totalListPrice: 0,
                    totalNewListPrice: 0,
                    totalListPriceAdjustment: 0,
                    totalUpgradeCredit: 0,
                    usdConversion: 0,
                    toUsdConversion: 0,
                    totalQuotes: 0,
                    openQuotes: 0,
                    generatedQotes: 0,
                    importedQuotes: 0
                };

                let intLineCount = objRecord.getLineCount({ sublistId: 'item' });
                let arrAtlCartIds = [];
                var arrToSearchCartsStatus = []
                objEstimateSummary.totalLines = intLineCount;
                objQuoteCounter = {};

                for (let lineCounter = 0; lineCounter < intLineCount; lineCounter++) {
                    var subItems = libMapper.estimateFields.sublist.item;
                    for (const itemKey in objEstimateSummary) {
                        var fieldId = ''
                        for (let subItemKey in subItems) {
                            if (subItems[subItemKey].headerCounterPart == itemKey) {
                                fieldId = subItems[subItemKey].id
                            } else if (itemKey == TOTALTRANSACTIONDISCOUNT_PROP) {
                                fieldId = subItems.customerDiscountAmount.id
                            }
                        }
                        var objEstimateSummaryGetValue = {
                            sublistId: 'item',
                            fieldId: fieldId,
                            line: lineCounter
                        }
                        if (!fieldId) {
                            continue;
                        }
                        var value = objRecord.getSublistValue(objEstimateSummaryGetValue);
                        if (typeof value == 'undefined' || typeof value == 'null' || value == 'undefined' || value == 'null') {
                            continue;
                        }
                        if (itemKey == TOTALTRANSACTIONDISCOUNT_PROP) {
                            objEstimateSummary[itemKey] += value;
                            continue;
                        }
                        value = PUBLIC.convertAmountToUSD({
                            usdCurrencyRate: intUSDCurrencyRate,
                            currencyBuffer: fltCurrencyBuffer,
                            currencySymbol: strCurrencySymbol,
                            amount: value
                        });

                        objEstimateSummary[itemKey] += value;
                    }

                    var cartName = objRecord.getSublistText({
                        sublistId: 'item',
                        fieldId: subItems.cartId.id,
                        line: lineCounter
                    }) || 'nonmarket';

                    var cartId = objRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: subItems.cartId.id,
                        line: lineCounter
                    });

                    objQuoteCounter[cartName] = {
                        cartId: cartId,
                        lineCountPerCart: objQuoteCounter[cartName] ? objQuoteCounter[cartName].lineCountPerCart : 0
                    }
                    objQuoteCounter[cartName].lineCountPerCart++
                    if (!arrToSearchCartsStatus.includes(cartId) && cartId) {
                        arrToSearchCartsStatus.push(cartId)
                    }
                }

                intRate = objEstimateSummary.totalTransactionDiscount;
                intRate = PUBLIC.amountInverter(intRate)
                objEstimateSummary.totalTransactionDiscount = intRate

                if (arrToSearchCartsStatus.length) {
                    var arrCartStatuses = libSuitesQl.search({
                        type: 'getCartStatuses',
                        params: {
                            cartids: arrToSearchCartsStatus.join(',')
                        }
                    });

                    for (const objCart of arrCartStatuses) {
                        objQuoteCounter[objCart.name].uuid = objCart.uuid;
                        // objQuoteCounter[objCart.name].lineCountPerCart
                        if (objCart.status == libMapper.cartStatus.openStatus) {
                            objEstimateSummary.openQuotes++;
                        } else if (objCart.status == libMapper.cartStatus.quotedStatus && !objCart.uuid) {
                            objEstimateSummary.importedQuotes++;
                        } else if (objCart.status == libMapper.cartStatus.quotedStatus && objCart.uuid) {
                            objEstimateSummary.generatedQotes++;
                        }
                        objEstimateSummary.totalQuotes++;
                    }


                    objEstimateSummary.totalUpgradeCredit = objEstimateSummary.totalCreditAmount;
                }

                log.debug('objEstimateSummary', objEstimateSummary);
            } catch (e) {
                log.debug('error Reading Body Fields', e)
            }
            try {
                objEstimateSummary.usdConversion = intCurrencyRate;
                objEstimateSummary.toUsdConversion = intUSDCurrencyRate;
                var ignoreToFixFields = ['usdConversion', 'toUsdConversion'];

                log.debug('objEstimateSummary', objEstimateSummary);
                for (const key in objEstimateSummary) {
                    var value = objEstimateSummary[key];
                    const field = libMapper.estimateFields.fields[key];

                    if (typeof value == 'undefined' || typeof value == 'null' || value == 'undefined' || value == 'null' || !field) {
                        continue
                    }

                    if (field.type == 'currency') {
                        field.type = 'value'
                    }

                    if (!ignoreToFixFields.includes(key)) {
                        value = PUBLIC.toFixNumber(value)
                    } else {
                        continue
                    }

                    let objValueSetter = {
                        fieldId: field.id,
                        [field.type]: value
                    }

                    if (field.type == 'value') {
                        objRecord.setValue(objValueSetter)
                    } else {
                        objRecord.setText(objValueSetter)
                    }
                }

                if (objEstimateSummary.totalCustomerPrice && objEstimateSummary.totalMargin) {
                    var fltTotalMarginPercentage = PUBLIC.toFixNumber((objEstimateSummary.totalMargin / objEstimateSummary.totalCustomerPrice) * 100)
                    log.debug('fltTotalMarginPercentage', fltTotalMarginPercentage);
                    objRecord.setValue({
                        fieldId: libMapper.estimateFields.fields.totalMarginPercentage.id,
                        value: fltTotalMarginPercentage
                    });
                } else {
                    objRecord.setValue({
                        fieldId: libMapper.estimateFields.fields.totalMarginPercentage.id,
                        value: 0
                    });
                }
                if (objEstimateSummary.totalCustomerDiscount && objEstimateSummary.totalNewListPrice) {
                    var fltTotalDiscountRate = PUBLIC.toFixNumber((objEstimateSummary.totalCustomerDiscount / objEstimateSummary.totalNewListPrice) * 100)
                    log.debug('fltTotalDiscountRate', fltTotalDiscountRate);
                    objRecord.setValue({
                        fieldId: libMapper.estimateFields.fields.totalDiscountRate.id,
                        value: fltTotalDiscountRate
                    });
                } else {
                    objRecord.setValue({
                        fieldId: libMapper.estimateFields.fields.totalDiscountRate.id,
                        value: 0
                    });
                }
                PUBLIC.setCurrencyRateBuffer({
                    record: objRecord,
                    fieldId: CURRENCY_FIELD
                })
            } catch (e) {
                log.debug('Error Reading Line', e)
            }
        }

        PUBLIC.amountInverter = (intRate) => {
            log.debug('amountInverter', intRate)
            if (intRate) {
                if (intRate > 0) {
                    intRate = Math.abs(intRate) * -1
                } else {
                    intRate = Math.abs(intRate)
                }
            } else {
                intRate = 0
            }
            return intRate
        }

        PUBLIC.convertAmountToUSD = (options) => {
            var intUSDCurrencyRate = options.usdCurrencyRate;
            var fltCurrencyBuffer = options.currencyBuffer;
            var strCurrencySymbol = options.currencySymbol;
            var fltAmount = options.amount;

            fltAmount = PUBLIC.toFixNumber(fltAmount * intUSDCurrencyRate);
            if (strCurrencySymbol != USD_CURRENCY) {
                fltAmount = PUBLIC.toFixNumber(fltAmount / (1 + (fltCurrencyBuffer / 100)));
            }
            return fltAmount
        }

        /* 
        sample use:
            var objItem = libCalculations.atlassianCartItemCalculation({
                item:objItem
            })
        */
        PUBLIC.atlassianCartItemCalculation = (options) => {
            var objItem = options.item;
            try {
                if (objItem.saleType === SALES_TYPE_NEW &&
                    objItem.description.toUpperCase().includes(SALES_TYPE_UPGRADE)
                ) {
                    objItem.saleType = NEW_UPGRADE_SALES_TYPE;
                }
                // lowcase customerDiscountRate will come from the SQL which the column cannot be transform to uppercase
                objItem.customerDiscountRate = objItem.customerdiscountrate || objItem.customerDiscountRate || 0;

                objItem.newListPrice = PUBLIC.toFixNumber(objItem.listPrice - (objItem.upgradeCredit + objItem.priceAdjustment));
                objItem.newListPrice = objItem.newListPrice >= 0 ? objItem.newListPrice : 0;
                objItem.newListPrice_rate = objItem.newListPrice;
                objItem.newListPrice_amount = objItem.newListPrice;

                let intCustomerDiscountAmount = ((objItem.customerDiscountRate / 100) * objItem.newListPrice);

                objItem.avstTotal = PUBLIC.toFixNumber(objItem.listPrice - (objItem.priceAdjustment + objItem.upgradeCredit + objItem.avstDiscountAmount));
                objItem.avstTotal = objItem.avstTotal >= 0 ? objItem.avstTotal : 0;

                objItem.customerDiscountAmount = PUBLIC.toFixNumber(intCustomerDiscountAmount);

                objItem.customerPrice = PUBLIC.toFixNumber(objItem.newListPrice - intCustomerDiscountAmount);
                objItem.customerPrice = objItem.customerPrice >= 0 ? objItem.customerPrice : 0;
                objItem.margin = PUBLIC.toFixNumber(objItem.customerPrice - objItem.avstTotal);
                objItem.totalDiscount = PUBLIC.toFixNumber(objItem.avstDiscountAmount + intCustomerDiscountAmount);

            } catch (e) {
                log.debug('atlassianCartItemCalculation | error', e)
            }
            return objItem
        }

        /* 
        sample use:
            var arrDiscountRules = libCalculations.getDiscountRules({
                items:arrItems
            })
        */
        PUBLIC.getDiscountRules = (options) => {
            const MAP_DISCOUNTRULES = 'netsuiteDiscountRules';
            const METHOD_CREATE = 'create';
            var arrItems = options.items || [];
            let arrSearchDiscountRules = libSuitesQl.search({
                type: 'getDiscountRules',
            });
            let arrNewSearchDiscountRules = {}
            for (const discountRule of arrSearchDiscountRules) {
                if (typeof arrNewSearchDiscountRules[discountRule.type] == 'undefined') {
                    arrNewSearchDiscountRules[discountRule.type] = []
                }
                arrNewSearchDiscountRules[discountRule.type].push(discountRule)
            }

            for (const item of arrItems) {
                var arrItemDiscounts = item.discountDetails || item.discounts || []
                for (const discount of arrItemDiscounts) {

                    var discountIndex = arrNewSearchDiscountRules[discount.type].findIndex((obj) => obj.reason == discount.reason);

                    if (discountIndex < 0 && discount.type != 'MARKETPLACE_PROMOTION') {
                        libConfigureRecordForCS.configRecord({
                            type: MAP_DISCOUNTRULES,
                            data: {
                                discountName: discount.reason,
                                discountReason: discount.reason,
                                discountType: discount.type,
                            },
                            method: METHOD_CREATE
                        });
                        arrNewSearchDiscountRules[discount.type].push({
                            reason: discount.reason,
                            type: discount.type,
                            passed_to_customer: "F",
                            price_adjustment: "T",
                            avstdiscount: "F"
                        })
                    }

                }
            }
            log.debug('arrNewSearchDiscountRules', arrNewSearchDiscountRules)
            return arrNewSearchDiscountRules
        }

        PUBLIC.setCurrencyRateBuffer = (options) => {
            var curRecord = options.record
            var intCurrency = curRecord.getValue({
                fieldId: CURRENCY_FIELD
            });
            if (intCurrency == libMapper.currency.usd.id) {
            } else if (intCurrency == UKRAINIAN_HRYVNIA) {
                curRecord.setValue({
                    fieldId: libMapper.estimateFields.fields.currencyBuffer.id,
                    value: UKRAINIAN_HRYVNIA_BUFFER_RATE
                });
            } else {
                curRecord.setValue({
                    fieldId: libMapper.estimateFields.fields.currencyBuffer.id,
                    value: NON_US_BUFFER_RATE
                });
            }
        }

        PUBLIC.currencyExchange = (options) => {
            return currency.exchangeRate({
                source: options.from || USD_CURRENCY,
                target: options.to || USD_CURRENCY,
                date: options.date
            });
        }

        PUBLIC.discountsOrder = (options) => {
            var discountRules = options.discountRules;
            var objOutput = {
                upgradeCredit: 0,
                creditAmount: 0,
                avstDiscountAmount: 0,
                priceAdjustment: 0,
            };

            for (const discount of options.items) {

                var objRule = discountRules[discount.type].find((obj) => obj.reason == discount.reason || !obj.reason);

                if (objRule.reason == UPGRADE_CREDIT && objRule.passed_to_customer == 'T') {
                    objOutput.upgradeCredit += discount.amount;
                    objOutput.creditAmount += discount.amount;
                } else if (objRule.passed_to_customer == 'T' && objRule.price_adjustment == 'T') {
                    objOutput.priceAdjustment += discount.amount;
                } else if (objRule.avstdiscount == 'T' || discount.reason == MARKETPLACE_PROMOTION) {
                    objOutput.avstDiscountAmount += discount.amount;
                }
            }
            return objOutput;
        }

        PUBLIC.toFixNumber = (value) => {
            if (isFloat(value)) {
                value = value.toFixed(2);
            } else {
                value = parseFloat(value).toFixed(2);
            }
            return parseFloat(value || 0);

            function isFloat(n) {
                return Number(n) === n && n % 1 !== 0;
            }
        }

        PUBLIC.applyCurrencyBuffer = (options) => {
            return options.value * (1 + (options.currencyBuffer / 100))
        }
        PUBLIC.removeCurrencyBuffer = (options) => {
            return options.value / (1 + (options.currencyBuffer / 100))
        }
        PUBLIC.applyCurrencyExchange = (options) => {
            return options.value * options.rate
        }
        PUBLIC.removeCurrencyExchange = (options) => {
            return options.value / options.rate
        }

        return PUBLIC
    });
