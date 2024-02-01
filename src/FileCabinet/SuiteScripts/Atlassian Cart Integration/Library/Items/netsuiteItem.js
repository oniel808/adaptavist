/**
 * @NApiVersion 2.1
 */
define(['N/query', 'SuiteScripts/Atlassian Cart Integration/Atlassian/api/lib/cart.js',
    '../../Library/SQL/adap_sql_library.js', '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],
    (query, cartLib, libSQL, libFieldAndDefaultValue) => {
        const PRIVATE = {}, PUBLIC = {};

        /*
            Searching and Matching of Items will not the best solution,
            as needs to be consolidate the query first,
            before matching individually or it will face Governance limitation Error
        */

        PUBLIC.getNSItems = (options) => {
            const objOutput = {}
            try {
                switch (options.action) {
                    case 'findNsItemsByAddonKey':
                        // for savedraft
                        break;
                    // for import
                    case 'findExistingNsAtlItemsByProductId':
                        objOutput.items = PRIVATE.findExistingNsAtlItemsByProductId(options)
                        break;
                }
                return objOutput
            } catch (e) {
                log.error('netsuiteItem Module | Error', e)
                return objOutput.response = 'Failed'
            }
        }


        // findExistingNsAtlItemsByProductId
        PRIVATE.findExistingNsAtlItemsByProductId = (options) => {
            log.debug('findExistingNsAtlItemsByProductId | options', options)
            var arrOutput = []
            let strSQLCartItem = "select id, custrecord_adap_atl_sen_number as sennum, custrecord_adap_cart_item_desc as productname, custrecord_adap_atl_tier as unitcount from customrecord_adap_atlassian_cart_item where custrecord_adap_atl_cart_parent='" + options.cartid + "' AND ("
            for (const [itemIndx, item] of options.items.entries()) {
                var strSEN = (item.supportEntitlementNumber != null ? item.supportEntitlementNumber : '').replace('SEN-', '')

                if (itemIndx != 0) {
                    strSQLCartItem += ' OR '
                }
                if (strSEN) {
                    strSQLCartItem += " custrecord_adap_atl_sen_number = '" + strSEN + "'"
                }
                if (item.description) {
                    strSQLCartItem += strSEN ? ' AND ' : ''
                    strSQLCartItem += " custrecord_adap_cart_item_desc LIKE '" + item.description + "'"
                    strSQLCartItem += " AND custrecord_adap_atl_tier = '" + item.tierNumber + "'"
                }
            }
            strSQLCartItem += ')'
            log.debug('strSQLCartItem', strSQLCartItem)
            arrOutput = query.runSuiteQL({
                query: strSQLCartItem
            }).asMappedResults();

            return arrOutput
        }

        PUBLIC.parseProductId = (options) => {
            var strProductNameUpperCase = (options.productName || '').toUpperCase()
            var strPlatform = options.platform || ''
            return strPlatform + "_" + (strProductNameUpperCase).replace(/[^a-zA-Z0-9]/g, "")
        }
        PUBLIC.identifyPlatform = (options, productDescription) => {
            var strProductPlatform = options.productName || ''
            strProductPlatform = strProductPlatform.toUpperCase()
            var strProductKey = options.productKey.toUpperCase()
            var strProductDescription = productDescription.toUpperCase()
            var strPlatform = ''
            if (
                strProductPlatform.includes('DATA CENTER') || strProductPlatform.includes('DATACENTER') || strProductKey.includes('DATA-CENTER') ||
                strProductDescription.includes('DATA CENTER') || strProductDescription.includes('DATACENTER') || strProductDescription.includes('DATA-CENTER')
            ) {
                strPlatform = 'DATACENTER'
            } else if (
                strProductPlatform.includes('SERVER') || strProductKey.includes('SERVER') ||
                strProductDescription.includes('SERVER') || strProductDescription.includes('SERVER')
            ) {
                strPlatform = 'SERVER'
            } else if (
                strProductPlatform.includes('CLOUD') || strProductKey.includes('CLOUD') ||
                strProductDescription.includes('CLOUD') || strProductDescription.includes('CLOUD')
            ) {
                strPlatform = 'CLOUD'
            }
            return strPlatform
        }

        /*
        sample use:
            libNetsuiteItem.getNSItemsBaseOnProductId({
                atlQuote:{
                    orderItems:[{
                        productName:'JIRA',
                        platform:'DATACENTER'
                    }]
                }
            })
        */
        PUBLIC.getProductIds = (options) => {
            var arrProductIds = [];
            log.debug('getNSItems options', options)
            for (const atlQuoteItem of options.atlQuote.orderItems) {
                var strProdId = PUBLIC.parseProductId(atlQuoteItem);
                arrProductIds.push(`'${strProdId}'`);
            }
            return arrProductIds
        }
        PUBLIC.getNSItemsBaseOnProductId = (arrProductIds) => {
            var NSItems = libSQL.search({
                type: 'getNSItemsBaseOnProductId',
                params: {
                    productIds: arrProductIds.join(),
                }
            });
            log.debug('NSItems', NSItems)

            return NSItems;

        }

        PUBLIC.createNSItemsIfNotExisting = (options) => {
            let arrNSItems = options.nsitems
            let arrItemsToCreate = []
            for (const atlQuoteItem of options.atlQuote.orderItems) {
                var strProdId = PUBLIC.parseProductId(atlQuoteItem);
                var strProductName = atlQuoteItem.productName
                var isNSItemExist = arrNSItems.findIndex((obj) => obj.productid == strProdId);
                if (isNSItemExist < 0) {
                    arrItemsToCreate.push(atlQuoteItem)
                }
            }
            let arrCreatedItems = PUBLIC.createNetsuiteItemBaseOnProductId({
                action: 'toCreateItem',
                data: arrItemsToCreate
            });
            log.debug('created netSuite item', arrCreatedItems)
            arrNSItems = arrNSItems.concat(arrCreatedItems);
            log.debug('createNSItemsIfNotExisting | arrNSItems', options)
            return arrNSItems
        }


        PUBLIC.createNetsuiteItemBaseOnProductId = (option) => {
            let arrItemsToCreate = option.data
            if (arrItemsToCreate.length > 0) {
                let arrCreatedItems = []
                let strSqlProductName = libSQL.sqlQuery.productNameQuery
                for (let i = 0; i < arrItemsToCreate.length; i++) {
                    arrItemsToCreate[i].productName = arrItemsToCreate[i].productName.replaceAll("'", "''")
                    if (i === 0) {
                        strSqlProductName += "'" + arrItemsToCreate[i].productName + "'"
                    } else {
                        strSqlProductName += ",'" + arrItemsToCreate[i].productName + "'"
                    }
                }
                strSqlProductName += ")"
                let itemName = '';
                let arrExistingItems = query.runSuiteQL({
                    query: strSqlProductName
                }).asMappedResults();
                log.debug('arrExistingItems', arrExistingItems)
                //check if product name is already used as item name. if True use the productname + platform format
                for (let item of arrItemsToCreate) {
                    let strPlatform = '';
                    let objPlatformMapping = libFieldAndDefaultValue.platformMappings
                    strPlatform = objPlatformMapping[item.platform]
                    const exists = arrExistingItems.some(nsItem => nsItem.itemid === item.productName);
                    if (exists) {
                        itemName = item.productName + ' - ' + strPlatform
                    } else {
                        itemName = item.productName
                    }

                    let strProductKey = '';
                    if (item.addonKey) {
                        strProductKey = item.addonKey
                            .replaceAll('.data-center', '')
                            .replaceAll('.sever', '')
                            .replaceAll('.cloud', '')
                            .replaceAll('-data-center', '')
                            .replaceAll('-sever', '')
                            .replaceAll('-cloud', '')
                    }

                    let objItemToCreate = {
                        type: 'createItemRecord',
                        data: {
                            productName: itemName,
                            productId: PUBLIC.parseProductId(item),
                            addonKey: strProductKey,
                            platform: strPlatform,
                        },
                        method: 'create'
                    }
                    let isAlreadyCreated = false;
                    for (let item of arrCreatedItems) {
                        if (itemName == item.productName) {
                            isAlreadyCreated = true
                            break;
                        }
                    }
                    if (!isAlreadyCreated) {
                        let intItemId = cartLib.configureRecord(objItemToCreate)
                        arrCreatedItems.push({
                            id: intItemId,
                            productid: PUBLIC.parseProductId(item),
                            productName: itemName
                        })
                    }
                }
                log.debug('arrCreatedItems', arrCreatedItems)
                return arrCreatedItems
            }
        }

        PUBLIC.getNSItemId = (arrNSItems, productId) => {
            log.debug('productId', productId)
            log.debug('arrNSItems', arrNSItems)
            let desiredItem = arrNSItems.find(item => item.productid == productId);
            return { id: desiredItem.id, productId: desiredItem.productid }
        }

        return PUBLIC

    });
