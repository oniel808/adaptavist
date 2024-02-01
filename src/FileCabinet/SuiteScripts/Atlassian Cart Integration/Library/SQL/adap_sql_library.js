/**
 * @NApiVersion 2.1
 */
define(['N/query'],

    (query) => {
        const search = (option) => {
            log.debug('searchSql', option);
            let arrResult = [];
            let sql = sqlQuery[option.type];
            log.debug('sqlQuery', option.type)
            log.debug('sqlQuery sql', sql)
            let params = option.params;
            for (const key in params) {
                sql = sql
                    .replace(`{{${key}}}`, typeof params[key] == 'object' ? params[key].join() : params[key])
                    .replaceAll('\n', '');
            }
            arrResult = query.runSuiteQL({ query: sql }).asMappedResults();
            log.debug('sql', sql)
            return arrResult;
        }

        let sqlQuery = {
            productNameQuery:
                "select id,itemid  from item where  item.itemtype IN ('Service') and  itemid in (",
            validateGenerateQuote:
                "select id,custrecord_adap_at_cart_tc_name,custrecord_adap_at_cart_tc_email from customrecord_adap_atlassian_cart where custrecord_adap_at_cart_estimate = '{recordId}' and custrecord_adap_at_quote_status = '1'",
            getStateShortName:
                'SELECT\n' +
                '\tCountry.ID AS CountryID,\n' +
                '\tCountry.Name AS CountryName,\n' +
                '\tCountry.Edition,\n' +
                '\tCountry.Nationality,\n' +
                '\tState.ID AS StateID,\n' +
                '\tState.ShortName AS StateShortName,\n' +
                '\tState.FullName AS StateFullName\n' +
                'FROM\n' +
                '\tCountry\n' +
                '\tLEFT JOIN State ON\n' +
                '\t\t( State.Country = Country.ID )\n' +
                '\n' +
                'WHERE State.ID  = \'{{stateId}}\'\n' +
                '\n' +
                'ORDER BY\n' +
                '\tCountryName,\n' +
                '\tStateShortName',
            getTechnicalContactAddress:
                "SELECT \n" +
                "  BUILTIN_RESULT.TYPE_STRING(Contact.entityid) AS entityid, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(Contact.email) AS email, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addressee_0) AS addressee, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addrphone_0) AS addrphone, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addr1_0) AS addr1, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addr2_0) AS addr2, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.city_0) AS city, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.shortname_0) AS shortname, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.zip_0) AS zip, \n" +
                "  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(ContactAddressbook_SUB.country_0)) AS country\n" +
                "FROM \n" +
                "  Contact, \n" +
                "  (SELECT \n" +
                "    ContactAddressbook.entity AS entity, \n" +
                "    ContactAddressbook.entity AS entity_join, \n" +
                "    ContactAddressbookEntityAddress_SUB.addressee AS addressee_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.addrphone AS addrphone_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.addr1 AS addr1_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.addr2 AS addr2_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.city AS city_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.shortname AS shortname_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.zip AS zip_0, \n" +
                "    ContactAddressbookEntityAddress_SUB.country AS country_0, \n" +
                "    ContactAddressbook.defaultbilling AS defaultbilling_crit\n" +
                "  FROM \n" +
                "    ContactAddressbook, \n" +
                "    (SELECT \n" +
                "      ContactAddressbookEntityAddress.nkey AS nkey, \n" +
                "      ContactAddressbookEntityAddress.nkey AS nkey_join, \n" +
                "      ContactAddressbookEntityAddress.addressee AS addressee, \n" +
                "      ContactAddressbookEntityAddress.addrphone AS addrphone, \n" +
                "      ContactAddressbookEntityAddress.addr1 AS addr1, \n" +
                "      ContactAddressbookEntityAddress.addr2 AS addr2, \n" +
                "      ContactAddressbookEntityAddress.city AS city, \n" +
                "      state.shortname AS shortname, \n" +
                "      ContactAddressbookEntityAddress.zip AS zip, \n" +
                "      ContactAddressbookEntityAddress.country AS country\n" +
                "    FROM \n" +
                "      ContactAddressbookEntityAddress, \n" +
                "      state\n" +
                "    WHERE \n" +
                "      ContactAddressbookEntityAddress.dropdownstate = state.shortname(+)\n" +
                "       AND ContactAddressbookEntityAddress.country = state.country(+)\n" +
                "    ) ContactAddressbookEntityAddress_SUB\n" +
                "  WHERE \n" +
                "    ContactAddressbook.addressbookaddress = ContactAddressbookEntityAddress_SUB.nkey(+)\n" +
                "  ) ContactAddressbook_SUB\n" +
                "WHERE \n" +
                "  Contact.ID = ContactAddressbook_SUB.entity(+)\n" +
                "   AND ((Contact.entityid= '{{name}}' AND Contact.email ='{{email}}' AND ContactAddressbook_SUB.defaultbilling_crit = 'T'))",
            getCountryShortName:
                "select id from country where name='{country}'",
            getStateName:
                "select shortname From state where fullname='{state}'",
            getDefaultBilling:
                'SELECT \n' +
                '  BUILTIN_RESULT.TYPE_STRING(Customer.entityid) AS entityid, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customer.companyname) AS companyname, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr1) AS addr1, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr2) AS addr2, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.city) AS city, \n' +
                '  BUILTIN_RESULT.TYPE_STRING((customerAddressbook_SUB.country)) AS country, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(customerAddressbook_SUB.dropdownstate)) AS dropdownstate, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.state) AS state, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.zip) AS zip\n' +
                'FROM \n' +
                '  Customer, \n' +
                '  (SELECT \n' +
                '    customerAddressbook.entity AS entity, \n' +
                '    customerAddressbook.entity AS entity_join, \n' +
                '    customerAddressbookEntityAddress.addr1 AS addr1, \n' +
                '    customerAddressbookEntityAddress.addr2 AS addr2, \n' +
                '    customerAddressbookEntityAddress.city AS city, \n' +
                '    customerAddressbookEntityAddress.country AS country, \n' +
                '    customerAddressbookEntityAddress.dropdownstate AS dropdownstate, \n' +
                '    customerAddressbookEntityAddress.state AS state, \n' +
                '    customerAddressbookEntityAddress.zip AS zip, \n' +
                '    customerAddressbook.defaultbilling AS defaultbilling_crit\n' +
                '  FROM \n' +
                '    customerAddressbook, \n' +
                '    customerAddressbookEntityAddress\n' +
                '  WHERE \n' +
                '    customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey(+)\n' +
                '  ) customerAddressbook_SUB\n' +
                'WHERE \n' +
                '  Customer.ID = customerAddressbook_SUB.entity(+)\n' +
                "   AND ((Customer.ID = '{{customerid}}' AND customerAddressbook_SUB.defaultbilling_crit = \'T\'))",
            getTechContactIfExisting:
                'SELECT id\n' +
                'FROM contact\n' +
                'WHERE firstname = \'{{firstname}}\'\n' +
                'AND lastname = \'{{lastname}}\'',
            getContactBaseOnNameAndEmail:
                "select id " +
                "from contact where firstname ='{{firstname}}' AND " +
                "email = '{{email}}'",
            toRefreshQuote:
                `SELECT
                           cart.id AS cartid
                        ,  cartitem.id as cartitemid
                        ,  cartitem.custrecord_adap_atl_quote_product_id as productitemid
                        ,  cartitem.custrecord_adap_cart_item_desc as productdescription
                        ,  cartitem.custrecord_adap_atl_sen_number as sen
                        ,  cart.custrecord_adap_at_quote_data_json as nsjson
                        ,  cart.custrecord_adap_at_qt_data_refresh_json AS atjson
                        ,  cartitem.custrecord_adap_atl_item_discount_per AS itemdiscountpercent
                    FROM customrecord_adap_atlassian_cart cart
                    FULL JOIN customrecord_adap_atlassian_cart_item cartitem
                        ON cart.id = cartitem.custrecord_adap_atl_cart_parent
                    WHERE
                        cart.custrecord_adap_at_cart_estimate = {{estid}}
                    AND cart.custrecord_adap_at_isquote_updated = 'F'
                    AND cart.custrecord_adap_at_qt_data_refresh_json IS NOT NULL`,
            getRefreshQuote:
                `SELECT
                        cart.id
                        , cart.name
                        , cart.custrecord_adap_at_cart_uuid AS uuid
                        , cart.custrecord_adap_at_quote_data_json AS json
                    FROM customrecord_adap_atlassian_cart cart
                    WHERE
                        custrecord_adap_at_cart_estimate = {{estid}}
                    AND custrecord_adap_at_quote_status = 3`,
            cartItemQueryForUnlinking:
                "select id from customrecord_adap_atlassian_cart_item where custrecord_adap_atl_cart_parent='{cart}'",
            getAtlCartByName:
                "SELECT id from customrecord_adap_atlassian_cart where name = '{{name}}'",
            getAtlCartItems:
                'SELECT id from customrecord_adap_atlassian_cart_item where custrecord_adap_atl_cart_parent= {{id}}',
            getCustomerDefaultBillAdd:
                'SELECT \n' +
                '  BUILTIN_RESULT.TYPE_STRING(Customer.entityid) AS entityid, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addressee) AS addressee, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr1) AS addr1, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr2) AS addr2, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.city) AS city, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(customerAddressbook_SUB.country)) AS country, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(customerAddressbook_SUB.dropdownstate)) AS dropdownstate, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.state) AS state, \n' +
                '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.zip) AS zip, \n' +
                '   BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(customerAddressbook_SUB.addressbookaddress)) AS addressbookaddress, \n' +
                '  BUILTIN_RESULT.TYPE_BOOLEAN(customerAddressbook_SUB.defaultbilling) AS defaultbilling, \n' +
                '  BUILTIN_RESULT.TYPE_BOOLEAN(customerAddressbook_SUB.defaultshipping) AS defaultshipping\n' +
                'FROM \n' +
                '  Customer, \n' +
                '  (SELECT \n' +
                '    customerAddressbook.entity AS entity, \n' +
                '    customerAddressbook.entity AS entity_join, \n' +
                '    customerAddressbookEntityAddress.addr1 AS addr1, \n' +
                '   customerAddressbookEntityAddress.addressee AS addressee, \n' +
                '    customerAddressbook.addressbookaddress AS addressbookaddress, \n' +
                '    customerAddressbookEntityAddress.addr2 AS addr2, \n' +
                '    customerAddressbookEntityAddress.city AS city, \n' +
                '    customerAddressbookEntityAddress.country AS country, \n' +
                '    customerAddressbookEntityAddress.dropdownstate AS dropdownstate, \n' +
                '    customerAddressbookEntityAddress.state AS state, \n' +
                '    customerAddressbookEntityAddress.zip AS zip, \n' +
                '    customerAddressbook.defaultbilling AS defaultbilling, \n' +
                '    customerAddressbook.defaultshipping AS defaultshipping, \n' +
                '    customerAddressbook.defaultbilling AS defaultbilling_crit\n' +
                '  FROM \n' +
                '    customerAddressbook, \n' +
                '    customerAddressbookEntityAddress\n' +
                '  WHERE \n' +
                '    customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey(+)\n' +
                '  ) customerAddressbook_SUB\n' +
                'WHERE \n' +
                '  Customer.ID = customerAddressbook_SUB.entity(+)\n' +
                '   AND ((Customer.ID =\'{{customerId}}\' AND (customerAddressbook_SUB.defaultbilling_crit = \'T\' OR customerAddressbook_SUB.defaultshipping = \'T\')))',
            getNSItemsBaseOnProductId:
                `SELECT id, custitem_adap_at_product_id AS productid FROM item WHERE custitem_adap_at_product_id IN ( {{productIds}} )`,
            getBillingDetails: `
                SELECT
                    country.id as technicalcountrycode,
                    integrator.custrecord_adap_integration_country AS country,
                    integrator.custrecord_adap_integration_address1 AS address1,
                    integrator.custrecord_adap_integration_address2 AS address2,
                    integrator.custrecord_adap_integration_taxid AS taxid,
                    integrator.custrecord_adap_integration_country_code AS country_code,
                    integrator.custrecord_adap_integration_state AS state,
                    integrator.custrecord_adap_integration_city AS city,
                    integrator.custrecord_adap_integration_org_name AS org_name,
                    integrator.custrecord_adap_integration_zip AS zip,
                    integrator.custrecord_adap_integration_auth_email AS auth_email
                FROM customrecord_adap_integration_mapper integrator
                FULL JOIN country
                    ON country.uniqueKey = {{countryCode}}
                WHERE integrator.custrecord_adap_integration_mac = {{mac}}
                    AND integrator.custrecord_adap_integration_mapper_apiid = 'adap_hamlet'`,
            getEstimateCarts:
                'SELECT id FROM customrecord_adap_atlassian_cart where custrecord_adap_at_cart_estimate = {{id}}',
            getEstimate:
                `SELECT *,
                    custbody_adap_atl_mac_account AS mac 
                FROM transaction 
                WHERE id = {{id}}`,





            getTcContents:
                `SELECT custrecord_st_termsandconditions as tcoption
                FROM customrecord_st_termsandconditions
                WHERE id IN ({{tcoptions}})`,
            cartItems:
                `SELECT
                          cartitem.custrecord_adap_atl_product as item
                        ,  cart.custrecord_adap_at_cart_estimate as estimateId
                        ,  cart.custrecord_adap_at_qt_data_refresh_json as refreshJson
                        , cartitem.custrecord_adap_atl_avst_total AS amount
                        , cartitem.custrecord_adap_atl_tier AS tier
                        , cart.id AS cartId
                        , cartitem.id AS cartItemId
                        , custrecord_adap_atl_isaddedtoest AS isAdded
                        , custrecord_adap_atl_cart_item_order_id AS orderid
                        , cartitem.id AS cartInternalId
                        , cartitem.custrecord_adap_cart_item_desc AS description
                        , custrecord_adap_atl_item_discount_per AS customerDiscountRate
                    FROM customrecord_adap_atlassian_cart cart
                    JOIN customrecord_adap_atlassian_cart_item cartitem
                        ON cart.id = cartitem.custrecord_adap_atl_cart_parent
                    WHERE
                        cart.custrecord_adap_at_cart_estimate = {{estid}} `,
            createdCartItems:
                `SELECT
                          cartitem.custrecord_adap_atl_product as item
                        , cartitem.custrecord_adap_atl_avst_total AS amount
                        , cartitem.custrecord_adap_atl_tier AS tier
                        , cart.id AS cartId
                        , cartitem.id AS cartItemId
                        , custrecord_adap_atl_isaddedtoest AS isAdded
                        , custrecord_adap_atl_cart_item_order_id AS orderid
                        , cartitem.id AS cartInternalId
                        , cartitem.custrecord_adap_cart_item_desc AS description
                        , item.custitem_adap_at_product_id AS productname
                        , custrecord_adap_atl_quote_product_id AS productid
                        , cart.created as datecreated
                        ,
                    FROM customrecord_adap_atlassian_cart cart
                    JOIN customrecord_adap_atlassian_cart_item cartitem
                        ON cart.id = cartitem.custrecord_adap_atl_cart_parent
                        AND custrecord_adap_at_quote_status = 1
                        AND custrecord_adap_at_cart_uuid IS NOT NULL
                    JOIN item 
                        ON item.id = cartitem.custrecord_adap_atl_product
                    WHERE
                            cart.custrecord_adap_at_cart_estimate = {{estid}}
                        AND cart.id = {{cartId}}`,
            nsItems:
                `SELECT 
                    custitem_adap_at_product_id as productid, 
                    id, 
                    itemid, 
                    custitem_st_addon_key as addonkey,
                    REPLACE(UPPER(BUILTIN.DF(custitem_st_hosting)),' ', '') as hostkey
                FROM item 
                WHERE {{productIds}}
                    `,
            getEstCarts:
                `SELECT custrecord_adap_at_cart_uuid,
                        id
                    FROM customrecord_adap_atlassian_cart cart
                    WHERE
                        custrecord_adap_at_cart_uuid IS NOT EMPTY
                    AND custrecord_adap_at_cart_estimate = {{estid}}
                    AND custrecord_adap_at_quote_status = 1`,
            getEstCartsGenerateQuoteMR:
                `SELECT 
                    id AS cartid,
                    name AS cartname,
                    custrecord_adap_at_cart_uuid as uuid,
                    custrecord_adap_atl_quote_pdf_link as pdflink
                FROM
                    customrecord_adap_atlassian_cart cart
                WHERE
                    custrecord_adap_at_cart_uuid IS NOT EMPTY
                AND custrecord_adap_at_cart_estimate = {{estid}}
                AND custrecord_adap_at_quote_status = 1
                {{cartid}}`,
            getCartStatuses: `SELECT 
                    id, 
                    name, 
                    custrecord_adap_at_cart_uuid as uuid,
                    custrecord_adap_at_quote_status as status
                FROM
                    customrecord_adap_atlassian_cart 
                WHERE
                    id IN ({{cartids}})`,

            getEstCartItemGenerateQuoteMR:
                `SELECT 
                    id AS cartitemid,
                    custrecord_adap_atl_quote_product_id AS productid,
                    custrecord_adap_atl_cart_parent AS cartid,
                    custrecord_adap_atl_tier as usertier,
                    custrecord_adap_atl_item_discount_per AS customerdiscountrate,
                    custrecord_adap_atl_cart_item_order_id AS orderlineid,
                    custrecord_adap_atl_sen_number as sen
                FROM 
                    customrecord_adap_atlassian_cart_item cartitem
                WHERE
                    custrecord_adap_atl_cart_parent IN ({{carts}})`,
            getEstQuote:
                `SELECT custrecord_adap_at_cart_uuid, id
                    FROM customrecord_adap_atlassian_cart cart
                    WHERE
                    custrecord_adap_at_cart_estimate = {{estid}}
                    AND custrecord_adap_at_quote_status = 3`,
            estimateRecordSearch:
                `SELECT
                    id, 
                    custbody_atl_tech_contact_name as techContactName,
                    custbody_atl_tech_contact_email as techContactEmail
                    FROM transaction estimate
                    WHERE recordType = 'estimate' 
                    AND estimate.id = {{estimate}}`,
            getSenNumber:
                `SELECT 
                      custrecord_adap_atl_cart_item_order_id AS orederid
                    , custrecord_adap_atl_sen_number AS sennumber
                    , BUILTIN.DF(custrecord_adap_atl_license) AS licensetype
                FROM customrecord_adap_atlassian_cart_item 
                WHERE 
                    custrecord_adap_atl_cart_item_order_id IN ({{orderIds}})`,
            getLastState:
                `SELECT custbody_adap_atlassian_uuid AS uuid FROM transaction WHERE id = {{estid}}`,
            hasOpenOrder:
                `SELECT
                    cart.id
                    , cart.name
                    , cart.custrecord_adap_at_quote_data_json AS json
                FROM customrecord_adap_atlassian_cart cart
                WHERE
                    custrecord_adap_at_cart_estimate = {{estid}}
                AND custrecord_adap_at_quote_status = 1`,
            getCartItems:
                `SELECT 
                    custrecord_adap_atl_cart_item_order_id AS id,
                    custrecord_adap_atl_item_discount_per AS itemdiscountpercent
                FROM 
                    customrecord_adap_atlassian_cart_item cartitem
                LEFT JOIN 
                    customrecord_adap_atlassian_cart cart
                    ON cart.id = cartitem.custrecord_adap_atl_cart_parent
                WHERE cart.id = {{cartId}}`,
            geNSCart:
                `SELECT * FROM customrecord_adap_atlassian_cart WHERE id = {{id}}`,
            getAtlIntegrator:
                `SELECT *
                FROM customrecord_adap_integration_mapper 
                WHERE
                    custrecord_adap_integration_mapper_apiid = '{{apiid}}'
                AND custrecord_adap_integration_environment = {{env}}`,
            getEmailForInvoiceRecord:
                'SELECT * from message where transaction = {{id}}',
            redirectToExistingQuoteEstimate:
                `SELECT custrecord_adap_at_cart_estimate AS estimate FROM customrecord_adap_atlassian_cart WHERE name = '{{orderNumber}}'`,
            getMrStatus:
                `SELECT custbody_adap_atl_refresh_status AS status, type FROM transaction WHERE id = {{estid}}`,
            getDiscountRules:
                `SELECT 
                    id, 
                    name, 
                    custrecord_adap_atl_disc_is_customer AS passed_to_customer, 
                    custrecord_adap_atl_disc_reason AS reason, 
                    custrecord_adap_atl_disc_type AS type, 
                    custrecord_adap_atl_disc_is_adaptavist AS avstdiscount, 
                    custrecord_adap_atl_disc_price_adj AS price_adjustment 
                FROM 
                    customrecord_adap_alt_discount`,
            getIntegrator:
                `SELECT *,
                    custrecord_adap_integration_mapper_url AS url,
                    custrecord_adap_integration_mapper_auth AS auth,
                    custrecord_adap_integration_mapper_scret AS secret,
                    BUILTIN.DF(custrecord_adap_integration_mac) as mac_display
                FROM customrecord_adap_integration_mapper 
                WHERE
                    custrecord_adap_integration_mapper_apiid = '{{appid}}'
                AND custrecord_adap_integration_environment = {{env}}
                AND custrecord_adap_integration_mac = {{macid}}`,
            getATLCartByUuid:
                `SELECT custrecord_adap_at_cart_uuid as uuid
                    FROM customrecord_adap_atlassian_cart
                    WHERE 
                    custrecord_adap_at_cart_uuid = '{{uuid}}'`,
            getMultipleATLCartByUUID:
                `select name,custrecord_adap_at_cart_uuid from customrecord_adap_atlassian_cart where id in ({cartId}) `,
            findCartEstimate:
                `select id from transaction where custbody_adap_atl_refresh_status = '{{cartUniqueId}}'`,
            getCartsBeingGenerated:
                `SELECT 
                    name
                    , custrecord_adap_at_quote_status as status
                    , custrecord_adap_at_cart_mr_status as mrstatus
                FROM customrecord_adap_atlassian_cart
                WHERE 
                    custrecord_adap_at_cart_estimate = {{estimate}} 
                AND custrecord_adap_at_cart_mr_status IS NOT NULL`,
            getUnsetTechnicalContactInCarts:
                `SELECT 
                    custcol_adap_atlassian_cart_holder AS atlcartid,
                    linesequencenumber AS lineid
                FROM 
                    transactionline line
                FULL JOIN
                    customrecord_adap_atlassian_cart cart 
                    ON cart.id = line.custcol_adap_atlassian_cart_holder 
                WHERE
                line.transaction = {{estimate}} 
                    AND custcol_adap_atlassian_cart_holder IS NOT NULL 
                    AND custrecord_adap_at_quote_status = 1
                `
        }

        return ({ sqlQuery, search })

    });
