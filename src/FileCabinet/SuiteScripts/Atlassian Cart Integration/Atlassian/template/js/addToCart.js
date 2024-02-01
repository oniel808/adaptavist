const addToCart = (option) => {

    console.log('addToCart', option)

    const strUUID = getUrlParameter('uuid') || '';
    var blnIsEstimateRecord = getUrlParameter('isEstRecord');

    var orderableItemId = $(`.tierList-${option.class}-dropdown input`).val();

    var maintenanceMonths = $(`.row-${option.class}`).find(`[name="tierList-${option.class}-months"]:checked`).val();
    var renewalMonths = $(`.${orderableItemId}-maintenanceMonths`).val()


    if (!orderableItemId || !renewalMonths) {
        $(`${option.class}-button`).addClass('disabled')
    } else {
        $(`${option.class}-button`).removeClass('disabled')
    }

    const intUUID = getUrlParameter('uuid');
    const intCartID = getUrlParameter('cartId');
    const intEstimateID = getUrlParameter('estimate');

    // input[name=emailRenewLicense],
    // input[name=emailUpgradeLicense]
    var formFields = `input[name=senRenewLicense], 
                     input[name=senUpgradeLicense]`

    var objPayload = {
        "cartID": intUUID,
        "newItems": [{
            "orderableItemId": `${orderableItemId}`,
            "renewalMonths": parseInt(renewalMonths),
            "maintenanceMonths": parseInt(maintenanceMonths)
        }]
    };

    buttonLoader({
        disable: true,
        class: option.class,
        classes: 'small inverted'
    });
    var action = 'addToCart';
    if (option.license) {
        objPayload = {}
        action = option.table
        licenseIndx = LICENSES.findIndex((obj) => {
            if (action == 'getrenewals') {
                if (!obj.maintenanceMonths) {
                    return obj.orderableItemId == orderableItemId
                } else {
                    return obj.orderableItemId == orderableItemId && obj.maintenanceMonths == maintenanceMonths
                }
            } else {
                return obj.orderableItemId == orderableItemId && obj.maintenanceMonths == maintenanceMonths
            }
        })
        objPayload.item = LICENSES[licenseIndx]
        objPayload.uuid = strUUID

        try {
            console.log('saving to Local Storage')
            var savedFromLocal = localStorageFn({
                action: 'save',
                data: {
                    sen: objPayload.item.accountId,
                    amount: objPayload.item.originalAmount,
                    maintenanceMonths: maintenanceMonths,
                }
            })
            console.log('saved to Local Storage', savedFromLocal)
        } catch (e) {
            console.error('localStorageFN Error | ', e)
        }
    }
    const intCartId = getUrlParameter('cartId') || '';

    var arrNoMaintenanceMonths = []
    var strNoMaintenanceMonths = '[]'
    try {
        arrNoMaintenanceMonths = localStorageFn({ action: 'get' })
        strNoMaintenanceMonths = JSON.stringify(arrNoMaintenanceMonths)
    } catch (e) {
        console.log('arrNoMaintenanceMonths Error', e)
    }
    $.ajax({
        url: `${scriptLink}&action=${action}&estid=${intEstimateID}&cartid=${intCartId}&mac=${getUrlParameter('mac')}`,
        method: 'POST',
        data: {
            data: JSON.stringify(objPayload),
            noMaintenanceMonths: strNoMaintenanceMonths,
            licenseType: option.licenseType
        },
        success: function (data) {
            if (!data) {
                errorModal({ msg: 'The host you are trying to connect to is not responding.', title: 'Host Connection Timeout' });
            }
            data = JSON.parse(data);
            $(`.product-table-${option.table}`).remove();
            $('.findnewapps .search').val('');
            $('.findnewappsSearchBar .text').html('');
            if (data.httpcode != 200) {
                if (data.msg.includes('Error: 500')) {
                    licenseType = action == 'getrenewals' ? 'Renewal' : 'Upgrade'
                    data.msg = `Please check the license associated with this SEN. ${licenseType} is not allowed for Cloud and Server products. </br>Please contact your administrator.`
                }
                errorModal({ ...data, title: 'Failed adding item to Cart' });
            } else {
                buttonLoader({
                    class: option.class,
                    table: option.table,
                    name: 'Add to cart',
                    onclick: `addToCart({class:'${option.class}', table:'${option.table}'})`
                })
                identifier = option.table == 'getrenewals' ? 'Renew' : 'Upgrade';

                if (blnIsEstimateRecord == 'false') {
                    beforeUnloadFn({ cartid: intCartId })
                }
                $(`.get${identifier}Option-button`).addClass('disabled');
                getCurrentCartTableList(data.items);
            }
            $(formFields).val('');
        },
        error: function (data) {
            errorModal({ ...data, title: 'Error occured adding to cart' });
        }
    });
}