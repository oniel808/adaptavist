var OBJSUMMARYLINE = {}
function summaryHandler() {
    require(['SuiteScripts/Atlassian Cart Integration/Library/calculations/calculations.js'], (libCalculations) => {
        var lines = JSON.parse($('#quoteData').text() || '[]');
        // OBJSUMMARYLINE = {}
        OBJSUMMARYLINE = libCalculations.atlassianCartSummaryCalculation({
            items: lines.items
        });

        $('.summary-avstTotal')[0].innerHTML = OBJSUMMARYLINE.totalAvstPrice
        $('.summary-totalCustomerCredit')[0].innerHTML = OBJSUMMARYLINE.totalCreditAmount
        $('.summary-customerPrice')[0].innerHTML = OBJSUMMARYLINE.totalCustomerPrice
        $('.summary-totalMargin')[0].innerHTML = OBJSUMMARYLINE.totalMargin
        $('.summary-totalDiscount')[0].innerHTML = OBJSUMMARYLINE.totalCustomerDiscount + '(' + libCalculations.toFixNumber((OBJSUMMARYLINE.totalCustomerDiscount / OBJSUMMARYLINE.totalNewListPrice) * 100) + '% )'
        $('.summary-listPrice')[0].innerHTML = OBJSUMMARYLINE.totalListPrice
        $('.summary-totalListPriceWithAdjustments')[0].innerHTML = OBJSUMMARYLINE.totalNewListPrice
        $('.summary-totalListPriceAdjustments')[0].innerHTML = OBJSUMMARYLINE.totalListPriceAdjustment
        $('.summary-upgradeCredit')[0].innerHTML = OBJSUMMARYLINE.totalUpgradeCredit
    });
}

const getAtlassianQuote = (options) => {
    var intMacAccount = getUrlParameter('mac');
    console.log('intMacAccount', intMacAccount)
    var intAtlassianID = $('input[name="atlassianQuoteID"]').val()
    console.log('getAtlassianQuote | option', options)
    buttonLoader({
        disable: true,
        class: options.class,
        classes: 'small inverted'
    });

    $.ajax({
        url: `${scriptLink}&action=getAtlassianQuote&quoteid=${intAtlassianID}&mac=${intMacAccount}`,
        method: 'GET',
        success: function (data) {
            console.log('getAtlassianQuote | data', data)
            if (!data) {
                errorModal({ title: 'Invalid Quote ID', msg: 'Kindly verify the Quote ID and try again.' });
                buttonLoader({
                    class: options.class,
                    name: 'Get',
                    onclick: `getAtlassianQuote({class:'${options.class}'})`
                })
            }
            $('#quoteData')[0].innerHTML = data || '[]'

            data = JSON.parse(data)
            //store data in a hidden dev element

            buttonLoader({
                class: options.class,
                name: 'Get',
                onclick: `getAtlassianQuote({class:'${options.class}'})`
            })

            if (data.httpcode != 200) {
                errorModal({ msg: data.message || 'Kindly verify the Quote ID and try again.', title: `Internal Error Occured in getting quote` });
            } else {
                if (intAtlassianID != '') {
                    quotePlotter(data.items)
                }
            }
        },
        error: function (data) {
            console.log('getQuote e: ', data);
        }
    });

}

function quotePlotter(arrItems) {
    var el = $('.currentTableList tbody');
    for (const childEl of el.children()) {
        childEl.remove()
    }

    if (arrItems.length) {
        $('.importQuote-button').removeClass('disabled');
    }

    log.debug('quotePlotter', arrItems)

    for (const [indx, col] of arrItems.entries()) {
        console.log('column ', col)
        loader({
            isLoading: false,
            name: 'getCurrentCartTableList',
            anchor: 'currentTableList'
        });

        var strSaleType = ''
        strSaleType = col.saleType
        license = `</br><span style="color:#3d82d4"> ${col.supportEntitlementNumber || ''} </br> ${strSaleType} </span>`

        el.append(
            `<tr class="row-${col.id}">
                <td id='product_id' value='${col.id}'>
                        ${col.productName}
                        ${license}
                </td>
                <td>${col.tier}</td>
                <td>
                    <div class="fluid column">
                        <div class="ui fluid search selection dropdown ${col.id}-dropdown months-${col.id}-dropdown">
                            <input type="hidden" 
                                id="months-${col.id}-dropdown"
                                name="months" 
                                data-value="12"
                                value="12"
                                data-maintenancemonths="12"
                            >
                            <i class="dropdown icon"></i>
                            <div class="text">Months</div>
                            <div class="menu">
                                <div class="item ${col.id}-12-month" 
                                    data-value="12" 
                                    data-maintenanceMonths="12" >
                                    12
                                </div>
                                <div class="item ${col.id}-24-month" 
                                    data-value="24" 
                                    data-maintenanceMonths="24" >
                                    24
                                </div>
                            <div>
                        </div>
                    </div>
                </td>
                <td>$${col.listPrice == col.newListPrice ? col.listPrice :
                '<s>' + col.listPrice + '</s></br>$' + col.newListPrice}</td>
                <td>$${col.upgradeCredit}</td>
                <td>$${col.priceAdjustment}</td>
                <td>$${col.avstDiscountAmount}</td>
                <td>$${col.avstTotal}</td>
                <td>
                    <div class="ui tiny input input-${col.id}-discount input-discount allDiscount-discount">
                        <input style="max-width: 5em;" type="number" max="100" min="0" value=${col.customerDiscountAmount}>
                    </div>
                </td>
                <td class="row-${col.id}-customerPrice">$${col.customerPrice}</td>
                <td class="row-${col.id}-margin">$${col.margin}</td>
            </tr>`
        )
        $(`.months-${col.id}-dropdown`).dropdown();
        setTimeout(() => {
            $(`#months-${col.id}-dropdown`).on('change', () => {
                var ARRCURRENTLINES = JSON.parse($('#quoteData').text() || '[]');
                var intLineIndex = ARRCURRENTLINES.items.findIndex((obj) => obj.id === col.id);
                var currentLine = ARRCURRENTLINES.items[intLineIndex];
                currentLine.maintenanceMonths = $(`#months-${col.id}-dropdown`).val();
                $('#quoteData').text(JSON.stringify(ARRCURRENTLINES));
                summaryHandler();
            });

            $(`.input-${col.id}-discount`).change(() => {
                require(['SuiteScripts/Atlassian Cart Integration/Library/calculations/calculations.js'], (libCalculations) => {
                    var ARRCURRENTLINES = JSON.parse($('#quoteData').text() || '[]');
                    var intLineIndex = ARRCURRENTLINES.items.findIndex((obj) => obj.id === col.id);
                    var objItem = ARRCURRENTLINES.items[intLineIndex];
                    objItem.customerDiscountRate = $(`.input-${col.id}-discount input`).val();
                    objItem = libCalculations.atlassianCartItemCalculation({ item: objItem });
                    $(`.row-${col.id}-customerPrice`).text(`$${objItem.customerPrice}`);
                    $(`.row-${col.id}-margin`).text(`$${objItem.margin}`);
                    $('#quoteData').text(JSON.stringify(ARRCURRENTLINES));
                    summaryHandler();
                })


            })
            $('.input-discount').trigger('change');
            summaryHandler();
        }, 50);
    }
}