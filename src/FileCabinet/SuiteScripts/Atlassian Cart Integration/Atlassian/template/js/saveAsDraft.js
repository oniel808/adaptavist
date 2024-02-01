var ARRCURRENTLINES = [];
var LICENSES = [];
var objCartItems = {};
var OBJSUMMARYLINE = {
    customerPrice: 0,
    originalCustomerPrice: 0,
    avstTotal: 0,
    avstDiscountAmount: 0,
    upgradeCredit: 0,
    customerCredit: 0,
    listPrice: 0,
    totalDiscount: 0,
    totalMargin: 0,
    totalMarginPercentage: 0,
    totalDiscountAmount: 0,
    totalCustomerCredit: 0,
    totalListPriceAdjustment: 0,
    totalCustomerDiscount: 0,
    totalUpgradeCredit: 0,
    totalCustomerDiscountPer: 0,
}
var objEstimate = {
    customerId: null,
    salesRepId: null,
    subsidiaryId: null,
    currencyId: null,
    tcId: null,
    currencyCode: null,
    tcContent: null,
    techContactName: null,
    techContactEmail: null,
    includeInReport: null,
    addSignatureBlock: null,
    showDiscountToCustomer: null,
    showColumnDiscount: null,
    csURL: null,
}
window.parent.require(['N/currentRecord'], (currentRecord) => {
    var objCurRecord = currentRecord.get();
    objEstimate.customerId = objCurRecord.getValue('entity');
    objEstimate.salesRepId = parseInt(objCurRecord.getValue('salesrep'));
    objEstimate.subsidiaryId = objCurRecord.getValue('subsidiary');
    objEstimate.currencyId = objCurRecord.getValue('currency');
    objEstimate.tcId = objCurRecord.getValue('custbody_adap_tc_option');
    objEstimate.currencyCode = objCurRecord.getValue('currencysymbol');
    objEstimate.tcAdditionalContent = objCurRecord.getValue('custbody_adap_tc_add_notes');
    objEstimate.tcContent = objCurRecord.getValue('custbody_adap_tc_option_content');


    //checkboxes
    objEstimate.includeInReport = objCurRecord.getValue('custbody_adap_atl_include_in_report');
    objEstimate.addSignatureBlock = objCurRecord.getValue('custbody_adap_signature_block');
    objEstimate.showDiscountToCustomer = objCurRecord.getValue('custbody_adap_atl_shw_dscnt_to_custmr');
    objEstimate.showColumnDiscount = objCurRecord.getValue('custbody_adap_atl_show_disc_lines');
    objEstimate.csURL = objCurRecord.getValue('custbody_adap_atl_cs_url');
    objEstimate.macAccount = objCurRecord.getValue('custbody_adap_atl_mac_account');
    objEstimate.isPartner = objCurRecord.getValue('custbody_adap_enduser_ispartner');
    objEstimate.taxOverride = objCurRecord.getValue('custbody_ava_taxoverride');

    objEstimate.endUserName = objCurRecord.getValue('custbody_adap_enduser_name');
    objEstimate.endUserEmail = objCurRecord.getValue('custbody_adap_enduser_email');
    objEstimate.endUserPhone = objCurRecord.getValue('custbody_adap_enduser_phone');
    objEstimate.endUserAddr1 = objCurRecord.getValue('custbodyadap_enduser_address1');
    objEstimate.endUserAddr2 = objCurRecord.getValue('custbody_enduser_address2');
    objEstimate.endUserCity = objCurRecord.getValue('custbody_adap_enduser_city');
    objEstimate.endUserZip = objCurRecord.getValue('custbody_adap_enduser_zip');
    objEstimate.endUserCountry = objCurRecord.getValue('custbody_adap_enduser_country');
    objEstimate.endUserState = objCurRecord.getValue('custbody_adap_enduser_state');

    objEstimate.techContactName = objCurRecord.getSublistValue({ sublistId: 'contacts', fieldId: 'entityid', line: 0 });
    objEstimate.techContactEmail = objCurRecord.getSublistValue({ sublistId: 'contacts', fieldId: 'email', line: 0 });

});
const saveAsDraft = (option) => {
    this.preventDefault()
    const strUUID = getUrlParameter('uuid');
    const intCartId = getUrlParameter('cartId');
    const intEstId = getUrlParameter('estimate');
    const isEstRecord = getUrlParameter('isEstRecord');
    const custid = getUrlParameter('custid');
    const strCurrencyCode = getUrlParameter('currencycode');

    buttonLoader({
        // disable: true,
        class: option.class,
        classes: 'small disabled'
    });

    if (intEstId != 'null') {
        objEstimate = {
            customerId: null,
            salesRepId: null,
            subsidiaryId: null
        }
    }

    var arrNoMaintenanceMonths = localStorageFn({ action: 'get' })
    var strNoMaintenanceMonths = JSON.stringify(arrNoMaintenanceMonths)

    var objPayload = {
        cartLines: JSON.stringify(ARRCURRENTLINES),
        summary: JSON.stringify(OBJSUMMARYLINE),
        estimateDetails: JSON.stringify(objEstimate),
        cartId: intCartId,
        noMaintenanceMonths: strNoMaintenanceMonths
    };
    console.log('objPayload', objPayload)

    //Validate the currentline first before submitting, Return message if no line item existing.

    if (ARRCURRENTLINES.length > 0) {

        var arrActionButtons = [{
            action: 'close-savedraft-ok-button ok',
            label: 'Save Draft'
        }, {
            action: 'close-savedraft-cancel-button cancel',
            label: 'Cancel'
        }]
        console.log('intEstId', intEstId)
        if (intEstId == 'null') {
            errorModal({
                title: 'Estimate',
                msg: 'Please confirm the currency you have selected?',
                buttons: arrActionButtons
            });
        } else {
            saveAsDraftAjax()
        }

        $('.error-modal').modal({
            onApprove: function (el) {
                el = el[0]
                arrClassList = el.className.split(' ')
                strClassList = el.className
                if (strClassList.includes('close-savedraft-ok-button')) {
                    console.log('scriptLink', scriptLink);
                    saveAsDraftAjax()
                }
            },
            onDeny: function (el) {
                el = el[0]
                arrClassList = el.className.split(' ')
                strClassList = el.className
                if (strClassList.includes('close-savedraft-cancel-button')) {
                    buttonLoader({
                        class: option.class,
                        name: 'Save Draft',
                        onclick: `saveAsDraft({class:'${option.class}'})`
                    })
                }
            }
        });
    } else {
        errorModal({ title: 'Empty current cart table', msg: 'Empty cart is not allowed to update, Please add at least one (1) license to proceed.' });
        //window.parent.document.querySelector('#_frame').contentWindow.location.reload(true);
        $('.saveAsDraft-button').text("Refresh");
        $('.saveAsDraft-button').click(function () {
            window.parent.document.querySelector('#_frame').contentWindow.location.reload(true);
        })
    }
    function saveAsDraftAjax() {
        buttonLoader({
            disable: true,
            class: option.class,
            classes: 'small inverted'
        });
        $.ajax({
            url: `${scriptLink}&action=saveDraft&search=${strUUID}&estid=${intEstId}&cartId=${intCartId}&customerId=${objEstimate.customerId}&salesRepId=${objEstimate.salesRepId}&subsidiaryId=${objEstimate.subsidiaryId}&currencyId=${objEstimate.currencyId}&tcId=${objEstimate.tcId}&currencyCode=${objEstimate.currencyCode || strCurrencyCode}`,
            method: 'POST',
            data: objPayload,
            success: function (data) {
                data = JSON.parse(data)
                errors = data.errors || []
                console.log('savedDraft data', data)
                if (data.forceRedirect == true) {
                    forceRedirect({
                        estimate: data.estimate,
                        cf: data.cf
                    })
                } else {
                    var objFindEstimate = setInterval(findEstimate, 10000);
                    var isEstimateFound = false;
                    function findEstimate() {
                        console.log('Looking...', data);
                        if (isEstimateFound) {
                            clearInterval(objFindEstimate);
                            return;
                        }
                        $.ajax({
                            url: `${scriptLink}&action=saveDraft`,
                            method: 'POST',
                            data: {
                                cartUniqueId: data.cartUniqueId
                            },
                            success: function (EstResponse) {
                                objEstResponse = JSON.parse(EstResponse);
                                if (objEstResponse.estimate) {
                                    isEstimateFound = true;
                                    forceRedirect({
                                        estimate: objEstResponse.estimate,
                                        cf: objEstResponse.cf
                                    })
                                }
                            }
                        })
                    }
                }
            },
            error: function (data) {
                errorModal({ title: 'Error occured Saving As Draft', ...data });
            }
        });
        function forceRedirect(options) {
            window.parent.addEventListener("beforeunload", (event) => { });
            window.parent.onbeforeunload = (event) => { };
            script = '/app/site/hosting/scriptlet.nl?&script=customscript_adap_atlassiancart_op_sl&deploy=customdeploy_adap_atlassiancart_op_sl'
            $.ajax({ url: `${script}&action=removeLastState&estid=${options.estimate}`, method: 'GET' });
            localStorage.clear();
            window.parent.location.href = `/app/accounting/transactions/estimate.nl?id=${options.estimate}&cf=${options.cf}`;
        }
    }
}

const closeWindow = () => {
    if (ARRCURRENTLINES.length) {
        var objXtool = window.parent.document.getElementsByClassName('x-tool');
        $(objXtool).trigger('click');
    } else {

        var arrActionButtons = [{
            action: 'close-cart-ok-button ok',
            label: 'Close Window'
        }, {
            action: 'close-cart-cancel-button cancel',
            label: 'Cancel'
        }]
        errorModal({
            title: 'Empty current cart table',
            msg: 'You cannot save/update an empty cart, kindly add at least one (1) license to proceed. <br><br>Are you sure you want to close this window?',
            buttons: arrActionButtons
        });
    }
}