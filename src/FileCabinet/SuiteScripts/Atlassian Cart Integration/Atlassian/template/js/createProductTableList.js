function createProductTable(option) {
    console.log('createProductTable', option);
    // initialize Product Table

    if (!$(`.product-table-${option.table}`).length) {
        $(`<div class="row product-table-${option.table}" style="padding-top:10px">
                <div class="fluid column">
                    <table class="ui selectable celled table striped ">
                        <thead>
                            <tr>
                                <th>#</th>
                                ${option.table == "getrenewals" ? '<th>Expiry Date</th>' : ''}
                                <th>Product</th>
                                <th>Tier</th>
                                ${option.table != 'findnewapps' ? '<th>Amount</th>' : ''}
                                <th>Maintenance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>`).insertAfter(`.${option.table}`);
    }

    if (!option.data.length) {
        option.data.table = option.table;
        option.data.type = option.type;
        productListing(option.data);
    } else {
        for (const products of option.data) {
            products.table = option.table;
            products.type = option.type;
            productListing(products);
        }
    }
}
const productListing = (option) => {
    var strTierOptions = '';

    LICENSES = option.orderableItems
    try {
        var intLineIndex = -1

        currentItemLoop:
        for (const [intLineItem, objLineItems] of ARRCURRENTLINES.entries()) {
            intIndex = option.orderableItems.findIndex(objItems => objItems.accountId == objLineItems.accountId)
            if (intIndex >= 0) {
                intLineIndex = intLineItem
                break currentItemLoop
            }
        }

        if (intLineIndex >= 0) {
            LICENSES = option.orderableItems.filter(obj => {
                if (obj.accountId == ARRCURRENTLINES[intLineIndex].accountId) {
                    return obj.accountId == ARRCURRENTLINES[intLineIndex].accountId && obj.unitCount > ARRCURRENTLINES[intLineIndex].tierNumber
                }
            });
        }

    } catch (e) {
        console.log('Error trying to remove lesser userTier than the added item')
    }

    var blnIsLicenseExpired = false;
    if (!option.orderableItems) {
        option.orderableItems = []
    }

    var strDate = '';
    if (option.table == "getrenewals") {

        var objDateToday = new Date();
        var objExpirationDate = new Date(option.expirationDate);
        blnIsLicenseExpired = objDateToday >= objExpirationDate;

        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dteExpiryDate = new Date("2024-08-31T00:00:00.000-0500");
        strDate = dteExpiryDate.getDate() + '-' + months[dteExpiryDate.getMonth()] + '-' + dteExpiryDate.getFullYear();

    } else if (!option.orderableItems.length || !option.orderableItems) {

        errorModal({ title: 'No avaialble item', msg: 'No items available for this SEN' });
        $(`.product-table-${option.table}`).remove();
        $(`.${option.table}-button`).removeClass('disabled');
        return

    }

    var strProductKeyClass = option.productKey.replaceAll('.', '_');
    var objUserTierForSingle = {}
    var isLicense = option.table == "getupgrades" || option.table == "getrenewals"
    var objNumberofMonths = {}

    if (isLicense) {
        option.orderableItems = []
        for (const license of LICENSES) {
            isExist = option.orderableItems.findIndex((obj) => obj.orderableItemId == license.orderableItemId);
            if (isExist < 0) {
                option.orderableItems.push({ ...license, arrMaintenanceMonths: [license.maintenanceMonths] });
            } else {
                option.orderableItems[isExist].arrMaintenanceMonths.push(license.maintenanceMonths);
            }
        }
    }

    for (const userTier of option.orderableItems) {

        if (option.orderableItems.length == 1) {
            objUserTierForSingle.orderableItemId = userTier.orderableItemId
            objUserTierForSingle.maintenanceMonths = userTier.maintenanceMonths
            objUserTierForSingle.editionDescription = userTier.editionDescription
        }

        var intMonths = (option.table == 'findnewapps') ? userTier.monthsValid : userTier.maintenanceMonths

        if (objNumberofMonths[intMonths] == null) {
            objNumberofMonths[intMonths] = true
            if (option.table == "getupgrades") {
                objNumberofMonths['24'] = true
            }
        }

        strTierOptions += `<div 
                                class="item ${option.orderableItems.length == 1 ? 'selected' : ''}" 
                                data-value="${userTier.orderableItemId}" 
                                data-maintenanceMonths="${userTier.maintenanceMonths}"
                                data-maintenanceMonthsAvailable="${userTier.arrMaintenanceMonths}">
                                    ${userTier.editionDescription}
                                <input text="number" class="${userTier.orderableItemId}-maintenanceMonth hidden" type="hidden" value="${intMonths}">
                            </div>`;

    }

    var strListTierOptions = `
    <div class="fluid column">
        <div class="ui fluid search selection dropdown tierList-${strProductKeyClass}-dropdown ${option.table}-dropdown"> <!-- {blnIsLicenseExpired ? 'disabled' : ''} -->
            <input 
                type="hidden" 
                name="${option.table}" 
                data-value="${objUserTierForSingle.orderableItemId || ''}"
                value="${objUserTierForSingle.orderableItemId || ''}"
            >
            <i class="dropdown icon"></i>
            <div class="${objUserTierForSingle.orderableItemId ? '' : 'default'} text">${objUserTierForSingle.editionDescription || 'User tier'}</div>
            <div class="menu">
                ${strTierOptions}
            <div>
        </div>
    </div>
    `;

    var arrProductTableEls = $(`.product-table-${option.table} div table tbody`);

    for (const el of arrProductTableEls.children()) {
        el.remove();
    }

    console.log('option.orderableItems', option.orderableItems)
    var initValue = 0
    try {
        if (option.table != 'findnewapps' && option.table != 'getupgrades') {
            initValue = option.orderableItems[0] ? option.orderableItems[0].amount : '0'
        }
    } catch (e) { }

    var strLicenseAmount = option.table != 'findnewapps' ? '<td class="licenseAmount">$' + initValue + '</td>' : ''

    arrProductTableEls.append(
        `<tr class="row-${strProductKeyClass} row-${option.table}">
            <td>0</td>
            ${option.table == "getrenewals" ? '<td>' + strDate + '</td>' : ''}
            <td data-value="${option.productKey}">
                ${option.productDescription}
                <br>
                <span style="color:#ff7474">
                    ${blnIsLicenseExpired ? 'Expired' : ''}
                </span>
            </td>
            <td>${strListTierOptions}</td>
            ${strLicenseAmount}
            <td>
                <div class="ui form tierList-${strProductKeyClass}-radios ${option.table}-radios">
                    <div class="inline fields checkbox months-radio"> <!-- {blnIsLicenseExpired ? 'disabled' : ''} -->
                        <div class="field">
                            <div class="ui radio checkbox tierList-${strProductKeyClass}-radio tierList-${option.table}-radio tierList-${option.table}-radio-12 checked ">
                                <input 
                                    type="radio" 
                                    value="12" 
                                    class="tierList-${option.table}-input" 
                                    name="tierList-${strProductKeyClass}-months" 
                                    tabindex="0" 
                                    class="hidden" 
                                    checked="checked">
                                <label>12 Months</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox tierList-${strProductKeyClass}-radio tierList-${option.table}-radio tierList-${option.table}-radio-24 ">
                                <input 
                                    type="radio" 
                                    value="24" 
                                    class="tierList-${option.table}-input" 
                                    name="tierList-${strProductKeyClass}-months" 
                                    tabindex="0"
                                    class="hidden">
                                <label>24 Months</label>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="ui button primary ${strProductKeyClass}-button ${objUserTierForSingle.orderableItemId ? '' : 'disabled'}" type="button"></div>
                <div class="ui button grey ${strProductKeyClass}-cancel-button" onclick="removeProduct({class:'${option.table}'})" type="button">X</div>
            </td>
        </tr>`
    );
    //${blnIsLicenseExpired ? 'disabled' : ''}
    buttonLoader({
        disable: false,
        class: strProductKeyClass,
        table: option.table,
        name: 'Add to cart',
        classes: 'small',
        onclick: `addToCart({class:'${strProductKeyClass}', table:'${option.table}', license:${isLicense}, licenseType:'${option.type}'})`
    })

    var rows = $(`.product-table-${option.table} div table tbody tr`);
    index = 0
    for (let row of rows) {
        $($(row)[0].childNodes[1]).html(index) // # column to enumerate row number
        index++
    }

    $(`.tierList-${strProductKeyClass}-dropdown`).dropdown();
    $(`.tierList-${strProductKeyClass}-radio`).checkbox();


    setTimeout(() => {
        $(`.${option.table}-dropdown .menu .item, .${option.table}-radios`).unbind("click").on('click', () => {
            if (option.table != 'findnewapps') {
                console.log('changed dropdown')
                displayRadioButtons(option)
            }
            disableAddToCartBtn(option.table, strProductKeyClass)
        });
        displayRadioButtons(option)
    }, 200);
}
function disableAddToCartBtn(button, strProductKeyClass) {
    setTimeout(() => {
        var orderableItemId = $(`.${button}-dropdown`).dropdown('get value');
        var maintenanceMonths = $(`.row-${button}`).find(`.tierList-${button}-input:checked`).val();
        if (!orderableItemId || !maintenanceMonths) { //|| (blnIsLicenseExpired && button == 'getrenewals')
            $(`.${strProductKeyClass}-button`).addClass('disabled');
        } else {
            $(`.${strProductKeyClass}-button`).removeClass('disabled');
        }
    }, 200);
}
function displayRadioButtons(option) {
    setTimeout(() => {
        var selector = `.${option.table}-dropdown .menu .item.selected`;
        var el = $(selector);
        try {
            if (el[0].dataset.maintenancemonthsavailable.length) {
                $(`.tierList-${option.table}-radio-12, .tierList-${option.table}-radio-24`).removeClass('selected').addClass('disabled');
                if (el[0].dataset.maintenancemonthsavailable.includes('24')) {
                    $(`.tierList-${option.table}-radio-24`).removeClass('disabled');
                    $(`.tierList-${option.table}-radio-24`).addClass('selected');

                    if (el[0].dataset.maintenancemonthsavailable.includes('12')) {
                        $(`.tierList-${option.table}-radio-12`).addClass('selected');
                    } else {
                        $(`.tierList-${option.table}-radio-12`).removeClass('selected');
                        $(`.tierList-${option.table}-radio-24`).addClass('selected');
                    }

                    $(`.tierList-${option.table}-radio-12 input`).attr("checked", false)
                    $(`.tierList-${option.table}-radio-24 input`).attr("checked", true)
                } if (el[0].dataset.maintenancemonthsavailable.includes('12')) {
                    $(`.tierList-${option.table}-radio-12`).removeClass('disabled');
                    $(`.tierList-${option.table}-radio-12`).addClass('selected');
                    $(`.tierList-${option.table}-radio-24`).removeClass('selected');

                    $(`.tierList-${option.table}-radio-12 input`).attr("checked", true)
                    $(`.tierList-${option.table}-radio-24 input`).attr("checked", false)
                }
            } else {
                $(`.tierList-${option.table}-radio-12`).removeClass('disabled');
                $(`.tierList-${option.table}-radio-12`).addClass('selected');
                $(`.tierList-${option.table}-radio-24`).addClass('disabled');
                $(`.tierList-${option.table}-radio-24`).removeClass('selected');

                $(`.tierList-${option.table}-radio-12 input`).attr("checked", true)
                $(`.tierList-${option.table}-radio-24 input`).attr("checked", false)
            }
            if (option.table != 'findnewapps') {
                getLicenseAmount(option)
            }
            disableAddToCartBtn(option.table)
        } catch (e) { }
    }, 50);
}

function getLicenseAmount(option) {
    try {
        var intUserTier = parseInt($(`input[name=${option.table}]`).val().split(':')[3]);
        var radioValue = parseInt($('.months-radio .field .checked')[0].innerText.split(' ')[0])
        $('.licenseAmount')[0].innerText = '$' + LICENSES.find((obj) => {
            return obj.maintenanceMonths == radioValue && obj.unitCount == intUserTier
        }).originalAmount
    } catch (e) {
        console.error('radio Error | ', e)
    }
}

const removeProduct = (option) => {

    $(`.product-table-${option.class}`).remove();

    var formFields = `input[name=senRenewLicense],
                      input[name=emailRenewLicense], 
                      input[name=senUpgradeLicense],
                      input[name=senUpgradeLicense],
                      input[name=emailUpgradeLicense],
                      .findnewapps .search`;
    $('.findnewappsSearchBar .text').html('');
    $(`.${option.class}-button`).addClass('disabled');

    $(formFields).val('');
}
