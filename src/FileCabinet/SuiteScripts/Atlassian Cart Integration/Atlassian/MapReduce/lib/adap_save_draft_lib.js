/**
 * @NApiVersion 2.1
 */
define(['../../../Library/SQL/adap_sql_library.js', '../../api/lib/cart.js', '../../../Library/Items/netsuiteItem.js', '../../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js',],

    (libSuitesQl, libCart, libNetsuiteItem, libMapper) => {

        const SUBLISTID = 'item';
        const METHOD_CREATE = 'create';
        const METHOD_ADDITEMS = 'additems';
        const METHOD_UPDATE = 'update';
        const objEstimateFields = libMapper.estimateFields.fields

        const createCartRecord = (option) => {
            var objCartResponse = option.cartResponse;
            var strGetCart = objCartResponse.quoteDataJson;
            var arrNSItemsNoId = [];
            objCartResponse.cartUuid = option.uuid;

            //Create Cart
            objCartData = { ...option.summary, ...JSON.parse(objCartResponse.quoteDataJson) };
            objCartData.originalDraftData = strGetCart;
            objCartData.cartUuid = option.uuid;
            objCartData.status = 1;
            objCartData.method = option.cartId == 'null' ? METHOD_CREATE : METHOD_UPDATE;
            if (option.estid) {
                var arrEstimateRecord = libSuitesQl.search({
                    type: 'estimateRecordSearch',
                    params: {
                        estimate: option.estid
                    }
                });
                log.debug('arrEstimateRecord, ', arrEstimateRecord)
                if (arrEstimateRecord.length) {
                    objCartData.technicalContactName = arrEstimateRecord[0].techcontactname
                    objCartData.technicalContactEmail = arrEstimateRecord[0].techcontactemail
                }
            }
            objCartData.quoteDataJson = objCartResponse.quoteDataJson;
            log.debug('GetInput | option.cartId 1', option.cartId);
            var intCartId = libCart.configureRecord({
                type: 'atlassianCart',
                id: option.cartId,
                data: objCartData,
                option: option,
                method: objCartData.method
            });
            option.cartId = intCartId
            log.debug('GetInput | option.cartId 2', option.cartId);

            for (const nsitem of objCartResponse.items) {
                var strPlatform = libNetsuiteItem.identifyPlatform(nsitem.productDetails, nsitem.description);
                arrNSItemsNoId.push({
                    productName: nsitem.productDetails.productDescription,
                    platform: strPlatform,
                    addonKey: nsitem.productDetails.productKey
                });
            }

            var arrProductIds = libNetsuiteItem.getProductIds({ atlQuote: { orderItems: arrNSItemsNoId } });
            var arrNSItems = libNetsuiteItem.getNSItemsBaseOnProductId(arrProductIds);
            arrNSItems = libNetsuiteItem.createNSItemsIfNotExisting({ nsitems: arrNSItems, atlQuote: { orderItems: arrNSItemsNoId } });
            log.debug('GetInput | arrNSItems', arrNSItems);
            arrNSItems = arrNSItems.filter(o => !o === false);
            log.debug('GetInput | arrNSItems 2', arrNSItems);

            option.NSItems = arrNSItems
            var arrNSCartItem = libSuitesQl.search({
                type: 'createdCartItems',
                params: {
                    estid: option.estid,
                    cartId: intCartId
                }
            }) || [];
            option.NSCartItem = arrNSCartItem
            option.estimateLines = []
            return option
        }

        const createCartItemRecords = (option) => {
            const arrCartLines = option.cartLines;
            const arrNSItems = option.NSItems;
            log.debug('map | arrNSItems', arrNSItems);
            const arrNSCartItem = option.NSCartItem;
            log.debug('map | arrNSCartItem', arrNSCartItem);

            var strPlatform = libNetsuiteItem.identifyPlatform(option.mapContext.productDetails, option.mapContext.description);

            log.debug('map | strPlatform', strPlatform);
            var strProductId = libNetsuiteItem.parseProductId({
                productName: option.mapContext.productDetails.productDescription,
                platform: strPlatform,
            });

            var objNSItem = libNetsuiteItem.getNSItemId(arrNSItems, strProductId);

            let intItemIndxInNS = arrNSCartItem.findIndex((obj) => obj.cartItemId == option.mapContext.id);
            let intItemIndxInCurrentCart = arrCartLines.findIndex((obj) => obj.id == option.mapContext.id);
            var intCartItemId;

            // var strCartIdKey = PREFIX_ID + '_CartId_' + intUniqueId;
            // var intCartId = scriptCache.get({ key: strCartIdKey });

            objCartItem = {
                ...arrNSCartItem[intItemIndxInNS],
                ...arrCartLines[intItemIndxInCurrentCart],
                cartId: option.cartId,
                itemId: objNSItem.id,
                productId: objNSItem.productId,
            }
            let isAddedToEst = false;

            log.debug('map | option.estid', option.estid);
            objCartItem.licenseType = arrCartLines[intItemIndxInCurrentCart].productDetails.licenseType;
            log.debug('map | objCartItem.licenseType', objCartItem.licenseType);
            objCartItem.saleType = arrCartLines[intItemIndxInCurrentCart].productDetails.saleType;
            log.debug('map | objCartItem.saleType', objCartItem.saleType);

            if (intItemIndxInNS < 0) {
                if (objCartItem.itemId) {
                    intCartItemId = libCart.configureRecord({
                        type: 'atlassianCartItem',
                        data: objCartItem,
                        option: option,
                        method: METHOD_CREATE
                    });
                }
            } else {
                isAddedToEst = true;
                intCartItemId = libCart.configureRecord({
                    type: 'atlassianCartItem',
                    id: objCartItem.cartitemid,
                    data: objCartItem,
                    option: option,
                    method: METHOD_UPDATE
                });
            }
            var objEstimateLines = {
                ...arrNSCartItem[intItemIndxInNS],
                ...objCartItem,
                cartId: option.cartId,
                cartitemid: intCartItemId,
                isAddedToEst: isAddedToEst,
            }

            if (option.estid) {
                var arrEstimateRecord = libSuitesQl.search({
                    type: 'estimateRecordSearch',
                    params: {
                        estimate: option.estid
                    }
                });
                log.debug('arrEstimateRecord, ', arrEstimateRecord)
                if (arrEstimateRecord.length) {
                    objEstimateLines.technicalContactName = arrEstimateRecord[0].techcontactname
                    objEstimateLines.technicalContactEmail = arrEstimateRecord[0].techcontactemail
                }
            }

            option.estimateLines.push(objEstimateLines)
            log.debug('map | option.estimateLines', option.estimateLines);
            return option
        }
        const removeNonExistingCartItem = (option) => {
            EstRemoveLines = [];
            for (const nsitem of option.NSCartItem) {
                var intIndx = option.cartResponse.items.findIndex((obj) => obj.orderid == nsitem.orderid)
                if (intIndx < 0) {
                    EstRemoveLines.push({
                        cartitemid: nsitem.cartitemid,
                        cartid: nsitem.cartid
                    });
                }
            }
            return EstRemoveLines
        }
        const createUpdateEstimateRecord = (option) => {
            var intEstId
            try {
                intEstId = libCart.configureRecord({
                    type: 'estimateFields',
                    isSaveDraft: true,
                    data: option.estimateLines,
                    removeLines: option.EstRemoveLines,
                    option: option,
                    method: METHOD_ADDITEMS,
                    cartId: option.cartId,
                    id: option.estid,
                    cf: libMapper.customForms.estimate
                });
                log.debug('summarize | intEstId', intEstId);
            } catch (e) {
                log.debug('summarize | estimate Error', e);
            }


            log.debug('summarize | estimate estimateLines', option.estimateLines);
            try {


                if (intEstId) {
                    for (const cartItem of option.estimateLines) {
                        if (cartItem.cartitemid) {
                            log.debug('typeof cartItem.cartitemid', typeof cartItem.cartitemid)
                            libCart.configureRecord({
                                type: 'atlassianCartItem',
                                method: METHOD_UPDATE,
                                id: cartItem.cartitemid,
                                data: {
                                    isAddedtoEstimate: true
                                },
                            });
                        }
                    }
                    libCart.configureRecord({
                        type: 'atlassianCart',
                        method: METHOD_UPDATE,
                        id: option.cartId,
                        data: {
                            estimate: intEstId
                        },
                    });
                }
            } catch (e) {
                log.debug('summarize | estimate estimateLines Error', e);
            }
            try {
                log.debug('summarize | estimate EstRemoveLines', option.EstRemoveLines);
                for (const line of option.EstRemoveLines) {
                    libCart.configureRecord({
                        type: 'atlassianCartItem',
                        id: line.cartitemid,
                        method: 'delete'
                    });
                }
            } catch (e) {
                log.debug('summarize | estimate EstRemoveLines Error', e);
            }
            return intEstId
        }

        return { createCartRecord, createCartItemRecords, removeNonExistingCartItem, createUpdateEstimateRecord }

    });
