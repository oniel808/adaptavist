window.parent.require(['N/currentRecord', 'N/record'], (currentRecord, record) => {
    const FLD_CURRENCY = 'currency'
    var strCurrencyOption = '';
    var arrCurrencyEl = $('.estimate-currency .menu');
    const objCurRec = currentRecord.get();
    var fldCurrency = objCurRec.getField(FLD_CURRENCY);

    if (typeof fldCurrency.getSelectOptions != 'undefined') {
        console.log('this is IF')
        var arrCurrencies = fldCurrency.getSelectOptions();
        console.log('arrCurrencies', arrCurrencies);
        for (const currency of arrCurrencies) {
            strCurrencyOption += `<div class="item" data-value="${currency.value}">${currency.text}</div>`;
        }
        const strCurrencyText = objCurRec.getText({ fieldId: FLD_CURRENCY });
        console.log('strCurrencyText', strCurrencyText);
        $('.estimate-currency .text').text(strCurrencyText);

        arrCurrencyEl.append(strCurrencyOption);
        $('#estimate-currency').on('input change', (el) => {

            objCurRec.setValue({ fieldId: FLD_CURRENCY, value: el.currentTarget.value });

            var toutDisableCurrencyField = setInterval(disableCurrencyField, 50);
            function disableCurrencyField() {
                var objCurrencyField = objCurRec.getField({ fieldId: FLD_CURRENCY });
                if (!objCurrencyField.isDisabled) {
                    $('.estimate-currency').removeClass('disabled')
                    clearTimeout(toutDisableCurrencyField)
                } else {
                    $('.estimate-currency').addClass('disabled')
                }
            }

        })
    } else {
        strSearchQuery = window.location.search;
        objUrlParams = new URLSearchParams(strSearchQuery);
        const intEstId = objUrlParams.get('estimate') || objUrlParams.get('estid');
        console.log('intEstId', intEstId)
        const objCurRec = record.load({ type: record.Type.ESTIMATE, id: intEstId, isDynamic: false })
        const intCurrencyValue = objCurRec.getValue({ fieldId: FLD_CURRENCY });
        const strCurrencyText = objCurRec.getText({ fieldId: FLD_CURRENCY });

        console.log('this is else')
        strCurrencyOption += `<div class="item selected" data-value="${intCurrencyValue}">${strCurrencyText}</div>`;
        arrCurrencyEl.append(strCurrencyOption);
        $('#estimate-currency').attr("data-value", intCurrencyValue);
        $('.estimate-currency').addClass('disabled')
        $('.estimate-currency .text').text(strCurrencyText);
    }
})