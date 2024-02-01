

let keyupTimer;

$('.findnewapps .search').keypress(function (searchEl) {
    clearTimeout(keyupTimer);
    $('.findnewappsSearchBar .menu .item').remove();
    keyupTimer = setTimeout(function () {
        inputSearch()
    }, 500);
});


const inputSearch = () => {
    var strInputSearch = $('.findnewapps .search')[0].value;
    // var strAppKey = $('input[name=findnewapps]').val()
    $.ajax({
        url: `${scriptLink}&action=searchAddon&search=${strInputSearch}`,
        method: 'GET',
        success: function (data) {
            console.log('keypress', data);
            var data = JSON.parse(data);
            if (data.httpcode != 200) {
                errorModal({ ...data, title: 'Error occured Finding new apps' });
            } else {
                let arrAddons = data.consoledAddons;
                elements = $('.findnewapps .menu div');
                for (let el of elements) {
                    el.remove();
                }
                if (arrAddons.length) {
                    for (const addon of arrAddons) {
                        $('.findnewapps .menu').append(`<div class="item" data-value="${addon.appKey}">${addon.appName}</div>`);
                        $('.selection-item').remove();
                    }
                } else {
                    $('.findnewapps .menu').append(`<div class="message selection-item">No results found.</div>`);
                }
            }
        },
        error: function (data) {
            errorModal({ ...data, title: 'Error occured Finding new apps' });
        }
    });
};




$('input[name=findnewapps]').on('change', (data) => {
    $('.findnewappsSearchBar .menu .item').remove()
    $('.findnewapps .search').val('');
    $('.findnewappsSearchBar .text').html('');
    loader({
        isLoading: true,
        name: 'findnewapps',
        anchor: 'findnewapps',
        isDimmed: false
    });

    console.log('data.currentTarget.value, ', data.currentTarget.value)
    $('.findnewappsSearchBar .menu .item').unbind('click')
    $('.findnewappsSearchBar .menu .item').on('click', () => {
        plotProductList(data)
    });
    plotProductList(data)
});

const plotProductList = (data) => {

    if (data.currentTarget.value) {
        $.ajax({
            url: `${scriptLink}&action=searchProduct&search=${data.currentTarget.value}`,
            method: 'GET',
            success: function (data) {
                $('input[name=findnewapps]').val('')
                var data = JSON.parse(data);
                if (data.httpcode != 200) {
                    errorModal({ ...data, title: 'Error occured Loading new Apps' });
                } else {
                    loader({
                        isLoading: false,
                        name: 'findnewapps',
                        anchor: 'findnewapps'
                    });
                    var strProductTable = createProductTable({ data: data, table: 'findnewapps' });
                    $(strProductTable).insertAfter(".ui.findnewapps");
                }
            },
            error: function (data) {
                errorModal({ ...data, title: 'Error occured Loading new Apps' });
            }
        });
    }
}