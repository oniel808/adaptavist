define(['../../../Library/integrator/integrator.js', '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],
    (integrator, libMapper) => {
        const searchAddon = (option) => {
            var objResponse = integrator.integrate({
                method: 'get',
                path: libMapper.integrator.PRODUCT_ADDONS,
                urlParam: `?text=${option.search}&cost=orderable&hosting=datacenter`,
                integration: 'adap_atlassian'
            })
            arrAddons = objResponse._embedded.addons;

            log.debug('arrMockedAddon', arrAddons)

            var objReturn = {};
            consoledAddons = [];
            if (arrAddons.length) {
                var arrMainProducts = [{
                    name: "Jira Software (Data Center)",
                    key: "jira-software",
                }, {
                    name: "Jira Service Desk (Data Center)",
                    key: "jira-servicedesk",
                }, {
                    name: "Confluence (Data Center)",
                    key: "confluence-data-center",
                }, {
                    name: "Bitbucket (Data Center)",
                    key: "stash-data-center",
                }, {
                    name: "Crowd (Data Center)",
                    key: "crowd",
                }];
                productLoop:
                for (const product of arrMainProducts) {
                    for (const input of option.search.split(' ')) {
                        if (product.name.toLowerCase().includes(input.toLowerCase())) {
                            consoledAddons.push({
                                appName: `${product.name}`,
                                appKey: product.key
                            })
                            break productLoop
                        }
                    }
                }
                log.debug('consoledAddons', consoledAddons)
                for (const addon of arrAddons) {
                    consoledAddons.push({
                        appName: `${addon.name} ( ${addon._embedded.vendor.name} )`,
                        appKey: addon.key
                    })
                }

                consoledAddons.sort(function (a, b) {
                    var sorter = 0;
                    if (a.appName < b.appName) {
                        sorter = -1;
                    }
                    if (a.appName > b.appName) {
                        sorter = 1;
                    }
                    return sorter;
                });
                objReturn.httpcode = objResponse.httpcode;
            } else {
                objReturn.httpcode = 404
                objReturn.msg = 'no addons found'

            }

            objReturn.consoledAddons = consoledAddons;

            return objReturn;
        }

        const searchProduct = (option) => {
            var arrIgnoreItems = ['stash-data-center', 'confluence-data-center']
            if (!arrIgnoreItems.includes(option.search)) {
                option.search += '.data-center'
            }
            var objResponse = integrator.integrate({
                method: 'get',
                path: libMapper.integrator.PRODUCT_SEARCH,
                urlParam: `?productKey=${option.search}`,
                integration: 'adap_hamlet'
            })
            log.debug('objResponse.products', objResponse.products)
            // if (objResponse.products.length) {
            arrProducts = objResponse.products[0];

            var objReturnProducts = {
                productDescription: arrProducts.productDescription,
                productKey: arrProducts.productKey,
                orderableItems: [],
                userTiers: []
            }

            for (const orderableItems of arrProducts.orderableItems) {
                objReturnProducts.orderableItems.push({
                    orderableItemId: orderableItems.orderableItemId,
                    description: orderableItems.description,
                    monthsValid: orderableItems.monthsValid,
                    editionDescription: orderableItems.editionDescription,
                    editionType: orderableItems.editionType,
                    unitCount: orderableItems.unitCount,
                })

                objReturnProducts.userTiers.push(orderableItems.editionDescription)
            }
            objReturnProducts.httpcode = objResponse.httpcode
            // } else {
            //     objReturnProducts.httpcode = 404
            //     objReturnProducts.msg = 'no product found'
            // }

            return objReturnProducts
        }

        const getUpgradeOptions = (option) => {
            var arrProducts = integrator.integrate({
                method: 'post',
                path: libMapper.integrator.PATH_CART_GETUPGRADEOPTIONS,
                integration: 'adap_hamlet',
                param: option.data
            });

            var objResponse = {};
            objResponse.httpcode = arrProducts.httpcode

            const arrReturnProducts = [];
            log.debug('arrProducts', arrProducts);
            if (arrProducts.httpcode == 200) {
                for (const arrSubProducts of arrProducts) {
                    objResponse.type = arrSubProducts.type;
                    var arrChangeOptions = arrSubProducts.changeOptions[0];

                    for (const product of arrChangeOptions) {
                        var blnProductExist = arrReturnProducts.find(e => e.productKey === product.productKey)

                        if (!blnProductExist) {
                            arrReturnProducts.push({
                                productDescription: arrChangeOptions[0].productDescription,
                                productKey: arrChangeOptions[0].productKey,
                                orderableItems: [],
                                userTiers: []
                            });
                        }
                        var intProductIndex = arrReturnProducts.findIndex(e => e.productKey === product.productKey)
                        arrReturnProducts[intProductIndex].orderableItems.push(product)
                    }
                }
            }

            log.debug('arrReturnProducts', arrReturnProducts)
            objResponse.products = arrReturnProducts
            return objResponse
        }

        const getRenewalOptions = (option) => {
            log.debug('getRenewalOptions', option)
            var arrProducts = integrator.integrate({
                method: 'post',
                path: libMapper.integrator.PATH_CART_GETRENEWALOPTIONS,
                integration: 'adap_hamlet',
                param: option.data
            });
            var objReturnProducts
            log.debug('getRenewalOptions', arrProducts)
            if (arrProducts.httpcode == 200) {
                var objReturnProducts = {
                    productDescription: arrProducts.productDescription,
                    productKey: arrProducts.productKey,
                    renewalAction: arrProducts.renewalAction,
                    orderableItems: [],
                    userTiers: [],
                    expirationDate: arrProducts.expireDate
                }
                objReturnProducts.orderableItems = arrProducts.changeOptions
                for (const orderableItems of arrProducts.changeOptions) {
                    objReturnProducts.userTiers.push(orderableItems.editionDescription)
                }
            } else {
                objReturnProducts = arrProducts;
            }
            objReturnProducts.httpcode = arrProducts.httpcode
            return objReturnProducts;

        }

        return {
            searchAddon,
            searchProduct,
            getUpgradeOptions,
            getRenewalOptions,
        }

    });
