$('.error-modal').modal({
    onHide: function (el) {
        setTimeout(() => {
            $('.error-modal .error-content').html('');
            $('.error-modal .error-header').html('');
            $('.error-modal .error-actions').html('');
        }, 500);

        //for attaching Cart to Multiple Estimate
        let errorModal = document.querySelector('.error-modal');
        console.log('errorModal', errorModal)
        var isQuoteExisting = errorModal.getAttribute('data-isQuoteExisting');
        console.log("isQuoteExisting", isQuoteExisting)
        if (isQuoteExisting == 'true') {
            var intEstimateRecord = errorModal.getAttribute('data-estimateId');
            var intForm = errorModal.getAttribute('data-cf');
            // console.log("intEstimateRecord", intEstimateRecord)
            window.parent.onbeforeunload = null;
            window.parent.location.href = `/app/accounting/transactions/estimate.nl?id=${intEstimateRecord}&isMultiple=true&cf=${intForm}`

        }

    },
    onApprove: function (el) {
        el = el[0]
        console.log(el.className)
        arrClassList = el.className.split(' ')
        strClassList = el.className
        if (strClassList.includes('approveSaveAsDraft1')) {
            window.parent.location.reload()

        } else if (strClassList.includes('approveSaveAsDraft2')) {

            var indxClass = arrClassList.findIndex((string) => string.includes('intEstId'))
            var intEstId = arrClassList[indxClass].split('intEstId-')[1]
            window.parent.location.href = `/app/accounting/transactions/estimate.nl?id=${intEstId}`;

        } else if (strClassList.includes('continue-cart-button')) {
            let btn = document.querySelector('.continue-cart-button');
            var strUuid = btn.getAttribute('data-uuid');
            console.log('strUuid', strUuid)
            script = '/app/site/hosting/scriptlet.nl?&script=customscript_adap_atlassiancart_op_sl&deploy=customdeploy_adap_atlassiancart_op_sl'
            scriptRefresh = `${script}&view=atlassianCart&uuid=${strUuid}&estimate=${getUrlParameter('estimate')}&cartId=null&isEstRecord=${getUrlParameter('isEstRecord')}`
            getCurrentCartTableList(strUuid)
        } else if (strClassList.includes('close-cart-ok-button')) {
            var objXtool = window.parent.document.getElementsByClassName('x-tool');
            $(objXtool).trigger('click');
        }
    },
    onDeny: function (el) {
        var strUuid = el.data('uuid')
        var strEstid = el.data('estid')
        var intCf = el.data('cf')
        el = el[0]
        console.log(el.className)
        arrClassList = el.className.split(' ')
        strClassList = el.className
        console.log('close')
        if (strClassList.includes('cancel-cart-button')) {
            script = '/app/site/hosting/scriptlet.nl?&script=customscript_adap_atlassiancart_op_sl&deploy=customdeploy_adap_atlassiancart_op_sl'
            $.ajax({
                url: `${script}&action=removeLastState&estid=${strEstid}&uuid=${strUuid}`,
                method: 'GET',
                success: function (data) {
                    uuid = JSON.parse(data).uuid;
                    script += `&view=atlassianCart&uuid=${uuid}&estimate=${strEstid}&isEstRecord=true`;
                    window.location.href = script;
                }
            });
        } else if (strClassList.includes('close-cart-cancel-button')) {
            localStorage.clear();
            $('.error-modal').modal('cancel');
        } else if (strClassList.includes('cancel-import-button')) {
            window.parent.onbeforeunload = null;
            window.parent.location.href = `/app/accounting/transactions/estimate.nl?id=${strEstid}&isMultiple=true&cf=${intCf}`

        }
    }
});

const errorModal = (option) => {
    option.buttons = option.buttons || [];
    console.log('errorModal', option);
    if (!$('.error-modal').length) {
        $('.error-modal').modal();
    }
    if ($('.error-actions').length) {
        $('.error-actions').remove();
    }

    //for attaching Cart to Multiple Estimate
    if (option.isQuoteExisting) {
        $('.error-modal').attr('data-isQuoteExisting', option.isQuoteExisting)
        $('.error-modal').attr('data-estimateId', option.estimateId)
        $('.error-modal').attr('data-cf', option.cf)
    } else {
        $('.error-modal').attr('data-isQuoteExisting', false)
    }

    var strMessage = (option.msg).replace(/\n/g, '<br>')
    $('.error-modal .error-content').html(strMessage);
    $('.error-modal .error-header').html(option.title);
    if (option.buttons.length) {
        $('.error-modal').append(`<div class="actions error-actions"></div>`)
        for (const button of option.buttons) {
            strDatas = ''
            if (button.data) {
                for (const data of button.data) {
                    for (const key in data) {
                        strDatas += `data-${key}="${data[key]}"`
                    }
                }
            }
            $('.error-actions').append(`<div class="ui ${button.action} button" ${strDatas}>${button.label}</div>`)
        }
    }
    $('.error-modal').modal('show');

    setTimeout(() => {
        $('.error-modal').modal('hide');
    }, option.duration || 99999999);
}