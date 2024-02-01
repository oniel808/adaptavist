const removeItemFromCart = (option) => {
    var intMacAccount = getUrlParameter('mac');
    var blnIsEstimateRecord = getUrlParameter('isEstRecord');
    var intCartId = getUrlParameter('cartId');

    $('.error-modal').modal({
        onApprove: function (el) {
            el = el[0]
            arrClassList = el.className.split(' ')
            strClassList = el.className
            if (strClassList.includes('removeItem-ok-button')) {
                removeItem(option)
            }
        }
    });

    var arrActionButtons = [{
        action: 'removeItem-ok-button ok red',
        label: 'Remove'
    }, {
        action: 'removeItem-cancel-button cancel',
        label: 'Cancel'
    }]

    errorModal({
        title: 'Atlassian Cart',
        msg: `Are you sure to remove this ${option.name} - ${option.tier}?`,
        buttons: arrActionButtons
    });

    function removeItem(option) {
        $.ajax({
            url: `${scriptLink}&action=removeItemFromCart&mac=${intMacAccount}`,
            method: 'POST',
            data: {
                data: JSON.stringify({
                    itemID: parseInt(option.itemID),
                    cartID: option.cartID,
                })
            },
            success: function (data) {
                data = JSON.parse(data);
                if (data.httpcode != 200) {
                    errorModal({ ...data, title: 'Error occured Removing Item from cart' });
                } else {
                    var arrCurrentCartContents = $('.currentTableList tbody tr');
                    for (const el of arrCurrentCartContents) {
                        el.remove()
                    }
                    getCurrentCartTableList(data.items);
                    if (data.items.length) {
                        $('.saveAsDraft-button').removeClass('disabled')
                    } else {
                        $('.saveAsDraft-button').addClass('disabled')
                    }
                    console.log('blnIsEstimateRecord', blnIsEstimateRecord)
                    if (blnIsEstimateRecord == 'false') {
                        beforeUnloadFn({ cartid: intCartId })
                    }
                }
            },
            error: function (data) {
                errorModal({ title: 'Error occured Removing Item from cart', ...data });
            }
        });
    }

}