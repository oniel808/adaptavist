const getUrlParameter = (option) => {
    strSearchQuery = window.location.search;
    objUrlParams = new URLSearchParams(strSearchQuery);
    return objUrlParams.get(option);
}

const getCurrentCartTableList = (option) => {
    loader({
        isLoading: true,
        name: 'getCurrentCartTableList',
        anchor: 'currentTableList'
    })
    var arrActionButtons = [{
        action: 'cancel',
        label: 'Cancel'
    }]
    if (typeof option == 'object') {
        plot(option)
        $('.saveAsDraft-button').removeClass('disabled');
    } else {
        var arrNoMaintenanceMonths = []
        var strNoMaintenanceMonths = '[]'
        try {
            arrNoMaintenanceMonths = localStorageFn({ action: 'get' })
            strNoMaintenanceMonths = JSON.stringify(arrNoMaintenanceMonths)
        } catch (e) {
            console.log('arrNoMaintenanceMonths Error', e)
        }
        $.ajax({
            url: `${scriptLink}&action=getCart&search=${getUrlParameter('uuid')}&cartId=${getUrlParameter('cartId')}&mac=${getUrlParameter('mac')}`,
            method: 'POST',
            data: {
                noMaintenanceMonths: strNoMaintenanceMonths
            },
            success: function (data) {
                loader({
                    isLoading: false,
                    name: 'getCurrentCartTableList',
                    anchor: 'currentTableList',
                    isDimmed: false
                });
                if (!data) {
                    errorModal({
                        msg: 'no data was found in server',
                        ...data,
                        title: 'Error occured Getting Atlassian Cart',
                    });
                } else {
                    data = JSON.parse(data);
                    ARRCURRENTLINES = data.items;
                    if (data.httpcode != 200) {
                        errorModal({
                            ...data,
                            title: 'API Connection Error Occurred',
                            msg: 'Please contact your Technical Administrator to check the connection status.',
                            buttons: arrActionButtons
                        });
                    } else {
                        if (data.items.length) {
                            plot(data.items);
                        }
                    }
                }

            },
            error: function (data) {
                errorModal({ title: 'Error occured Getting Atlassian Cart', ...data });
            }
        });
    }

    function disableButtonAndZeroSummary() {
        var summaryHeaders = ['totalListPriceWithAdjustments', 'totalListPriceAdjustments', 'totalDiscount', 'customerPrice', 'totalMargin', 'totalCustomerCredit', 'listPrice', 'avstTotal']
        for (const header of summaryHeaders) {
            $('.summary-' + header)[0].innerHTML = 0;
        }
        $('.saveAsDraft-button').addClass('disabled');
    }
    function plot(arrItems) {
        console.log('plot', arrItems);
        if (!arrItems.length) {
            disableButtonAndZeroSummary()
        }
        ARRCURRENTLINES = arrItems || [];
        $('.saveAsDraft-button').removeClass('disabled');
        var el = $('.currentTableList tbody');
        for (const childEl of el.children()) {
            childEl.remove()
        }

        loader({
            isLoading: false,
            name: 'getCurrentCartTableList',
            anchor: 'currentTableList'
        });

        for (const col of arrItems) {
            console.log('col.productDetails.saleType', col.productDetails.saleType)
            let objToRemove = { cartID: getUrlParameter('uuid'), itemID: col.id, row: col.num - 1, name: col.productName, tier: col.tier }
            license = `</br><span style="color:#008000"> ${col.senNumber ? 'SEN-' + col.senNumber + ' </br>' : ''} <span style="color:#3d82d4">${col.productDetails.saleType}</span> </span>`
            var strListPrice = ''
            if (col.newListPrice != col.listPrice) {
                strListPrice = `<strike>$${col.listPrice}</strike><br>$${col.newListPrice.toFixed(2)}`
            } else {
                strListPrice = '$' + col.listPrice
            }

            if (objCartItems[col.id.toString()]) {
                col.customerDiscountRate = objCartItems[col.id.toString()]
            }
            el.append(
                `<tr class="row-${col.id}-item">
                    <td>${col.num}</td>
                    <td>${col.productName}${license}</td>
                    <td class="col-tier">${col.tier}</td>
                    <td class="col-listPrice">${strListPrice}</td>
                    <td class="col-creditAmount">$${col.upgradeCredit}</td>
                    <td class="col-avstDiscountAmount">$${col.avstDiscountAmount}</td>
                    <td class="col-avstTotal">$${col.avstTotal}</td>
                    <td>
                        <div class="ui mini icon input input-${col.id}-discount allDiscount-discount">
                            <input type="number" style="width: 105px;" value="${col.customerDiscountRate}" min="0" max="100" data-cp="${col.customerPrice}" data-avt="${col.avstTotal}">
                        </div>
                    </td>
                    <td class="col-customerPrice">$${col.customerPrice}</td>
                    <td class="">$${col.margin}</td>
                    <td><button class="ui red button" onClick='removeItemFromCart(${JSON.stringify(objToRemove)})' type="button" ><span style="font-weight:bold">X</span></button></td>
                </tr>`
            )

            const displayToSummary = (option) => {
                var arrSumEl = $(`.summary-${option.summaryCol}`);
                if (arrSumEl.length) {
                    arrSumEl[0].innerHTML = option.fltSummaryTotal || 0;
                }
            }

            setTimeout(() => {
                var element = $(`.input-${col.id}-discount input`);
                element.change(() => {
                    require(['SuiteScripts/Atlassian Cart Integration/Library/calculations/calculations.js'], (libCalculations) => {
                        var intLineIndex = ARRCURRENTLINES.findIndex((obj) => obj.num == col.num);
                        var objItem = ARRCURRENTLINES[intLineIndex];
                        objItem.customerDiscountRate = libCalculations.toFixNumber(element.val() || 0);
                        objItem = libCalculations.atlassianCartItemCalculation({ item: objItem });
                        element.parent().parent().parent()[0].children[8].innerHTML = `$${objItem.customerPrice}`;
                        element.parent().parent().parent()[0].children[9].innerHTML = `$${objItem.margin}`;
                        var strCartOrderId = objItem.id.toString()
                        objCartItems[strCartOrderId] = objItem.customerDiscountRate
                        getSummaryMargin()
                    });
                });

                setTimeout(() => {
                    OBJSUMMARYLINE.discountedCustomerPrice = OBJSUMMARYLINE.customerPrice - OBJSUMMARYLINE.avstTotal;
                    displayToSummary({
                        summaryCol: 'totalDiscount',
                        fltSummaryTotal: OBJSUMMARYLINE.discountedCustomerPrice
                    });
                    getSummaryMargin()
                    $(`.input-${col.id}-discount input`).trigger('change');
                }, 10);
                // initializeSummary();
            }, 10);
        }
    }
}

const getSummaryMargin = () => {
    require(['SuiteScripts/Atlassian Cart Integration/Library/calculations/calculations.js'], (libCalculations) => {
        OBJSUMMARYLINE = {}
        OBJSUMMARYLINE = libCalculations.atlassianCartSummaryCalculation({
            items: ARRCURRENTLINES
        });
        console.log('OBJSUMMARYLINE', OBJSUMMARYLINE);
        $('.summary-avstTotal')[0].innerHTML = OBJSUMMARYLINE.totalAvstPrice;
        $('.summary-customerPrice')[0].innerHTML = OBJSUMMARYLINE.totalCustomerPrice;
        $('.summary-totalMargin')[0].innerHTML = `${OBJSUMMARYLINE.totalMargin}`;
        $('.summary-totalCustomerCredit')[0].innerHTML = OBJSUMMARYLINE.totalCreditAmount;
        $('.summary-totalDiscount')[0].innerHTML = '$ ' + OBJSUMMARYLINE.totalCustomerDiscount + '(' + libCalculations.toFixNumber((OBJSUMMARYLINE.totalCustomerDiscount / OBJSUMMARYLINE.totalNewListPrice) * 100) + ')';

        $('.summary-listPrice')[0].innerHTML = OBJSUMMARYLINE.totalListPrice;
        $('.summary-totalListPriceWithAdjustments')[0].innerHTML = OBJSUMMARYLINE.totalNewListPrice;
        $('.summary-totalListPriceAdjustments')[0].innerHTML = OBJSUMMARYLINE.totalListPriceAdjustment;
        $('.summary-upgradeCredit')[0].innerHTML = OBJSUMMARYLINE.totalUpgradeCredit;
    })
}
setTimeout(() => {

    var strUuid = getUrlParameter('uuid');
    var strEstid = getUrlParameter('estimate');
    var strCartId = getUrlParameter('cartId');
    if (strEstid != 'null') {
        $.ajax({
            url: `${scriptLink}&action=getLastState&estid=${strEstid}`,
            method: 'GET',
            success: function (data) {
                data = JSON.parse(data)
                var objData = {
                    uuid: strUuid,
                    estid: strEstid
                }
                var arrActionButtons = [{
                    action: 'continue-cart-button ok',
                    data: [objData],
                    label: 'Continue'
                }, {
                    action: 'cancel-cart-button cancel',
                    data: [objData],
                    label: 'New Cart'
                }]
                if (data.uuid && strCartId == 'null') {
                    errorModal({
                        title: 'Previous cart',
                        msg: 'Would you like to continue your previous cart?',
                        buttons: arrActionButtons
                    });
                } else {
                    if (strUuid && strEstid) {
                        $.ajax({
                            url: `${scriptLink}&action=getLastState&estid=${strEstid}&uuid=${strUuid}&cartid=${strCartId}&mac=${getUrlParameter('mac')}`,
                            method: 'GET',
                        })
                    }
                    getCurrentCartTableList(strUuid)
                }
            }
        })
    } else {
        getCurrentCartTableList(strUuid)
    }

}, 1)