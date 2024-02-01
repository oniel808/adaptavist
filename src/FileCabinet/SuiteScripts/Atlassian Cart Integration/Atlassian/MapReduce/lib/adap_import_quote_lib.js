/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/query', 'N/file', 'N/runtime', 'N/search',
    '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js',
    '../../api/lib/cart.js',
    '../../../Library/Items/netsuiteItem.js',
    '../../../Library/TechnicalContact/adap_lib_tech_contact.js',],

    (record, query, file, runtime, search,
        libMapper,
        cart,
        libNetsuiteItem,
        libTechContact,) => {


        const PDF_LINK = 'https://my.atlassian.com/billing/pdf/'
        const initializeImportCart = (options) => {

            const intATNumber = options.orderNumber ? options.orderNumber.replace('AT-', '') : '';

            if (options.cartId) {
                let objPDFSearch = search.lookupFields({
                    type: libMapper.atlassianCart.id,
                    id: options.cartId,
                    columns: [libMapper.atlassianCart.fields.quoteLink.id]
                });
                log.audit('objPDFSearch', objPDFSearch);
                if (!objPDFSearch[libMapper.atlassianCart.fields.quoteLink.id]) {
                    record.submitFields({
                        type: libMapper.atlassianCart.id,
                        id: options.cartId,
                        values: {
                            name: options.orderNumber,
                            [libMapper.atlassianCart.fields.quoteLink.id]: PDF_LINK + intATNumber
                        }
                    });
                }
            }

            let arrItems = JSON.parse(options.items);
            var arrProductIds = libNetsuiteItem.getProductIds({ atlQuote: { orderItems: arrItems } });
            var arrNSItems = libNetsuiteItem.getNSItemsBaseOnProductId(arrProductIds);
            arrNSItems = libNetsuiteItem.createNSItemsIfNotExisting({ nsitems: arrNSItems, atlQuote: { orderItems: arrItems } });
            var arrCartItems = libNetsuiteItem.getNSItems({ action: 'findExistingNsAtlItemsByProductId', items: arrItems, cartid: options.cartId });
            options.arrNSItems = arrNSItems
            options.arrItems = arrItems
            options.arrCartItems = arrCartItems
            return options
        }

        const createCartItemRecords = (options) => {
            try {

                for (const [itemIndx, item] of options.arrItems.entries()) {
                    let strSEN = '';
                    item.productId = libNetsuiteItem.parseProductId(item);
                    let objNsItemId = libNetsuiteItem.getNSItemId(options.arrNSItems, item.productId)
                    item.itemId = objNsItemId.id;

                    if (item.supportEntitlementNumber) {
                        strSEN = (item.supportEntitlementNumber).replace('SEN-', '')
                        item.supportEntitlementNumber = item.supportEntitlementNumber ? item.supportEntitlementNumber.split('-')[1] : ''
                    }
                    item.id = '';
                    item.cartId = options.cartId;

                    if (options.objIsExisting.ifExists == true) {
                        log.debug('options.arrItems ', options.arrItems)
                        var intCartItemIndx = options.arrItems.findIndex((obj) => {
                            if (strSEN) {
                                return strSEN === obj.sennum && item.description === obj.productname && item.unitCount === obj.unitcount
                            } else if (item.description) {
                                return item.description === obj.productname && item.unitCount === obj.unitcount
                            }
                        })
                        if (intCartItemIndx >= 0) {
                            item.cartitemid = cart.configureRecord({
                                type: 'atlassianCartItem',
                                id: options.arrItems.items[intCartItemIndx].id,
                                data: item,
                                method: 'update'
                            });
                            (options.arrItems.items).splice(intCartItemIndx, 1)
                            log.debug('options.arrItems after splice ', options.arrItems)
                        } else {
                            //create cart item if not existing
                            item.cartitemid = cart.configureRecord({
                                type: 'atlassianCartItem',
                                data: item,
                                method: 'create'
                            });
                        }
                    } else {
                        //create cart item if not existing
                        item.cartitemid = cart.configureRecord({
                            type: 'atlassianCartItem',
                            data: item,
                            method: 'create'
                        });
                    }
                    options.arrItems[itemIndx] = item;
                }
                return options
            } catch (e) {
                log.debug('map | ERROR', e)
            }
        }

        const removeNonExistingCartItem = () => {

        }

        const createUpdateEstimateRecord = (options) => {
            let intEstId = cart.configureRecord({
                type: 'estimateFields',
                data: options.arrItems,
                option: { ...options, ...options.objAtlassianQuote },
                removeLines: [],
                method: 'additems',
                cartId: options.cartId,
                id: options.estid,
                cf: libMapper.customForms.estimate
            });
            log.debug('createUpdateEstimateRecord | estimate id', intEstId)
            try {
                if (!intEstId) {
                    deleteFailedRecords(options.cartId)
                }
                record.submitFields({
                    type: libMapper.atlassianCart.id,
                    id: options.cartId,
                    values: {
                        [libMapper.atlassianCart.fields.quoteId.id]: options.orderNumber,
                        [libMapper.atlassianCart.fields.estimate.id]: intEstId,
                    }
                });

                if (options.objIsExisting.ifExists) {
                    var strAtQuote = JSON.stringify(options.objAtlassianQuote)
                    log.debug('strAtQuote', strAtQuote)
                    updateCartBaseOnEstimate({ cart: options.cartId, estimate: intEstId, atQuote: strAtQuote })
                }

                libTechContact.attachContactToEstimate(intEstId);
            } catch (e) {
                log.debug('createUpdateEstimateRecord | Error', e)
            }
            return intEstId
        }



        const updateCartBaseOnEstimate = (option) => {// inside import create function
            let strCartItemQuery = "select id from " + libMapper.atlassianCartItem.id + " where " + libMapper.atlassianCartItem.fields.cartId.id + " ='" + option.cart + "'"
            const arrCartItemsOnCart = query.runSuiteQL({
                query: strCartItemQuery
            }).asMappedResults()
            log.debug('arrCartItemsOnCart', arrCartItemsOnCart)
            if (arrCartItemsOnCart.length > 0) {
                let objEstimateSublist = libMapper.estimateFields.sublist.item
                let strEstimateCartItems = "select " + objEstimateSublist.cartitemid.id + " from transactionline where " + objEstimateSublist.cartId.id + "='" + option.cart + "' AND transactionline.transaction='" + option.estimate + "'"
                const arrCartItemsOnEstimate = query.runSuiteQL({
                    query: strEstimateCartItems
                }).asMappedResults()
                log.debug('arrCartItemsOnEstimate', arrCartItemsOnEstimate)
                if (arrCartItemsOnEstimate.length > 0) {
                    // Convert the cartItemsInEstimate array to a Set for faster lookup
                    const estimateItemSet = new Set(arrCartItemsOnEstimate.map(item => item[objEstimateSublist.cartitemid.id]));
                    log.debug('estimateItemSet', estimateItemSet)
                    // Filter out the items from cartItemsInCart that are not in cartItemsInEstimate
                    const itemsNotInEstimate = arrCartItemsOnCart.filter(item => !estimateItemSet.has(item.id));
                    log.debug('itemsNotInEstimate', itemsNotInEstimate)
                    // Extract the 'id' values from the result
                    const idsNotInEstimate = itemsNotInEstimate.map(item => item.id);
                    log.debug('idsNotInEstimate', idsNotInEstimate)
                    if (idsNotInEstimate.length > 0) {
                        for (let cartItem of idsNotInEstimate) {
                            record.submitFields({
                                type: libMapper.atlassianCartItem.id,
                                id: cartItem,
                                values: { [libMapper.atlassianCartItem.fields.cartId.id]: '' }
                            })
                        }
                        record.submitFields({
                            type: libMapper.atlassianCart.id,
                            id: option.cart,
                            values: { [libMapper.atlassianCart.fields.quoteDataJson.id]: option.atQuote }
                        })
                    }
                }
            }
        }

        const deleteFailedRecords = (cartid) => { // inside import create function
            var arrResult = query.runSuiteQL({
                query: `SELECT id from ${libMapper.atlassianCartItem.id} WHERE ${libMapper.atlassianCartItem.fields.cartId.id} = ${cartid}`
            }).asMappedResults();
            for (let index = 0; index < arrResult.length; index++) {
                try {
                    record.delete({ type: libMapper.atlassianCartItem.id, id: arrResult[index].id })
                } catch (e) {
                    console.log('e', e)
                }
            }
            var arrResult = query.runSuiteQL({
                query: `SELECT id from ${libMapper.atlassianCart.id} WHERE id = ${cartid}`
            }).asMappedResults();
            for (let index = 0; index < arrResult.length; index++) {
                try {
                    record.delete({ type: libMapper.atlassianCart.id, id: arrResult[index].id })
                } catch (e) {
                    console.log('e', e)
                }
            }
        }

        return {
            initializeImportCart,
            createCartItemRecords,
            removeNonExistingCartItem,
            createUpdateEstimateRecord
        }

    });
