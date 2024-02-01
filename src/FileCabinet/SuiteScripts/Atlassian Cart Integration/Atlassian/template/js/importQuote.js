

var forNewEstimate = {
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
    forNewEstimate.customerId = objCurRecord.getValue('entity');
    forNewEstimate.salesRepId = objCurRecord.getValue('salesrep');
    forNewEstimate.subsidiaryId = objCurRecord.getValue('subsidiary');
    forNewEstimate.currencyId = objCurRecord.getValue('currency');
    forNewEstimate.tcId = objCurRecord.getValue('custbody_adap_tc_option');
    forNewEstimate.currencyCode = objCurRecord.getValue('currencysymbol');
    forNewEstimate.tcAdditionalContent = objCurRecord.getValue('custbody_adap_tc_add_notes');
    forNewEstimate.tcContent = objCurRecord.getValue('custbody_adap_tc_option_content');

    forNewEstimate.macAccount = objCurRecord.getValue('custbody_adap_atl_mac_account');

    forNewEstimate.endUserName = objCurRecord.getValue('custbody_adap_enduser_name');
    forNewEstimate.endUserEmail = objCurRecord.getValue('custbody_adap_enduser_email');
    forNewEstimate.endUserPhone = objCurRecord.getValue('custbody_adap_enduser_phone');
    forNewEstimate.endUserAddr1 = objCurRecord.getValue('custbodyadap_enduser_address1');
    forNewEstimate.endUserAddr2 = objCurRecord.getValue('custbody_enduser_address2');
    forNewEstimate.endUserCity = objCurRecord.getValue('custbody_adap_enduser_city');
    forNewEstimate.endUserZip = objCurRecord.getValue('custbody_adap_enduser_zip');
    forNewEstimate.endUserCountry = objCurRecord.getValue('custbody_adap_enduser_country');
    forNewEstimate.endUserState = objCurRecord.getValue('custbody_adap_enduser_state');
    forNewEstimate.isPartner = objCurRecord.getValue('custbody_adap_enduser_ispartner');

    //checkboxes
    forNewEstimate.includeInReport = objCurRecord.getValue('custbody_adap_atl_include_in_report');
    forNewEstimate.addSignatureBlock = objCurRecord.getValue('custbody_adap_signature_block');
    forNewEstimate.showDiscountToCustomer = objCurRecord.getValue('custbody_adap_atl_shw_dscnt_to_custmr');
    forNewEstimate.showColumnDiscount = objCurRecord.getValue('custbody_adap_atl_show_disc_lines');
    forNewEstimate.taxOverride = objCurRecord.getValue('custbody_ava_taxoverride');
    forNewEstimate.csURL = objCurRecord.getValue('custbody_adap_atl_cs_url');

    forNewEstimate.techContactName = objCurRecord.getSublistValue({ sublistId: 'contacts', fieldId: 'entityid', line: 0 });
    forNewEstimate.techContactEmail = objCurRecord.getSublistValue({ sublistId: 'contacts', fieldId: 'email', line: 0 });
});

const importQuote = (option) => {
    let arrQuoteData = JSON.parse($('#quoteData').text());
    let intMacAccount = getUrlParameter('mac');
    let intEstId = getUrlParameter('estimate');
    let blnIsCurrencyProvided = false;

    var intAtlassianID = $('input[name="atlassianQuoteID"]').val();
    console.log(intAtlassianID);
    var arrActionButtons = [{
        action: 'close-import-ok-button ok',
        label: 'Import'
    }, {
        action: 'close-import-cancel-button cancel',
        label: 'Cancel'
    }]
    buttonLoader({
        disable: true,
        class: option.class,
        classes: 'small inverted'
    });
    if (intEstId == 'null') {
        errorModal({
            title: 'Estimate',
            msg: 'Please confirm the currency you have selected?',
            buttons: arrActionButtons
        });
    } else {
        blnIsCurrencyProvided = true
    }
    if (!getUrlParameter('custid') && !getUrlParameter('salesRep')) {
        forNewEstimate = {}
    }
    if (blnIsCurrencyProvided) {
        importAjax()
    }


    $('.error-modal').modal({
        onApprove: function (el) {
            importAjax()
        }, onDeny: function (el) {
            el = el[0]
            arrClassList = el.className.split(' ')
            strClassList = el.className
            if (strClassList.includes('close-import-cancel-button')) {
                buttonLoader({
                    class: option.class,
                    name: 'Import',
                    onclick: `importQuote({class:'${option.class}'})`
                })
            }
        }
    });
    function importAjax() {
        console.log('importAjax, arrQuoteData', arrQuoteData)
        $.ajax({
            url: `${scriptLink}&action=importQuote&mac=${intMacAccount}`,
            method: 'POST',
            data: {
                orderNumber: arrQuoteData.orderNumber,
                items: JSON.stringify(arrQuoteData.items),
                summary: JSON.stringify(OBJSUMMARYLINE),
                estid: getUrlParameter('estid'),
                estimate: getUrlParameter('estid'),
                forNewEstimate: JSON.stringify(forNewEstimate)
            },
            success: function (data) {
                console.log('importQuote', data)
                data = JSON.parse(data)

                if (data.forceRedirect == true && !data.hasError) {
                    forceRedirect({
                        estimate: data.estimate,
                        cf: data.cf
                    })
                } else if (data.hasError == false) {
                    errorModal(data);
                } else {
                    var objFindEstimate = setInterval(findEstimate, 10000);
                    var isEstimateFound = false;


                    function findEstimate() {
                        console.log('Looking...', data);
                        if (isEstimateFound) {
                            return;
                        }
                        $.ajax({
                            url: `${scriptLink}&action=importQuote`,
                            method: 'POST',
                            data: {
                                estimate: data.estimate,
                                cartUniqueId: data.cartUniqueId,
                                orderNumber: arrQuoteData.orderNumber
                            },
                            success: function (EstResponse) {
                                objEstResponse = JSON.parse(EstResponse);
                                console.log('Looking... 2', objEstResponse);
                                if (objEstResponse.estimate != 'null' && typeof objEstResponse.estimate != 'undefined' && !objEstResponse.hasError) {
                                    isEstimateFound = true;
                                    console.log('FOUND..!', objEstResponse);
                                    forceRedirect({
                                        estimate: objEstResponse.estimate,
                                        cf: objEstResponse.cf
                                    })
                                }
                                if(objEstResponse.hasError) {
                                    errorModal(data);
                                    clearInterval(objFindEstimate);
                                    buttonLoader({
                                        class: option.class,
                                        name: 'Import',
                                        onclick: `importQuote({class:'${option.class}'})`
                                    })
                                }
                            }
                        })
                    }
                }
            },
            error: function (data) {
                errorModal(data);
                buttonLoader({
                    class: option.class,
                    name: 'Import',
                    onclick: `importQuote({class:'${option.class}'})`
                })
            }
        });
        function forceRedirect(options) {
            window.parent.addEventListener("beforeunload", (event) => { });
            window.parent.onbeforeunload = (event) => { };

            localStorage.clear();
            window.parent.location.href = `/app/accounting/transactions/estimate.nl?id=${options.estimate}&cf=${options.cf}`;
        }
    }



}
