var arrButtonHandler = ['Renew', 'Upgrade'];

for (const button of arrButtonHandler) {
    $(`.sen${button} input, .email${button} input`).on('keyup input paste', () => {
        const intAccountId = $(`.input input[name=sen${button}License]`)[0].value;
        const strEmail = $(`.input input[name=email${button}License]`)[0].value;
        if (!intAccountId || !strEmail) {
            $(`.get${button}Option-button`).addClass('disabled');
        } else {
            $(`.get${button}Option-button`).removeClass('disabled');
        }
    });
}

const getLicenseOption = (option) => {
    var intAccountId = $(`.input input[name=sen${option.identifier}License]`)[0].value;
    var strEmail = $(`.input input[name=email${option.identifier}License]`)[0].value;

    $(`.${option.table}-button`).addClass('disabled');
    loader({
        isLoading: true,
        name: option.identifier,
        anchor: option.table,
        isDimmed: false
    });

    if (!intAccountId || !strEmail) {
        loader({
            isLoading: false,
            name: option.identifier,
            anchor: option.table
        });
    } else {
        $.ajax({
            url: `${scriptLink}&action=get${option.identifier}Options`,
            method: 'POST',
            data: {
                data: JSON.stringify({
                    accountId: parseInt(intAccountId),
                    email: strEmail,
                })
            },
            success: function (data) {
                data = JSON.parse(data);
                products = data.products || data
                loader({
                    isLoading: false,
                    name: option.identifier,
                    anchor: option.table
                });
                if (data.httpcode == 500) {
                    var title = ''
                    if (option.table == 'getupgrades') {
                        title = 'getting Upgrades'
                    } else {
                        title = 'getting Renewals'
                    }
                    errorModal({
                        title: `An error occurred while retrieving ${title}`,
                        msg: "SEN number or E-mail address do not match our records. <br/> Please verify the information and try again."
                    });
                } else if (data.httpcode == 200) {
                    $(`.product-table-getrenewals`).remove();
                    $(`.product-table-getupgrades`).remove();
                    $(`.getrenewals-button`).addClass('disabled');
                    $(`.getupgrades-button`).addClass('disabled');
                    createProductTable({ data: products, table: option.table, type: data.type });
                }
            },
            error: function (data) {
                errorModal({ title: 'Error occured Getting Atlassian License Option', ...data });
            }
        });
    }
}
