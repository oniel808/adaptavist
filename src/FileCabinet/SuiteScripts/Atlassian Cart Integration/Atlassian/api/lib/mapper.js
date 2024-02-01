define([],
    () => {
        MAPPER = {}
        // DEFAULT_VALUES = {
        //     openStatus: 1,
        //     closedStatus: 2,
        //     quotedStatus: 3,
        //     taxExempt: 5
        // }
        // MAPPER = {
        //     SUITELET_JS_DOM_LIB: 390,
        //     environment: {
        //         sandbox: 1,
        //         production: 2,
        //     },
        //     licenseType: {
        //         UPGRADE: 1,
        //         RENEWAL: 2,
        //         NEW: 3,
        //         COMMERCIAL: 4
        //     },
        //     uuid: {
        //         id: 'custbody_adap_atlassian_uuid',
        //         type: 'value'
        //     },
        //     customForms: {
        //         estimate: 145,
        //         serviceitem: 11,
        //         contact: 15
        //     },
        //     script: {
        //         parent: '&script=customscript_adap_atlassiancart_op_sl',
        //         deployment: '&deploy=customdeploy_adap_atlassiancart_op_sl',
        //         link: '/app/site/hosting/scriptlet.nl?'
        //     },
        //     mr: {
        //         parent: 'customscript_adap_atlassianqt_refresh_mr',
        //         deployment: 'customdeploy_adap_atlassianqt_refresh_mr',
        //         params: {
        //             estimate: 'custscript_adap_atl_refresh_estimate_id'
        //         }
        //     },
        //     generateQuoteMR:{
        //         parent:'customscript_adap_generatequote_mr',
        //         deployment:'customdeploy_adap_generatequote_mr_01',
        //         params:{
        //             estimate:'custscript_adap_atl_genquote_estimate',
        //             mac:'custscript_adap_atl_genquote_mac'
        //         }
        //     },
        //     sl: {
        //         cartDetail: {
        //             purchaserContactDetails: {
        //                 email: 'custscript_adap_cart_detail_purc_email'
        //             }
        //         },
        //     },
        //     currency:{
        //         usd:{ id:5, text: 'USD'}
        //     },
        //     keysToIgnoreForUpdate:['licensedTo','isTrialPeriod','taxExempt','isUnlimitedUsers'],
        //     bufferFields: ['newListPrice', 'avstTotal', 'margin', 'avstTotal2','priceAdjustment', 'creditAmount', 'upgradeCredit', 'newListPrice2', 'listPrice', 'customerPrice', 'discount', 'lineItemRate', 'avstDiscountAmount'],
        //     generateCartQuote: {
        //         id: 'customrecord_adap_atlassian_cart',
        //         fields: {
        //             quoteId:                  { id: 'name',                                     type: 'value' },
        //             status:                   { id: 'custrecord_adap_at_quote_status',          type: 'value',  default: DEFAULT_VALUES.closedStatus},
        //             cartEstimate:             { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //             cartUuid:                 { id: 'custrecord_adap_at_cart_uuid',             type: 'value' },
        //             serialNumber:             { id: 'custrecord_adap_at_serial_number',         type: 'value' },
        //             generateDate:             { id: 'custrecord_adap_at_quote_date',            type: 'date' },
        //             created:                  { id: 'custrecord_adap_at_cart_created_date',     type: 'date' },
        //             createdDate:              { id: 'custrecord_adap_at_cart_created_date',     type: 'date' },
        //             updated:                  { id: 'custrecord_adap_at_cart_updated_date',     type: 'date' },
        //             dueDate:                  { id: 'custrecord_adap_atl_item_due_date',        type: 'date' },
        //             purchaseOrderNumber:      { id: 'custrecord_adap_at_purchase_order',        type: 'value' },
        //             additionalNotes:          { id: 'custrecord_adap_at_memo',                  type: 'value' },
        //             expertOrder:              { id: 'custrecord_adap_at_expertorder',           type: 'value' },
        //             resellerOrder:            { id: 'custrecord_adap_at_resellerorder',         type: 'value' },
        //             creditCardOnly:           { id: 'custrecord_adap_at_credit_card_only',      type: 'value' },
        //             totalTax:                 { id: 'custrecord_adap_at_total_tax',             type: 'value' },
        //             totalProratedPrice:       { id: 'custrecord_adap_at_total_prorated_price',  type: 'text' },
        //             avstTotal:                { id: 'custrecord_adap_at_cart_total_avst_price', type: 'value' },
        //             totalCustomerCredit:      { id: 'custrecord_adap_at_cart_total_cust_cred',  type: 'value' },
        //             totalCustomerDiscount:    { id: 'custrecord_adap_at_cart_total_cust_disc',  type: 'value' },
        //             totalCustomerDiscountPer: { id: 'custrecord_adap_at_cart_quote_total_disc', type: 'value' },
        //             margin:                   { id: 'custrecord_adap_at_cart_total_margin',     type: 'value' },
        //             totalDiscountAmount:      { id: 'custrecord_adap_at_total_discount_amount', type: 'value' },
        //             totalListPriceAdjustment: { id: 'custrecord_adap_at_cart_ttl_lst_prc_adj',  type: 'value' },
        //             listPrice:                { id: 'custrecord_adap_at_cart_total_list',       type: 'value' },
        //             newListPrice:             { id: 'custrecord_adap_atl_cart_new_listprice',   type: 'value' },
        //             customerPrice:            { id: 'custrecord_adap_at_cart_total_amount',     type: 'value' },
        //             quoteDataJson:            { id: 'custrecord_adap_at_quote_data_json',       type: 'value', json: false },
        //             quoteRefreshDataJson:     { id: 'custrecord_adap_at_qt_data_refresh_json',  type: 'value', json: false },
        //             estimate:                 { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //         }
        //     },
        //     quoteForRefreshField: 'custrecord_adap_at_isquote_updated',
        //     atlassianCart: {
        //         id: 'customrecord_adap_atlassian_cart',
        //         fields: {
        //             quoteId:                  { id: 'name',                                     type: 'value' },
        //             cartEstimate:             { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //             cartUuid:                 { id: 'custrecord_adap_at_cart_uuid',             type: 'value' },
        //             serialNumber:             { id: 'custrecord_adap_at_serial_number',         type: 'value' },
        //             generateDate:             { id: 'custrecord_adap_at_quote_date',            type: 'date' },
        //             created:                  { id: 'custrecord_adap_at_cart_created_date',     type: 'date' },
        //             createdDate:              { id: 'custrecord_adap_at_cart_created_date',     type: 'date' },
        //             updated:                  { id: 'custrecord_adap_at_cart_updated_date',     type: 'date' },
        //             dueDate:                  { id: 'custrecord_adap_atl_item_due_date',        type: 'date' },
        //             purchaseOrderNumber:      { id: 'custrecord_adap_at_purchase_order',        type: 'value' },
        //             status:                   { id: 'custrecord_adap_at_quote_status',          type: 'value', default: DEFAULT_VALUES.openStatus },
        //             additionalNotes:          { id: 'custrecord_adap_at_memo',                  type: 'value' },
        //             expertOrder:              { id: 'custrecord_adap_at_expertorder',           type: 'value' },
        //             resellerOrder:            { id: 'custrecord_adap_at_resellerorder',         type: 'value' },
        //             creditCardOnly:           { id: 'custrecord_adap_at_credit_card_only',      type: 'value' },
        //             totalTax:                 { id: 'custrecord_adap_at_total_tax',             type: 'value' },
        //             totalProratedPrice:       { id: 'custrecord_adap_at_total_prorated_price',  type: 'text' },
        //             avstTotal:                { id: 'custrecord_adap_at_cart_total_avst_price', type: 'value' },
        //             totalCustomerCredit:      { id: 'custrecord_adap_at_cart_total_cust_cred',  type: 'value' },
        //             totalCustomerDiscount:    { id: 'custrecord_adap_at_cart_total_cust_disc',  type: 'value' },
        //             totalCustomerDiscountPer: { id: 'custrecord_adap_at_cart_quote_total_disc', type: 'value' },
        //             margin:                   { id: 'custrecord_adap_at_cart_total_margin',     type: 'value' },
        //             totalDiscountAmount:      { id: 'custrecord_adap_at_total_discount_amount', type: 'value' },
        //             totalListPriceAdjustment: { id: 'custrecord_adap_at_cart_ttl_lst_prc_adj',  type: 'value' },
        //             listPrice:                { id: 'custrecord_adap_at_cart_total_list',       type: 'value' },
        //             newListPrice:             { id: 'custrecord_adap_atl_cart_new_listprice',   type: 'value' },
        //             customerPrice:            { id: 'custrecord_adap_at_cart_total_amount',     type: 'value' },
        //             quoteDataJson:            { id: 'custrecord_adap_at_quote_data_json',       type: 'value', json: false },
        //             quoteRefreshDataJson:     { id: 'custrecord_adap_at_qt_data_refresh_json',  type: 'value', json: false },
        //             estimate:                 { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //             status:                   { id: 'custrecord_adap_at_quote_status',          type: 'value' },
        //             isQuoteUpdated:           { id: 'custrecord_adap_at_isquote_updated',       type: 'value' },
        //             quoteLink:                { id: 'custrecord_adap_atl_quote_pdf_link',       type: 'value' },
        //             originalDraftData:        { id: 'custrecord_adap_at_draft_data_json',       type: 'value' },
        //         }
        //     },
        //     atlassianCartItem: {
        //         id: 'customrecord_adap_atlassian_cart_item',
        //         fields: {
        //             itemId:                  { id: 'custrecord_adap_atl_product',              type: 'value' },
        //             tierNumber:              { id: 'custrecord_adap_atl_tier',                 type: 'value' },
        //             maintenanceMonths:       { id: 'custrecord_adap_atl_maintenance_month',    type: 'value' },
        //             description:             { id: 'custrecord_adap_cart_item_desc',           type: 'value' },
        //             id:                      { id: 'custrecord_adap_atl_cart_item_order_id',   type: 'value' },
        //             senNumber:               { id: 'custrecord_adap_atl_sen_number',           type: 'value' },
        //             supportEntitlementNumber:{ id: 'custrecord_adap_atl_sen_number',           type: 'value' },
        //             licenseType:             { id: 'custrecord_adap_atl_license',              type: 'value' },
        //             saleType:                { id: 'custrecord_adap_atl_saletype',             type: 'value' },
        //             cloudSiteHostname:       { id: 'custrecord_adap_atl_item_cloudsite',       type: 'url'   },
        //             startDate:               { id: 'custrecord_adap_atl_item_startdate',       type: 'date'  },
        //             endDate:                 { id: 'custrecord_adap_atl_item_enddate',         type: 'date'  },
        //             listPrice:               { id: 'custrecord_adap_atl_cart_item_list_price', type: 'value' },
        //             newListPrice:            { id: 'custrecord_adap_atl_cart_item_newlistprc', type: 'value' },
        //             upgradeCredit:           { id: 'custrecord_adap_atl_crt_itm_discount',     type: 'value' },
        //             avstDiscountAmount:      { id: 'custrecord_adap_atl_item_disc_avst',       type: 'value' },
        //             avstTotal:               { id: 'custrecord_adap_atl_avst_total',           type: 'value' },
        //             discount:                { id: 'custrecord_adap_atl_crt_itm_disc_cust',    type: 'value' },
        //             discountPercent:         { id: 'custrecord_adap_atl_item_discount_per',    type: 'value' },
        //             customerPrice:           { id: 'custrecord_adap_atl_cart_item_cust_price', type: 'value' },
        //             totalDiscount:           { id: 'custrecord_adap_atl_crt_itm_dsc_total',    type: 'value' },
        //             totalTax:                { id: 'custrecord_adap_atl_tax_line',             type: 'value' },
        //             creditAmount:            { id: 'custrecord_adap_atl_credit_amount',        type: 'value' },
        //             cartId:                  { id: 'custrecord_adap_atl_cart_parent',          type: 'value' },
        //             margin:                  { id: 'custrecord_adap_atl_quote_margin',         type: 'value' },
        //             additionalNotes:         { id: 'custrecord_adap_atl_additional_notes',     type: 'value' },
        //             productId:               { id: 'custrecord_adap_atl_quote_product_id',     type: 'value' },
        //             cloudId:                 { id: 'custrecord_adap_atl_cloudid',              type: 'text'  },
        //         }
        //     },
        //     estimate: {
        //         id: 'estimate',
        //         fields: {
        //             cf:                  { id: 'cf',                                    type: 'value', default: 145 },
        //             customform:          { id: 'customform',                            type: 'value', default: 145 },
        //             customerId:          { id: 'entity',                                type: 'value' },
        //             subsidiaryId:        { id: 'subsidiary',                            type: 'value' },
        //             purchaseOrderNumber: { id: 'otherrefnum',                           type: 'value' },
        //             refreshQuoteStatus:  { id: 'custbody_adap_atl_refresh_status',      type: 'value' },
        //             discountitem:        { id: 'discountitem',                          type: 'value', default: 11988 },
        //             discountrate:        { id: 'discountrate',                          type: 'value' },
        //             currencyId:          { id: 'currency',                              type: 'value' },
        //             tcId:                { id: 'custbody_adap_tc_option',               type: 'value' },
        //             tcAdditionalContent: { id: 'custbody_adap_tc_add_notes',            type: 'value' },
        //             tcContent:           { id: 'custbody_adap_tc_option_content',       type: 'value' },
        //             techContactName:     { id: 'custbody_atl_tech_contact_name',        type: 'value' },
        //             techContactEmail:    { id: 'custbody_atl_tech_contact_email',       type: 'value' },
        //             salesRepId:          { id: 'salesrep',                              type: 'value' },
        //             currencyBuffer:      { id: 'custbody_adap_currency_rate_buffer',    type: 'value' },
        //             macAccount:          { id: 'custbody_adap_atl_mac_account',         type: 'value' },

        //             //checkboxes
        //             includeInReport:                { id: 'custbody_adap_atl_include_in_report',   type: 'checkbox' },
        //             addSignatureBlock:              { id: 'custbody_adap_signature_block',         type: 'checkbox' },
        //             showDiscountToCustomer:         { id: 'custbody_adap_atl_shw_dscnt_to_custmr', type: 'checkbox' },
        //             showColumnDiscount:             { id: 'custbody_adap_atl_show_disc_lines',     type: 'checkbox' },
        //             csURL:                          { id: 'custbody_adap_atl_cs_url',              type: 'value'    },
        //             isPartner:                      { id: 'custbody_adap_enduser_ispartner',       type: 'checkbox' },
        //             taxOverride:                    { id: 'custbody_ava_taxoverride',              type: 'checkbox' },

        //             avstTotal2:                     { id: 'custbody_adap_total_avst_price',         type: 'currency' },
        //             avstDiscountAmount:             { id: 'custbody_adap_total_avst_discount',      type: 'currency' },
        //             creditAmount:                   { id: 'custbody_adap_total_cust_credit',        type: 'currency' },
        //             customerPrice:                  { id: 'custbody_adap_total_cust_price',         type: 'currency' },
        //             margin:                         { id: 'custbody_adap_total_margin',             type: 'currency' },
        //             marginPercent:                  { id: 'custbody_adap_total_margin_percent',     type: 'currency' },
        //             discount:                       { id: 'custbody_adap_total_customer_discount',  type: 'currency' },
        //             transactionDiscountRate:        { id: 'discountrate',                           type: 'currency' },
        //             discountPercent:                { id: 'custbody_adap_total_discount_percent',   type: 'currency' },
        //             totaLines:                      { id: 'custbody_adap_total_lines',              type: 'currency' },
        //             listPrice:                      { id: 'custbody_adap_total_listprice',          type: 'currency' },
        //             newListPrice2:                  { id: 'custbody_adap_total_listpricewadjust',   type: 'currency' },
        //             totalListPriceAdjustment:       { id: 'custbody_adap_total_listpriceadjust',    type: 'currency' },
        //             upgradeCredit:                  { id: 'custbody_adap_total_upgrade',            type: 'currency' },
        //             usdConversion:                  { id: 'custbody_adap_usd_conversion',           type: 'currency' },
        //             toUsdConversion:                { id: 'custbody_adap_atl_tran_curncy_to_usd',   type: 'currency' },

        //             endUserName:                    { id: 'custbody_adap_enduser_name',             type: 'value' },
        //             endUserEmail:                   { id: 'custbody_adap_enduser_email',            type: 'value' },
        //             endUserPhone:                   { id: 'custbody_adap_enduser_phone',            type: 'value' },
        //             endUserAddr1:                   { id: 'custbodyadap_enduser_address1',          type: 'value' },
        //             endUserAddr2:                   { id: 'custbody_enduser_address2',              type: 'value' },
        //             endUserCity:                    { id: 'custbody_adap_enduser_city',             type: 'value' },
        //             endUserZip:                     { id: 'custbody_adap_enduser_zip',              type: 'value' },
        //             endUserCountry:                 { id: 'custbody_adap_enduser_country',          type: 'value' },
        //             endUserState:                   { id: 'custbody_adap_enduser_state',            type: 'value' },
        //         },
        //         sublist: {
        //             item: {
        //                 itemId:                  { id: 'item',                                 type: 'value' },
        //                 newListPrice:            { id: 'rate',                                 type: 'currency' },
        //                 avstTotal:               { id: 'grossamt',                             type: 'currency' },
        //                 avstTotal2:              { id: 'custcol_adap_atl_item_avst_total',     type: 'currency' },
        //                 margin:                  { id: 'custcol_adap_atl_margin_amount',       type: 'currency' },
        //                 creditAmount:            { id: 'custcol_adap_atl_customer_credit',     type: 'currency' },
        //                 newListPrice2:           { id: 'custcol_adap_atl_item_newlistprice',   type: 'currency' },
        //                 listPrice:               { id: 'custcol_adap_atl_cart_item_inilstprc', type: 'currency' },
        //                 customerPrice:           { id: 'custcol_adap_item_customer_price',     type: 'currency' },
        //                 lineItemRate:            { id: 'amount',                               type: 'currency',  inputType: 'special' },
        //                 costestimate:            { id: 'costestimatetype',                     type: 'text',      default: 'CUSTOM' },
        //                 quantity:                { id: 'quantity',                             type: 'value',     default: 1 },
        //                 cartId:                  { id: 'custcol_adap_atlassian_cart_holder',   type: 'value',     inputType: 'number' },
        //                 cartitemid:              { id: 'custcol_adap_atl_cart_item',           type: 'value' },
        //                 description:             { id: 'description',                          type: 'text' },
        //                 discount:                { id: 'custcol_adap_atl_item_disc_lines',     type: 'currency' },
        //                 discountPercent:         { id: 'custcol_adap_atl_item_disc_lines_prc', type: 'currency',  inputType: 'special'},
        //                 tierNumber:              { id: 'custcol_adap_atl_item_unit_tier',      type: 'value' },
        //                 avstDiscountAmount:      { id: 'custcol_adap_atl_item_disc_avst',      type: 'currency' },
        //                 upgradeCredit:           { id: 'custcol_adap_atl_item_disc_amount',    type: 'currency' },
        //                 priceAdjustment:         { id: 'custcol_adap_atl_item_price_adj',      type: 'currency' },
        //                 id:                      { id: 'custcol_adap_atl_item_id',             type: 'text' },
        //                 cloudSiteHostname:       { id: 'custcol_adap_atl_import_url',          type: 'url' },
        //                 startDate:               { id: 'custcol_product_start_date',           type: 'date', },
        //                 endDate:                 { id: 'custcol_product_end_date',             type: 'date', },
        //                 senNumber:               { id: 'custcol_adap_atl_sen_number',          type: 'value' },
        //                 supportEntitlementNumber:{ id: 'custcol_adap_atl_sen_number',          type: 'value' },
        //                 licenseType:             { id: 'custcol_adap_atl_license',             type: 'value' },
        //                 saleType:                { id: 'custcol_adap_atl_saletype',            type: 'value' },
        //                 totalDiscount:           { id: 'custcol_adap_item_total_discount',     type: 'currency' },
        //                 orderRefNum:             { id: 'custcol_adap_atl_order_ref_num',       type: 'text' },
        //                 cloudId:                 { id: 'custcol_adap_atl_cloudid',             type: 'text' },
        //                 maintenanceMonths:       { id: 'custcol_adap_maintenance_period',      type: 'value' },
        //             }
        //         }
        //     },
        //     netsuiteCartItem: {
        //         id: 'customrecord_adap_atlassian_cart_item',
        //         fields: {
        //             newListPrice2:    { id: 'custcol_adap_atl_item_newlistprice',        type: 'value' },
        //             newListPrice:     { id: 'rate',                                      type: 'value' },
        //             avstTotal:        { id: 'grossamt',                                  type: 'value' },
        //             avstTotal2:       { id: 'custcol_adap_atl_item_avst_total',          type: 'value' },
        //             margin:           { id: 'costestimate',                              type: 'value' },
        //             cartId:           { id: 'custrecord_adap_atl_cart_parent',           type: 'value' },
        //             nsid:             { id: 'custrecord_adap_atl_product',               type: 'value' },
        //             tierNumber:       { id: 'custrecord_adap_atl_tier',                  type: 'value' },
        //             maintenanceMonths:{ id: 'custrecord_adap_atl_maintenance_month',     type: 'value' },
        //             avstTotal:        { id: 'custrecord_adap_atl_avst_total',            type: 'value' },
        //             description:      { id: 'custrecord_adap_cart_item_desc',            type: 'value' },
        //             productId:        { id: 'custrecord_adap_atl_quote_product_id',      type: 'value' },
        //         }
        //     },
        //     netsuiteCart: {
        //         id: 'customrecord_adap_atlassian_cart',
        //         fields: {
        //             purchaseOrderNumber: { id: 'custrecord_adap_at_purchase_order', type: 'value' },
        //             created: { id: 'custrecord_adap_at_cart_created_date', type: 'date' },
        //             dueDate: { id: 'custrecord_adap_atl_item_due_date', type: 'date' },
        //             status: {
        //                 id: 'custrecord_adap_at_quote_status',
        //                 type: 'value',
        //                 default: DEFAULT_VALUES.quotedStatus
        //             },

        //             cartEstimate:             { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //             cartUuid:                 { id: 'custrecord_adap_at_cart_uuid',             type: 'value' },
        //             serialNumber:             { id: 'custrecord_adap_at_serial_number',         type: 'value' },
        //             generateDate:             { id: 'custrecord_adap_at_quote_date',            type: 'date' },
        //             updated:                  { id: 'custrecord_adap_at_cart_updated_date',     type: 'date' },
        //             additionalNotes:          { id: 'custrecord_adap_at_memo',                  type: 'value' },
        //             expertOrder:              { id: 'custrecord_adap_at_expertorder',           type: 'value' },
        //             resellerOrder:            { id: 'custrecord_adap_at_resellerorder',         type: 'value' },
        //             creditCardOnly:           { id: 'custrecord_adap_at_credit_card_only',      type: 'value' },
        //             totalTax:                 { id: 'custrecord_adap_at_total_tax',             type: 'value' },
        //             totalProratedPrice:       { id: 'custrecord_adap_at_total_prorated_price',  type: 'text' },
        //             avstTotal:                { id: 'custrecord_adap_at_cart_total_avst_price', type: 'value' },
        //             totalCustomerCredit:      { id: 'custrecord_adap_at_cart_total_cust_cred',  type: 'value' },
        //             margin:                   { id: 'custrecord_adap_at_cart_total_margin',     type: 'value' },
        //             totalDiscount:            { id: 'custrecord_adap_at_cart_quote_total_disc', type: 'value' },
        //             totalDiscountAmount:      { id: 'custrecord_adap_at_total_discount_amount', type: 'value' },
        //             totalListPriceAdjustment: { id: 'custrecord_adap_at_cart_ttl_lst_prc_adj',  type: 'value' },
        //             listPrice:                { id: 'custrecord_adap_at_cart_total_list',       type: 'value' },
        //             customerPrice:            { id: 'custrecord_adap_at_cart_total_amount',     type: 'value' },
        //             quoteDataJson:            { id: 'custrecord_adap_at_quote_data_json',       type: 'value', json: false },
        //             quoteRefreshDataJson:     { id: 'custrecord_adap_at_qt_data_refresh_json',  type: 'value', json: false },
        //             estimate:                 { id: 'custrecord_adap_at_cart_estimate',         type: 'value' },
        //             status:                   { id: 'custrecord_adap_at_quote_status',          type: 'value' },
        //         }
        //     },
        //     netsuiteEstimateItems: {
        //         id: 'estimate',
        //         fields: {
        //             nsid:           { id: 'item',                              type: 'value' },
        //             quantity:       { id: 'quantity',                          default: 1, type: 'value' },
        //             customerPrice:  { id: 'amount',                            type: 'value' },
        //             cartId:         { id: 'custcol_adap_atlassian_cart_holder',type: 'value' },
        //             description:    { id: 'description',                       type: 'value' }
        //         }
        //     },
        //     netsuiteDiscountRules:{
        //         id: 'customrecord_adap_alt_discount',
        //         fields:{
        //             discountName:           { id:'name',                                     type:'text',         },
        //             discountReason:         { id:'custrecord_adap_atl_disc_reason',          type:'text',         },
        //             discountType:           { id:'custrecord_adap_atl_disc_type',            type:'text',         },
        //             discountIsAdaptavist:   { id:'custrecord_adap_atl_disc_is_adaptavist',   type:'checkbox',    default:false },
        //             discountIsCustomer:     { id:'custrecord_adap_atl_disc_is_customer',     type:'checkbox',    default:false },
        //             discountIsPriceAdj:     { id:'custrecord_adap_atl_disc_price_adj',       type:'checkbox',    default:false },
        //             discountDescription:    { id:'custrecord_adap_atl_disc_description',     type:'text',         },
        //         }
        //     },
        //     addCartDetails: {
        //         "uuid": "uuid",
        //         "purchaserContactDetails": {
        //             "email":            { id: "purchaseremail",            default: '' },
        //             "firstName":        { id: "purchaserfirstname",        default: '' },
        //             "lastName":         { id: "purchaserlastname",         default: '' },
        //             "phone":            { id: "purchaserphone",            default: '0000000' },
        //         },
        //         "technicalContactDetails": {
        //             "firstName":        { id: "technicalfirstname",        default: '' },
        //             "lastName":         { id: "technicallastname",         default: '' },
        //             "email":            { id: "technicalemail",            default: '' },
        //             "phone":            { id: "technicalphone",            default: '0000000' },
        //         },
        //         "technicalOrganisationDetails": {
        //             "xeroId":           { id: "xeroid",                    default: '' },
        //             "organisationName": { id: "technicalorganisationname", default: '' },
        //             "address1":         { id: "technicaladdress1",         default: '' },
        //             "address2":         { id: "technicaladdress2",         default: '' },
        //             "taxId":            { id: "technicaltaxid",            default: '' },
        //             "city":             { id: "technicalcity",             default: '' },
        //             "state":            { id: "technicalstate",            default: null },
        //             "country":          { id: "technicalcountry",          default: '' },
        //             "isoCountryCode":   { id: "technicalisocountrycode",   default: '' },
        //             "postcode":         { id: "technicalpostcode",         default: null },
        //         },
        //         "billingContactDetails": {
        //             "firstName":        { id: "billingfirstname",          default: '' },
        //             "lastName":         { id: "billinglastname",           default: '' },
        //             "email":            { id: "billingemail",              default: '' },
        //             "phone":            { id: "billingphone",              default: '0000000' },
        //         },
        //         "billingOrganisationDetails": {
        //             "country":           { id: "billingcountry",           default:'' },//default: 'United Kingdom' },
        //             "address1":          { id: "billingaddress1",          default:'' },//default: '25 Wilton Road' },
        //             "address2":          { id: "billingaddress2",          default:'' },//default: '' },
        //             "taxId":             { id: "billingtaxid",             default:'' },//default: 'GB 242 0200 75' },
        //             "isoCountryCode":    { id: "billingisocountrycode",    default:'' },//default: 'GB' },
        //             "state":             { id: "billingstate",             default:'' },//default: 'UK' },
        //             "city":              { id: "billingcity",              default:'' },//default: 'Victoria London' },
        //             "organisationName":  { id: "billingorganisationname",  default:'' },//default: 'Adaptavist UK Services Limited' },
        //             "postcode":          { id: "billingpostcode",          default:'' },//default: 'SW1V 1LW' },
        //         }
        //                                                                     // orgname: Adaptavist Sendirian Berhad
        //                                                                     // address 1: WeWork Mercu 2 Level 40 No. 3 Jalan Bangsar
        //                                                                     // city: KL ECO CITY
        //                                                                     // postcode: 59200
        //                                                                     // city: Kuala Lumpur
        //                                                                     // country: Malaysia
        //     },

        //     createItemRecord: {
        //         id: 'serviceitem',
        //         fields: {
        //             productName:            { id: 'itemid',                       type: 'value' },
        //             subsidiary:             { id: 'subsidiary',                   type: 'value', default: 3 },
        //             expenseaccount:         { id: 'expenseaccount',               type: 'value', default: 809 },
        //             incomeaccount:          { id: 'incomeaccount',                type: 'value', default: 516 },
        //             productId:              { id: 'custitem_adap_at_product_id',  type: 'value' },
        //             addonKey:               { id: 'custitem_st_addon_key',        type: 'value' },
        //             platform:               { id: 'custitem_st_hosting',          type: 'text' },
        //             taxschedule:            { id: 'taxschedule',                  type: 'value', default: 4 },
        //             includechildren:        { id: 'includechildren',              type: 'value', default: true },
        //             isDoneScripted:         { id: 'custitem_atl_item_integrated', type: 'value', default: true },
        //             directRevenuePosting:   { id :'directrevenueposting',         type: 'value', default: true },
        //         }
        //     },
        //     companyDefaultBillingToPayload:{
        //         organisationName: 'companyname',
        //         address1: 'addr1',
        //         city: 'city',
        //         isoCountryCode: 'country',
        //         country: 'country',
        //         postcode: 'zip',
        //         state: 'state'
        //     },
        //     EndUserAddressToPayload:{
        //         'technicalisocountrycode': 'technicalcountrycode',
        //         'billingcountry': 'country',
        //         'billingaddress1': 'address1',
        //         'billingaddress2': 'address2',
        //         'billingtaxid': 'taxid',
        //         'billingisocountrycode': 'country_code',
        //         'billingstate': 'state',
        //         'billingcity': 'city',
        //         'billingorganisationname': 'org_name',
        //         'billingpostcode': 'zip',
        //     },
        //     sql: {
        //         getTcContents:
        //             `SELECT custrecord_st_termsandconditions as tcoption
        //             FROM customrecord_st_termsandconditions
        //             WHERE id IN ({{tcoptions}})`,
        //         cartItems:
        //             `SELECT
        //                       cartitem.custrecord_adap_atl_product as item
        //                     ,  cart.custrecord_adap_at_cart_estimate as estimateId
        //                     ,  cart.custrecord_adap_at_qt_data_refresh_json as refreshJson
        //                     , cartitem.custrecord_adap_atl_avst_total AS amount
        //                     , cartitem.custrecord_adap_atl_tier AS tier
        //                     , cart.id AS cartId
        //                     , cartitem.id AS cartItemId
        //                     , custrecord_adap_atl_isaddedtoest AS isAdded
        //                     , custrecord_adap_atl_cart_item_order_id AS orderid
        //                     , cartitem.id AS cartInternalId
        //                     , cartitem.custrecord_adap_cart_item_desc AS description
        //                     , custrecord_adap_atl_item_discount_per AS discountPercent
        //                 FROM customrecord_adap_atlassian_cart cart
        //                 JOIN customrecord_adap_atlassian_cart_item cartitem
        //                     ON cart.id = cartitem.custrecord_adap_atl_cart_parent
        //                 WHERE
        //                     cart.custrecord_adap_at_cart_estimate = {{estid}} `,
        //         createdCartItems:
        //             `SELECT
        //                       cartitem.custrecord_adap_atl_product as item
        //                     , cartitem.custrecord_adap_atl_avst_total AS amount
        //                     , cartitem.custrecord_adap_atl_tier AS tier
        //                     , cart.id AS cartId
        //                     , cartitem.id AS cartItemId
        //                     , custrecord_adap_atl_isaddedtoest AS isAdded
        //                     , custrecord_adap_atl_cart_item_order_id AS orderid
        //                     , cartitem.id AS cartInternalId
        //                     , cartitem.custrecord_adap_cart_item_desc AS description
        //                     , item.custitem_adap_at_product_id AS productname
        //                     , custrecord_adap_atl_quote_product_id AS productid
        //                     , cart.created as datecreated
        //                 FROM customrecord_adap_atlassian_cart cart
        //                 JOIN customrecord_adap_atlassian_cart_item cartitem
        //                     ON cart.id = cartitem.custrecord_adap_atl_cart_parent
        //                     AND custrecord_adap_at_quote_status = 1
        //                     AND custrecord_adap_at_cart_uuid IS NOT NULL
        //                 JOIN item 
        //                     ON item.id = cartitem.custrecord_adap_atl_product
        //                 WHERE
        //                         cart.custrecord_adap_at_cart_estimate = {{estid}}
        //                     AND cart.id = {{cartId}}`,
        //         nsItems:
        //             `SELECT 
        //                 custitem_adap_at_product_id as productid, 
        //                 id, 
        //                 itemid, 
        //                 custitem_st_addon_key as addonkey,
        //                 REPLACE(UPPER(BUILTIN.DF(custitem_st_hosting)),' ', '') as hostkey
        //             FROM item 
        //             WHERE {{productIds}}
        //                 `,//AND custitem_st_hosting = 2
        //         getEstCarts:
        //             `SELECT custrecord_adap_at_cart_uuid,
        //                     id
        //                 FROM customrecord_adap_atlassian_cart cart
        //                 WHERE
        //                     custrecord_adap_at_cart_uuid IS NOT EMPTY
        //                 AND custrecord_adap_at_cart_estimate = {{estid}}
        //                 AND custrecord_adap_at_quote_status = 1`,
        //         getEstCartsGenerateQuoteMR:
        //             `SELECT 
        //                 id AS cartid,
        //                 custrecord_adap_at_cart_uuid as uuid,
        //                 custrecord_adap_atl_quote_pdf_link as pdflink
        //             FROM
        //                 customrecord_adap_atlassian_cart cart
        //             WHERE
        //                 custrecord_adap_at_cart_uuid IS NOT EMPTY
        //             AND custrecord_adap_at_cart_estimate = {{estid}}
        //             AND custrecord_adap_at_quote_status = 1`,
        //         getEstCartItemGenerateQuoteMR:
        //             `SELECT 
        //                 id AS cartitemid,
        //                 custrecord_adap_atl_quote_product_id AS productid,
        //                 custrecord_adap_atl_cart_parent AS cartid,
        //                 custrecord_adap_atl_tier as usertier,
        //                 custrecord_adap_atl_item_discount_per AS discountpercent,
        //                 custrecord_adap_atl_cart_item_order_id AS orderlineid,
        //                 custrecord_adap_atl_sen_number as sen
        //             FROM 
        //                 customrecord_adap_atlassian_cart_item cartitem
        //             WHERE
        //                 custrecord_adap_atl_cart_parent IN ({{carts}})`,
        //         getEstQuote:
        //             `SELECT custrecord_adap_at_cart_uuid, id
        //                 FROM customrecord_adap_atlassian_cart cart
        //                 WHERE
        //                 custrecord_adap_at_cart_estimate = {{estid}}
        //                 AND custrecord_adap_at_quote_status = 3`,
        //         isEstimateExist:
        //             `SELECT
        //                 id
        //                 FROM transaction estimate
        //                 WHERE recordType = 'estimate' 
        //                 AND estimate = {{estid}}`,
        //         getSenNumber:
        //             `SELECT 
        //                   custrecord_adap_atl_cart_item_order_id AS orederid
        //                 , custrecord_adap_atl_sen_number AS sennumber
        //                 , BUILTIN.DF(custrecord_adap_atl_license) AS licensetype
        //             FROM customrecord_adap_atlassian_cart_item 
        //             WHERE 
        //                 custrecord_adap_atl_cart_item_order_id IN ({{orderIds}})`,
        //         getLastState:
        //             `SELECT custbody_adap_atlassian_uuid AS uuid FROM transaction WHERE id = {{estid}}`,
        //         getRefreshQuote:
        //             `SELECT
        //                 cart.id
        //                 , cart.name
        //                 , cart.custrecord_adap_at_cart_uuid AS uuid
        //                 , cart.custrecord_adap_at_quote_data_json AS json
        //             FROM customrecord_adap_atlassian_cart cart
        //             WHERE
        //                 custrecord_adap_at_cart_estimate = {{estid}}
        //             AND custrecord_adap_at_quote_status = 3`,
        //         hasOpenOrder:
        //             `SELECT
        //                 cart.id
        //                 , cart.name
        //                 , cart.custrecord_adap_at_quote_data_json AS json
        //             FROM customrecord_adap_atlassian_cart cart
        //             WHERE
        //                 custrecord_adap_at_cart_estimate = {{estid}}
        //             AND custrecord_adap_at_quote_status = 1`,
        //         getCartItems:
        //             `SELECT 
        //                 custrecord_adap_atl_cart_item_order_id AS id,
        //                 custrecord_adap_atl_item_discount_per AS itemdiscountpercent
        //             FROM 
        //                 customrecord_adap_atlassian_cart_item cartitem
        //             LEFT JOIN 
        //                 customrecord_adap_atlassian_cart cart
        //                 ON cart.id = cartitem.custrecord_adap_atl_cart_parent
        //             WHERE cart.id = {{cartId}}`,
        //         toRefreshQuote:
        //             `SELECT
        //                    cart.id AS cartid
        //                 ,  cartitem.id as cartitemid
        //                 ,  cartitem.custrecord_adap_atl_quote_product_id as productitemid
        //                 ,  cartitem.custrecord_adap_cart_item_desc as productdescription
        //                 ,  cartitem.custrecord_adap_atl_sen_number as sen
        //                 ,  cart.custrecord_adap_at_quote_data_json as nsjson
        //                 ,  cart.custrecord_adap_at_qt_data_refresh_json AS atjson
        //                 ,  cartitem.custrecord_adap_atl_item_discount_per AS itemdiscountpercent
        //             FROM customrecord_adap_atlassian_cart cart
        //             FULL JOIN customrecord_adap_atlassian_cart_item cartitem
        //                 ON cart.id = cartitem.custrecord_adap_atl_cart_parent
        //             WHERE
        //                 cart.custrecord_adap_at_cart_estimate = {{estid}}
        //             AND cart.custrecord_adap_at_isquote_updated = 'F'
        //             AND cart.custrecord_adap_at_qt_data_refresh_json IS NOT NULL`,
        //         getNSItemsBaseOnProductId:
        //             `SELECT id, custitem_adap_at_product_id AS productid FROM item WHERE custitem_adap_at_product_id IN ( {{productIds}} )`,
        //         // getNSItemsForRefresh:
        //         //     `SELECT id, custitem_adap_at_product_id AS productid,itemid FROM item WHERE custitem_adap_at_product_id IN ( {{productIds}} )
        //         //         OR itemid IN ({{productNames}})`,
        //         geNSCart:
        //             `SELECT * FROM customrecord_adap_atlassian_cart WHERE id = {{id}}`,
        //         getEstimate:
        //             `SELECT *,
        //                 custbody_adap_atl_mac_account AS mac 
        //             FROM transaction 
        //             WHERE id = {{id}}`,
        //         getEstimateCarts:
        //             'SELECT id FROM customrecord_adap_atlassian_cart where custrecord_adap_at_cart_estimate = {{id}}',
        //         getAtlCartItems:
        //             'SELECT id from customrecord_adap_atlassian_cart_item where custrecord_adap_atl_cart_parent= {{id}}',
        //         getAtlIntegrator:
        //             `SELECT *
        //             FROM customrecord_adap_integration_mapper 
        //             WHERE
        //                 custrecord_adap_integration_mapper_apiid = '{{apiid}}'
        //             AND custrecord_adap_integration_environment = {{env}}`,
        //         getEmailForInvoiceRecord:
        //             'SELECT * from message where transaction = {{id}}',
        //         redirectToExistingQuoteEstimate:
        //             `SELECT custrecord_adap_at_cart_estimate AS estimate FROM customrecord_adap_atlassian_cart WHERE name = '{{orderNumber}}'`,
        //         getMrStatus:
        //             `SELECT custbody_adap_atl_refresh_status AS status, type FROM transaction WHERE id = {{estid}}`,
        //         getBillingDetails: `
        //         SELECT
        //             country.id as technicalcountrycode,
        //             integrator.custrecord_adap_integration_country AS country,
        //             integrator.custrecord_adap_integration_address1 AS address1,
        //             integrator.custrecord_adap_integration_address2 AS address2,
        //             integrator.custrecord_adap_integration_taxid AS taxid,
        //             integrator.custrecord_adap_integration_country_code AS country_code,
        //             integrator.custrecord_adap_integration_state AS state,
        //             integrator.custrecord_adap_integration_city AS city,
        //             integrator.custrecord_adap_integration_org_name AS org_name,
        //             integrator.custrecord_adap_integration_zip AS zip,
        //             integrator.custrecord_adap_integration_auth_email AS auth_email
        //         FROM customrecord_adap_integration_mapper integrator
        //         FULL JOIN country
        //             ON country.uniqueKey = {{countryCode}}
        //         WHERE integrator.custrecord_adap_integration_mac = {{mac}}
        //             AND integrator.custrecord_adap_integration_mapper_apiid = 'adap_hamlet'`,
        //         getDefaultBilling:'SELECT \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(Customer.entityid) AS entityid, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customer.companyname) AS companyname, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr1) AS addr1, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.addr2) AS addr2, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.city) AS city, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING((customerAddressbook_SUB.country)) AS country, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(customerAddressbook_SUB.dropdownstate)) AS dropdownstate, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.state) AS state, \n' +
        //             '  BUILTIN_RESULT.TYPE_STRING(customerAddressbook_SUB.zip) AS zip\n' +
        //             'FROM \n' +
        //             '  Customer, \n' +
        //             '  (SELECT \n' +
        //             '    customerAddressbook.entity AS entity, \n' +
        //             '    customerAddressbook.entity AS entity_join, \n' +
        //             '    customerAddressbookEntityAddress.addr1 AS addr1, \n' +
        //             '    customerAddressbookEntityAddress.addr2 AS addr2, \n' +
        //             '    customerAddressbookEntityAddress.city AS city, \n' +
        //             '    customerAddressbookEntityAddress.country AS country, \n' +
        //             '    customerAddressbookEntityAddress.dropdownstate AS dropdownstate, \n' +
        //             '    customerAddressbookEntityAddress.state AS state, \n' +
        //             '    customerAddressbookEntityAddress.zip AS zip, \n' +
        //             '    customerAddressbook.defaultbilling AS defaultbilling_crit\n' +
        //             '  FROM \n' +
        //             '    customerAddressbook, \n' +
        //             '    customerAddressbookEntityAddress\n' +
        //             '  WHERE \n' +
        //             '    customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey(+)\n' +
        //             '  ) customerAddressbook_SUB\n' +
        //             'WHERE \n' +
        //             '  Customer.ID = customerAddressbook_SUB.entity(+)\n' +
        //             "   AND ((Customer.ID = '{{customerid}}' AND customerAddressbook_SUB.defaultbilling_crit = \'T\'))",
        //         getStateShortName:'SELECT\n' +
        //             '\tCountry.ID AS CountryID,\n' +
        //             '\tCountry.Name AS CountryName,\n' +
        //             '\tCountry.Edition,\n' +
        //             '\tCountry.Nationality,\n' +
        //             '\tState.ID AS StateID,\n' +
        //             '\tState.ShortName AS StateShortName,\n' +
        //             '\tState.FullName AS StateFullName\n' +
        //             'FROM\n' +
        //             '\tCountry\n' +
        //             '\tLEFT JOIN State ON\n' +
        //             '\t\t( State.Country = Country.ID )\n' +
        //             '\n' +
        //             'WHERE State.ID  = \'{{stateId}}\'\n' +
        //             '\n' +
        //             'ORDER BY\n' +
        //             '\tCountryName,\n' +
        //             '\tStateShortName',
        //         getTechnicalContactAddress:"SELECT \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(Contact.entityid) AS entityid, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(Contact.email) AS email, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addressee_0) AS addressee, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addrphone_0) AS addrphone, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addr1_0) AS addr1, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.addr2_0) AS addr2, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.city_0) AS city, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.shortname_0) AS shortname, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(ContactAddressbook_SUB.zip_0) AS zip, \n" +
        //             "  BUILTIN_RESULT.TYPE_STRING(BUILTIN.DF(ContactAddressbook_SUB.country_0)) AS country\n" +
        //             "FROM \n" +
        //             "  Contact, \n" +
        //             "  (SELECT \n" +
        //             "    ContactAddressbook.entity AS entity, \n" +
        //             "    ContactAddressbook.entity AS entity_join, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.addressee AS addressee_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.addrphone AS addrphone_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.addr1 AS addr1_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.addr2 AS addr2_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.city AS city_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.shortname AS shortname_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.zip AS zip_0, \n" +
        //             "    ContactAddressbookEntityAddress_SUB.country AS country_0, \n" +
        //             "    ContactAddressbook.defaultbilling AS defaultbilling_crit\n" +
        //             "  FROM \n" +
        //             "    ContactAddressbook, \n" +
        //             "    (SELECT \n" +
        //             "      ContactAddressbookEntityAddress.nkey AS nkey, \n" +
        //             "      ContactAddressbookEntityAddress.nkey AS nkey_join, \n" +
        //             "      ContactAddressbookEntityAddress.addressee AS addressee, \n" +
        //             "      ContactAddressbookEntityAddress.addrphone AS addrphone, \n" +
        //             "      ContactAddressbookEntityAddress.addr1 AS addr1, \n" +
        //             "      ContactAddressbookEntityAddress.addr2 AS addr2, \n" +
        //             "      ContactAddressbookEntityAddress.city AS city, \n" +
        //             "      state.shortname AS shortname, \n" +
        //             "      ContactAddressbookEntityAddress.zip AS zip, \n" +
        //             "      ContactAddressbookEntityAddress.country AS country\n" +
        //             "    FROM \n" +
        //             "      ContactAddressbookEntityAddress, \n" +
        //             "      state\n" +
        //             "    WHERE \n" +
        //             "      ContactAddressbookEntityAddress.dropdownstate = state.shortname(+)\n" +
        //             "       AND ContactAddressbookEntityAddress.country = state.country(+)\n" +
        //             "    ) ContactAddressbookEntityAddress_SUB\n" +
        //             "  WHERE \n" +
        //             "    ContactAddressbook.addressbookaddress = ContactAddressbookEntityAddress_SUB.nkey(+)\n" +
        //             "  ) ContactAddressbook_SUB\n" +
        //             "WHERE \n" +
        //             "  Contact.ID = ContactAddressbook_SUB.entity(+)\n" +
        //             "   AND ((Contact.entityid= '{{name}}' AND Contact.email ='{{email}}' AND ContactAddressbook_SUB.defaultbilling_crit = 'T'))",
        //         getTechContactIfExisting: 'SELECT id\n' +
        //             'FROM contact\n' +
        //             'WHERE firstname = \'{{firstname}}\'\n' +
        //             'AND lastname = \'{{lastname}}\'',
        //         getDiscountRules:
        //             `SELECT 
        //                 id, 
        //                 name, 
        //                 custrecord_adap_atl_disc_is_customer AS passed_to_customer, 
        //                 custrecord_adap_atl_disc_reason AS reason, 
        //                 custrecord_adap_atl_disc_type AS type, 
        //                 custrecord_adap_atl_disc_is_adaptavist AS avstdiscount, 
        //                 custrecord_adap_atl_disc_price_adj AS price_adjustment 
        //             FROM 
        //                 customrecord_adap_alt_discount`
        //     },
        //     saveSearch: {
        //         addCartDetails: {
        //             columns: [
        //                 { name: "email",        join: "salesRep",      label: "purchaseremail",     type:'value'},
        //                 { name: "firstname",    join: "salesRep",      label: "purchaserfirstname", type:'value'},
        //                 { name: "lastname",     join: "salesRep",      label: "purchaserlastname",  type:'value'},
        //                 { name: "phone",        join: "salesRep",      label: "purchaserphone",     type:'value'},

        //                 { name: "firstname",    join: "salesRep",      label: "billingfirstname",   type:'value'},
        //                 { name: "lastname",     join: "salesRep",      label: "billinglastname",    type:'value'},
        //                 { name: "email",        join: "salesRep",      label: "billingemail",       type:'value'},
        //                 { name: "phone",        join: "salesRep",      label: "billingphone",       type:'value'},

        //                 // { name: "email",        join: "customerMain",  label: "technicalemail",     type:'value'},
        //                 { name: "custbody_atl_tech_contact_email",        label: "technicalemail",     type:'value'},
        //                 // { name: "phone",        join: "customerMain",  label: "technicalphone",     type:'value'},
        //                 { name: "vatregnumber", join: "customerMain",  label: "technicaltaxid",     type:'value'},

        //                 { name: "custbody_adap_enduser_phone",                          label: "technicalphone",             type:'value'  },
        //                 { name: "custbody_adap_enduser_name",                           label: "technicalorganisationname",  type:'value'  },
        //                 { name: "custbodyadap_enduser_address1",                        label: "technicaladdress1",          type:'value'  },
        //                 { name: "custbody_enduser_address2",                            label: "technicaladdress2",          type:'value'  },
        //                 { name: "custbody_adap_enduser_city",                           label: "technicalcity",              type:'value'  },
        //                 { name: "custbody_adap_enduser_country",                        label: "technicalcountry",           type:'text'   },
        //                 { name: "custbody_adap_enduser_country",                        label: "technicalcountryinternalid", type:'value'  },
        //                 { name: "custbody_adap_enduser_state",                          label: "technicalstate",             type:'value'  },
        //                 // { name: "custbody_adap_enduser_country",  join: "country",      label: "technicalisocountrycode" ,   type:'text'   },
        //                 { name: "custbody_adap_enduser_zip",                            label: "technicalpostcode",          type:'value'  },
        //                 { name: "vatregnumber",                   join: "customerMain", label: "technicaltaxid",             type:'value'  },

        //             ]
        //         },
        //         addCartDetailsContacts: {
        //             columns: [
        //                 { name: "firstname", label: "technicalfirstname" },
        //                 { name: "lastname",  label: "technicallastname"  },
        //             ]
        //         },
        //         isInvoiceExist: {
        //             columns: [
        //                 { name: "createdfrom", join: "", label: "createdfrom" },
        //                 { name: "internalid", join: "", label: "internalid" },
        //                 { name: "type", join: "", label: "type" },
        //             ]
        //         },
        //         getMRScript: {
        //             columns: [
        //                 { name: "scriptid", join: "script", label: "scriptid" },
        //             ]
        //         }
        //     },
        //     error: {
        //         noItem: {
        //             title: "Unable to retrieve item.",
        //             message: "We couldn't find any record of the item in the system. Kindly reach out to the administrators for further assistance."
        //         }
        //     },
        //     estimateAtlassianCartUpdateFields: {
        //         cart: 'custcol_adap_atlassian_cart_holder',
        //         cartItem: 'custcol_adap_atl_cart_item'
        //     },
        //     validateNotifMessage:{
        //         refreshQuoteBtn: {
        //             title: 'Atlassian Cart Not Synced',
        //             message: 'Attention: Estimate is not synced from Atlassian Cart. Click "Refresh Quote"  To sync records.',
        //             type: 2,
        //             button: 'custpage_refresh_quote',
        //             buttonHidden: false
        //         },
        //         generateQuoteBtn:{
        //             title: 'Missing Technical Contact',
        //             message: 'Attention: Please Attach a  Contact under "Technical Contacts" Tab to Enable Quote Generation',
        //             type: 2,
        //             button: 'custpage_atlassian_generate_quote',
        //             buttonHidden: true
        //         },
        //         mapReduceMessage:{
        //             refresh:{
        //                 title: 'Refresh Atlassian Quote is in progress',
        //                 message: 'Thank you for your patience! The Atlassian quote is currently being refreshed. <br>  Please manually refresh the page.', //The page will refresh once the Refresh Quote is done
        //             },
        //             generateQuote:{
        //                 title: 'Quote Generation is in progress',
        //                 message: 'Thank you for your patience! The Atlassian quote is currently being generated. <br>  Please manually refresh the page.', //The page will refresh once the Generate Quote is done
        //             },
        //             doneGenerateQuote:{
        //                 title:'Atlassian Generation Quote',
        //                 message:'Atlassian Generation Quote process has been completed.'//The page will refresh within 5 seconds
        //             },
        //             doneRefreshQuote:{
        //                 title:'Refresh Atlassian Quote',
        //                 message:'Atlassian refresh process has been completed.'//The page will refresh within 5 seconds
        //             },
        //             failedGenerateQuote:{
        //                 title:'Failed to Generate Quote',
        //                 message:'Atlassian Generation Quote process has Failed,<br> Please consult with Administrator.'
        //             },
        //             failedRefreshQuote:{
        //                 title:'Failed to Refresh Quote',
        //                 message:'Atlassian refresh process has Failed,<br> Please consult with Administrator.'
        //             },
        //             genericEstimate:{
        //                 title:'Atlassian Quote Busy',
        //                 message: 'Thank you for your patience! The Atlassian quote is currently being processed. <br>Please wait a moment for the updated content, or manually refresh the page if needed.'
        //             },
        //             doneGenericEstimate:{
        //                 title:'Atlassian Quote',
        //                 message: 'Thank you for your patience! The Atlassian quote has been successfully generated or refreshed.'
        //             },
        //             failedGenericEstimate:{
        //                 title:'Atlassian Quote Failed',
        //                 message: 'We apologize for the inconvenience. The Atlassian quote could not be generated or refreshed due to a technical issue. <br>Please try again later or contact support for assistance.'
        //             }
        //         },
        //         atlassianCart: {
        //             message:'Save As Draft failed to process, Please consult with Administrator',
        //         }
        //     }
        // }
        return MAPPER
    });