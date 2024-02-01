/**
 * @NApiVersion 2.1
 */
define(['N/util', 'N/file'], (util, file) => {

    const mockModule = {};


    mockModule.mockerControllerAPI = (options) => {
        try {
            log.debug('mockerControllerAPI', options)
            switch (options.path) {
                case "/cart/new":
                    return createCart(options);
                    break;
                case "/cart/add":
                    return addToCart(options);
                    break;
                case "/cart/get/":
                    return getCart(options);
                    break;
                case "/cart/toorder/":
                    return mockModule.dataList.toOrder
                    break;
                case "/cart/addrenewalitem":
                    return addRenewalToCart(options);
                    break;
                case "/cart/addupgradeitem":
                    return addUpgradeToCrt(options);
                    break;
                case "/cart/getrenewaloptions":
                    return mockModule.dataList.getRenewOption;
                    break;
                case "/cart/getupgradeoptions":
                    return mockModule.dataList.getUpgradeOption;
                    break;
                case "/cart/remove":
                    return removeToCart(options);
                    break;
                case "/addons":
                    return mockModule.dataList.searchAddon;
                    break;
                case "/products/search":
                    return mockModule.dataList.searchProduct;
                    break;
                case "/quote/get/":
                    return getQuote(options);
                    break;
                case "/cart/details":
                    // return mockModule.dataList.details;
                    break;
            }
        } catch (e) {
            log.debug('error : mockerControllerAPI', e);
        }

    }

    mockModule.dataList = {
        "create": {
            "uuid": "STRONG_UUID-2b34af00-1533-440c-9340-ca84a9520e43",
            "quoteNumber": null,
            "serialNumber": 0,
            "status": "OPEN",
            "purchaserContactDetails": {
                "firstName": "atlassian-licenses-test+QB",
                "lastName": "QB",
                "email": "atlassian-licenses-test+qb@servicerocket.com",
                "phone": null
            },
            "technicalContactDetails": {
                "firstName": null,
                "lastName": null,
                "email": null,
                "phone": null
            },
            "technicalOrganisationDetails": {
                "address1": null,
                "address2": null,
                "city": null,
                "state": null,
                "postcode": null,
                "taxId": null,
                "taasAddressValidationErrorCode": null,
                "taasAddressValidationErrorReason": null,
                "taxExemptions": [],
                "organisationName": null,
                "isoCountryCode": null,
                "country": null,
                "vatResponsible": null
            },
            "billingContactDetails": {
                "firstName": null,
                "lastName": null,
                "email": null,
                "phone": null
            },
            "billingOrganisationDetails": {
                "address1": null,
                "address2": null,
                "city": null,
                "state": null,
                "postcode": null,
                "taxId": null,
                "taasAddressValidationErrorCode": null,
                "taasAddressValidationErrorReason": null,
                "taxExemptions": [],
                "organisationName": null,
                "isoCountryCode": null,
                "country": null,
                "vatResponsible": null
            },
            "currency": "USD",
            "totalIncTax": 0,
            "totalTax": 0,
            "adminFeeAmount": 0,
            "appliedTaxRate": 0,
            "purchaseOrderNumber": null,
            "additionalNotes": null,
            "promotionalCode": null,
            "marketplacePromotion": null,
            "expertOrder": false,
            "resellerOrder": false,
            "creditCardOnly": true,
            "created": "2023-05-31T06:19:11.111-0500",
            "updated": "2023-05-31T06:19:11.132-0500",
            "expiry": null,
            "inEditMode": false,
            "isPayOnTermsEligible": false,
            "hasCoTermRequest": false,
            "isCoTermRequestSatisfied": false,
            "hasTaxExemptRequest": false,
            "showEnterpriseSupportAgreement": false,
            "showTrainingAgreement": false,
            "showSoftwareAgreement": false,
            "showCloudAgreement": false,
            "showMarketplaceAgreement": false,
            "totalProratedPrice": null,
            "adjustmentAmounts": null,
            "savedAmount": null,
            "savedAmountPercent": null,
            "is3DSQuote": false,
            "items": [],
            "account_id": "UK"
        },
        "get": "",
        "details": {
            fieldErrors: {
                "technicalContactDetails.email": "Invalid email",
                "billingContactDetails.lastName": "Missing last name",
                "technicalOrganisationDetails.city": "Missing city",
                "technicalOrganisationDetails.organisationName": "Missing organisation name",
                "billingOrganisationDetails.address1": "Missing address",
                "technicalOrganisationDetails.address1": "Missing address",
                "billingContactDetails.firstName": "Missing first name",
                "purchaserContactDetails.email": "This email address must match the authenticated user",
                "technicalContactDetails.phone": "Missing phone number",
                "technicalOrganisationDetails.isoCountryCode": "Missing country",
                "technicalContactDetails.firstName": "Missing first name",
                "technicalContactDetails.lastName": "Missing last name"
            },
            i18nFieldErrors: [
                {
                    field: "purchaserContactDetails.email",
                    errorKey: "This email address must match the authenticated user"
                },
                {
                    field: "technicalContactDetails.firstName",
                    errorKey: "Missing first name"
                },
                {
                    field: "technicalContactDetails.lastName",
                    errorKey: "Missing last name"
                },
                {
                    field: "technicalContactDetails.email",
                    errorKey: "Missing email"
                },
                {
                    field: "technicalContactDetails.email",
                    errorKey: "Invalid email"
                },
                {
                    field: "technicalContactDetails.phone",
                    errorKey: "Missing phone number"
                },
                {
                    field: "technicalOrganisationDetails.address1",
                    errorKey: "Missing address"
                },
                {
                    field: "technicalOrganisationDetails.city",
                    errorKey: "Missing city"
                },
                {
                    field: "technicalOrganisationDetails.isoCountryCode",
                    errorKey: "Missing country"
                },
                {
                    field: "technicalOrganisationDetails.organisationName",
                    errorKey: "Missing organisation name"
                },
                {
                    field: "billingContactDetails.firstName",
                    errorKey: "Missing first name"
                },
                {
                    field: "billingContactDetails.lastName",
                    errorKey: "Missing last name"
                },
                {
                    field: "billingOrganisationDetails.address1",
                    errorKey: "Missing address"
                }
            ],
            uuid: "f2587dde-709e-4118-8865-aed73ebf0d55",
            httpcode: 500
        },
        "toOrder": {
            "orderId": "AT-247918166",
            "links": {
                "quoteLink": "https://my.atlassian.com/billing/pdfrest?id=247918166&hash=e205fc71fabb0baf59fd2545920152b8272b2cf891044505173b8b6f653160b1",
                "paymentLink": "https://my.atlassian.com/purchase/confirmpayment?orderId=247918166&currency=usd&confirm=614%2C050.80"
            }
        },
        "getRenewOption": {
            "accountId": 36159152,
            "accountName": "Blue Origin, LLC",
            "startDate": "2021-11-03T00:00:00.000-0500",
            "expireDate": "2023-11-03T00:00:00.000-0500",
            "productKey": "com.k15t.scroll.scroll-viewport.data-center",
            "productType": "BTF_SUBSCRIPTION",
            "productDescription": "Scroll Viewport for Confluence Data Center",
            "productParentKey": null,
            "enterprise": false,
            "marketplaceAddon": false,
            "editionDescription": "2000 Users",
            "licenseType": "COMMERCIAL",
            "unitLabel": "USER",
            "monthsValid": 12,
            "unitCount": 500,
            "evaluation": false,
            "billingType": "SUBSCRIPTION",
            "renewalAction": "NONE",
            "changeOptions": [
                {
                    "accountId": 36159152,
                    "createdTimestamp": "2023-06-06T09:23:14.795-0500",
                    "orderableItemId": "newPricingPlanItem:com.k15t.scroll.scroll-viewport.data-center:user-tier:500:COMMERCIAL",
                    "productKey": "confluence-data-center",
                    "featureKey": "user-tier",
                    "unitCount": 500,
                    "maintenanceMonths": 12,
                    "currency": "USD",
                    "amount": 84000,
                    "expireDate": "2024-11-03T00:00:00.000-0500",
                    "verificationHash": "650b999deff8da356df4f870b91083529af7dcb038bb822426d029298e467512",
                    "productDescription": "Scroll Viewport for Confluence (Data Center)",
                    "licenseType": "COMMERCIAL",
                    "unitLabel": "USER",
                    "renewalOverride": null,
                    "editionDescription": "500 Users",
                    "enterprise": false,
                    "marketplaceAddon": false,
                    "adjustments": [],
                    "originalAmount": 84000
                }, {
                    "accountId": 36159152,
                    "createdTimestamp": "2023-06-06T09:23:14.795-0500",
                    "orderableItemId": "newPricingPlanItem:com.k15t.scroll.scroll-viewport.data-center:user-tier:1000:COMMERCIAL",
                    "productKey": "confluence-data-center",
                    "featureKey": "user-tier",
                    "unitCount": 1000,
                    "maintenanceMonths": 24,
                    "currency": "USD",
                    "amount": 9000,
                    "expireDate": "2024-11-03T00:00:00.000-0500",
                    "verificationHash": "650b999deff8da356df4f870b91083529af7dcb038bb822426d029298e467512",
                    "productDescription": "Scroll Viewport for Confluence (Data Center)",
                    "licenseType": "COMMERCIAL",
                    "unitLabel": "USER",
                    "renewalOverride": null,
                    "editionDescription": "1000 Users",
                    "enterprise": false,
                    "marketplaceAddon": false,
                    "adjustments": [],
                    "originalAmount": 9000
                }
            ],
            "currentPricingPlanUUID": "d58d3bf2-f1ad-428c-b3ab-ead82cb10e6d",
            "ineligibilityReason": null,
            "isStarter": false,
            "serverRenewalPrice": 0,
            "accountCurrency": "USD"
        },
        "getUpgradeOption": [
            {
                "title": "Bitbucket (Data Center)",
                "type": "Server",
                "changeOptions": [
                    [
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.541-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:3000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 3000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 17260.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "f27058a5905c7f681b0b34cba5362afd5db9c79e05987b0512b19177bb5c290e",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "3000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 51781
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.550-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:3000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 3000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 17260.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "5fb21733c6dfc224108b4b738feeb3ec2cafe370f8c158bfabb8ef7e35ae3625",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "3000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 51781
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.558-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:4000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 4000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 34521.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "a9c2cf4b0859ba83f8fa2a90c6e2f75e7c96fd3abf3079fa0409da8701eb238c",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "4000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 69042
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.566-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:4000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 4000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 34521.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "8a2a3631d445812cf35d59aafc41d4abde766588c352fb5b61af69bd3d491adb",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "4000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 69042
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.576-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:5000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 5000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 51781.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "d9bd6db057458cd0ae87106de4533868182dfec84095eb5a582b7a19f764b44e",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "5000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 86302
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.586-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:5000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 5000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 51781.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "c56a2ca52f37248ad03fd8eb00fd4774e4248f4efd36ea526758a86bccd8e00f",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "5000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 86302
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.595-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:10000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 10000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 60000.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "9a6c4f062932f4bdc59555f850a045dcb1980d591a3f0cb60ba6d05aa054d086",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "10000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 94521
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.602-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:10000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 10000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 60000.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "ec633fb0ebc87adbee4df4faa18ae5c127a0b0df1e2ce05dab22f22e51a12aa2",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "10000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 94521
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.611-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:15000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 15000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 68219.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "97dc01b5fcbef376ef9d41c568c9788fab63636c980142dfb3b23c791aa1c83c",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "15000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 102740
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.620-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:15000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 15000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 68219.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "8a4eb8ab599f5869f9083a7b61366436e58ba8478754ddcc5901ca29ba8e841f",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "15000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 102740
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.631-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:20000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 20000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 76438.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "030d25b0a16c1aadd14eafc9ad52bbef715fc66ae6b83570234a10c33fa1f745",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "20000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 110959
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.641-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:20000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 20000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 76438.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "150ca9253cec4f4427a1771101e78023329c4bc2f164c886fdfb6f446ab600a5",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "20000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 110959
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.649-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:25000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 25000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 84658.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "eb71decc647843af308621df231c93d2388f8da6bcbf5cdb9030cb45030f8857",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "25000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 119179
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.657-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:25000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 25000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 84658.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "488062ab2437f660ee9996c169fab3ff3361392727124e4f585c6a515da955e0",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "25000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 119179
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.666-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:30000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 30000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 92877.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "6e23ee85880215716380485766e62db23a425beecb7f54b2fecdbc3b58aeb08b",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "30000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 127398
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.676-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:30000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 30000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 92877.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "b888932ce339e032f4759deb8f60a493fb151872ff490e0974712b00a22ed2d0",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "30000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 127398
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.683-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:35000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 35000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 101096.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "a4961cfee4b42768874a3c8129a1c05ab4aa22fa6ada205b9ebf2b47f8873266",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "35000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 135617
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.691-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:35000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 35000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 101096.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "1b98b39099886c2f8c2051b3a4507b2a581eaa5e11b6bb2a0ef8561765a22ddb",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "35000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 135617
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.700-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:40000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 40000,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 109315.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "6feb53929fd34fb549d615359fdc07cca21049e350b0c8e52f47433923dd8d4a",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "40000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 143836
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.709-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:40000:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 40000,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 109315.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "98f58cb089648102f3c419744a925b17f2c9c49ae0b5bea48cd3c256073bbedb",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "40000 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 143836
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.717-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:987654321:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": -1,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 117534.45,
                            "expireDate": "2024-06-06T00:00:00.000-0500",
                            "verificationHash": "f8a614f1513a7f74f1c4afba7d49a9bba783d7fa230f21ae61e0755731ae5ca6",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "Unlimited Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 152055
                        },
                        {
                            "accountId": 36159152,
                            "createdTimestamp": "2023-06-06T09:23:48.725-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:987654321:COMMERCIAL",
                            "productKey": "confluence-data-center",
                            "featureKey": "user-tier",
                            "unitCount": -1,
                            "maintenanceMonths": 24,
                            "currency": "USD",
                            "amount": 117534.45,
                            "expireDate": "2025-06-06T00:00:00.000-0500",
                            "verificationHash": "5c2b6937409f6cfb5215e8e60e953e4ed798808ca2ff4bbf96eb774a0c301aaa",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "Unlimited Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 34520.55,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 152055
                        }
                    ]
                ]
            },
            {
                "title": "Bitbucket (Data Center)",
                "type": "Server",
                "changeOptions": [
                    [
                        {
                            "accountId": 11685751,
                            "createdTimestamp": "2023-07-04T10:48:07.506-0500",
                            "orderableItemId": "newPricingPlanItem:pricingplan.stash-data-center:user-tier:250:COMMERCIAL",
                            "productKey": "stash-data-center",
                            "featureKey": "user-tier",
                            "unitCount": 250,
                            "maintenanceMonths": 12,
                            "currency": "USD",
                            "amount": 5955.93,
                            "expireDate": "2024-07-04T00:00:00.000-0500",
                            "verificationHash": "f4f9c6cbda54fe024004f8e4aa5ba8d3eecd6f6190680b35e46c482e72b57258",
                            "productDescription": "Bitbucket (Data Center)",
                            "licenseType": "COMMERCIAL",
                            "unitLabel": "USER",
                            "renewalOverride": null,
                            "editionDescription": "250 Users",
                            "enterprise": false,
                            "marketplaceAddon": false,
                            "adjustments": [
                                {
                                    "amount": 5955.07,
                                    "description": "Upgrade Credit",
                                    "percentage": null
                                }
                            ],
                            "originalAmount": 11911
                        }
                    ]
                ]
            }
        ],
        "searchAddon": {
            "_links": {
                "self": {
                    "href": "/rest/2/addons?cost=orderable&hosting=datacenter&text=script+runner"
                },
                "alternate": {
                    "href": "/search?hosting=dataCenter&query=script+runner",
                    "type": "text/html"
                },
                "query": {
                    "href": "/rest/2/addons{?application,applicationBuild,category*,cloudFortifiedStatus*,cost,filter,forThisUser,hosting*,includeHidden,includePrivate,marketingLabel*,text,withVersion,withPricingInfo,storesPersonalData,offset,limit}",
                    "templated": true
                },
                "byKey": {
                    "href": "/rest/2/addons/{addonKey}",
                    "templated": true
                },
                "banners": {
                    "href": "/rest/2/addons/listings/banners{?application,applicationBuild,category*,cloudFortifiedStatus*,cost,filter,forThisUser,hosting*,includeHidden,includePrivate,marketingLabel*,text,withVersion,withPricingInfo,storesPersonalData,offset,limit}",
                    "templated": true
                },
                "next": [
                    {
                        "href": "/rest/2/addons?cost=orderable&hosting=datacenter&text=script+runner&offset=10",
                        "type": "application/json"
                    },
                    {
                        "href": "/search?hosting=dataCenter&query=script+runner&offset=10",
                        "type": "text/html"
                    }
                ]
            },
            "_embedded": {
                "addons": [
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.onresolve.jira.groovy.groovyrunner"
                            },
                            "alternate": {
                                "href": "/apps/6820/scriptrunner-for-jira?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/13"
                                },
                                {
                                    "href": "/rest/2/addonCategories/5"
                                },
                                {
                                    "href": "/rest/2/addonCategories/11"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.onresolve.jira.groovy.groovyrunner/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/73ebab0a-b3e9-4697-9322-9539f5c27965"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.onresolve.jira.groovy.groovyrunner/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/6820/scriptrunner-for-jira?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/81"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.onresolve.jira.groovy.groovyrunner/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/5"
                                        }
                                    },
                                    "name": "IT & helpdesk"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/11"
                                        }
                                    },
                                    "name": "Workflow"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/13"
                                        }
                                    },
                                    "name": "Custom fields"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 896493,
                                "totalInstalls": 35238,
                                "totalUsers": 22451374
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/73ebab0a-b3e9-4697-9322-9539f5c27965"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/ee3f143e-f00d-42df-a287-f60c0bfaeb48",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/73ebab0a-b3e9-4697-9322-9539f5c27965",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/73ebab0a-b3e9-4697-9322-9539f5c27965",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/014ec874-9296-402b-b05e-3a757db9e1a0",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/0116fec2-5a28-41cf-b1d8-3170412bbfec",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.7341771125793457,
                                "count": 711
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/81"
                                    },
                                    "alternate": {
                                        "href": "/vendors/81/adaptavist",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/ab1db985-8f46-461e-a646-d59b35f0e064",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/30c8afac-c128-47da-b711-091cd9d9004c",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/4dc0396e-b71d-400d-8cac-aa7446cdaf7f",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/be3d0409-b790-4d19-bc21-225f0813d61b",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "Adaptavist",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-14T17:14:45.319Z"
                        },
                        "id": "6820",
                        "name": "ScriptRunner for Jira",
                        "key": "com.onresolve.jira.groovy.groovyrunner",
                        "tagLine": "The Leading Automation and Customization App: Automate Workflows & Issues, Extend Jira and Improve UX with Groovy Scripts and JQL",
                        "summary": "ScriptRunner is the the top scripting, automation and customization app: Automate workflows, build custom fields and integrations with Groovy scripts and enhanced JQL. Execute admin and workflow functions without having to write a complete add-on.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.onresolve.confluence.groovy.groovyrunner"
                            },
                            "alternate": {
                                "href": "/apps/1215215/scriptrunner-for-confluence?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/32"
                                },
                                {
                                    "href": "/rest/2/addonCategories/40"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.onresolve.confluence.groovy.groovyrunner/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/45d8c52c-cadf-4e57-b9c7-bdfc7039b398"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.onresolve.confluence.groovy.groovyrunner/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1215215/scriptrunner-for-confluence?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/81"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.onresolve.confluence.groovy.groovyrunner/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/32"
                                        }
                                    },
                                    "name": "Documentation"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/40"
                                        }
                                    },
                                    "name": "Macros"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 127934,
                                "totalInstalls": 5042,
                                "totalUsers": 8923922
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/45d8c52c-cadf-4e57-b9c7-bdfc7039b398"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/fb42a647-dd75-492c-8415-4e23160df9e1",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/45d8c52c-cadf-4e57-b9c7-bdfc7039b398",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/45d8c52c-cadf-4e57-b9c7-bdfc7039b398",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/50899ac3-a0c9-4a3e-88f3-ae63baa6da9b",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/1cf1bf31-f239-40e8-a46e-95906dad029d",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.9361701011657715,
                                "count": 47
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/81"
                                    },
                                    "alternate": {
                                        "href": "/vendors/81/adaptavist",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/ab1db985-8f46-461e-a646-d59b35f0e064",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/30c8afac-c128-47da-b711-091cd9d9004c",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/4dc0396e-b71d-400d-8cac-aa7446cdaf7f",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/be3d0409-b790-4d19-bc21-225f0813d61b",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "Adaptavist",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-14T17:15:10.994Z"
                        },
                        "id": "1215215",
                        "name": "ScriptRunner for Confluence",
                        "key": "com.onresolve.confluence.groovy.groovyrunner",
                        "tagLine": "Automate, customise and bulk-manage Confluence. Create triggered actions, clean-up content and help users self-serve",
                        "summary": "Automate, customise and bulk-manage Confluence. Set up triggered actions, bulk manage labels, copy page trees or spaces, modify the Confluence UI or run your own script. Our code and no-code features will save you hours of time.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.onresolve.stash.groovy.groovyrunner"
                            },
                            "alternate": {
                                "href": "/apps/1213250/scriptrunner-for-bitbucket?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/59"
                                },
                                {
                                    "href": "/rest/2/addonCategories/48"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                },
                                {
                                    "href": "/rest/2/addonCategories/11"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.onresolve.stash.groovy.groovyrunner/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/b44bcd0a-9551-4074-8bf8-aa25465a38cb"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.onresolve.stash.groovy.groovyrunner/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1213250/scriptrunner-for-bitbucket?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/81"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.onresolve.stash.groovy.groovyrunner/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/11"
                                        }
                                    },
                                    "name": "Workflow"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/48"
                                        }
                                    },
                                    "name": "Repository hooks"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/59"
                                        }
                                    },
                                    "name": "Code review"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 34191,
                                "totalInstalls": 882,
                                "totalUsers": 498650
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/b44bcd0a-9551-4074-8bf8-aa25465a38cb"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/a7bf7767-c41f-410b-96fb-fef4b203e055",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/b44bcd0a-9551-4074-8bf8-aa25465a38cb",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/b44bcd0a-9551-4074-8bf8-aa25465a38cb",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/6a558688-298c-48bd-abc0-dd11b448b8aa",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/785de522-7810-489b-84f7-d97336fadb91",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.409090995788574,
                                "count": 22
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/81"
                                    },
                                    "alternate": {
                                        "href": "/vendors/81/adaptavist",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/30c8afac-c128-47da-b711-091cd9d9004c"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/ab1db985-8f46-461e-a646-d59b35f0e064",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/30c8afac-c128-47da-b711-091cd9d9004c",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/4dc0396e-b71d-400d-8cac-aa7446cdaf7f",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/be3d0409-b790-4d19-bc21-225f0813d61b",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "Adaptavist",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-14T17:15:29.955Z"
                        },
                        "id": "1213250",
                        "name": "ScriptRunner for Bitbucket",
                        "key": "com.onresolve.stash.groovy.groovyrunner",
                        "tagLine": "All-in-one admin app: automate DevOps workflows, customise merge checks and hooks, integrate with other tools",
                        "summary": "One app to rule them all: best practice enforcement, workflow automation, close integration with other DevOps tools, smart reporting and UI modifications. Run Groovy scripts for deep customisation and automation or save time with no-code features.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/sk.eea.jira.natural-searchers"
                            },
                            "alternate": {
                                "href": "/apps/1210967/natural-searchers-for-jira?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [],
                            "distribution": {
                                "href": "/rest/2/addons/sk.eea.jira.natural-searchers/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/447b520a-acaa-4c3a-ad3a-a435a34947e8"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/sk.eea.jira.natural-searchers/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1210967/natural-searchers-for-jira?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/22964"
                            },
                            "versions": {
                                "href": "/rest/2/addons/sk.eea.jira.natural-searchers/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 7407,
                                "totalInstalls": 528,
                                "totalUsers": 755873
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/447b520a-acaa-4c3a-ad3a-a435a34947e8"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/61361803-8380-4309-92c2-4fdf5e852b70",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/447b520a-acaa-4c3a-ad3a-a435a34947e8",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/2247a022-cfc4-4325-8aad-17205bdca8b6",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/96fb50a7-350c-4de8-b7ba-1fc9133c60ae",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/809f6bc1-52dc-4ea9-a16f-1c6e51db6179",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.625,
                                "count": 8
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/22964"
                                    },
                                    "alternate": {
                                        "href": "/vendors/22964/eea-part-of-biq-group",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/3a60659f-9840-4f4b-a686-571ace12d966"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/3a60659f-9840-4f4b-a686-571ace12d966"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/1ae71ad8-b157-4354-ab57-8c14881c1db0",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/3a60659f-9840-4f4b-a686-571ace12d966",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/2ec4b281-1d22-4b7c-b691-ea4dff5e9f4d",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/389c8730-2a5f-4e22-bfc4-51ec06be55e3",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/9720ab48-6230-40c3-b479-48d51b4d665f",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "EEA, part of BiQ Group",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-03-20T23:57:21.552Z"
                        },
                        "id": "1210967",
                        "name": "Natural Searchers for Jira",
                        "key": "sk.eea.jira.natural-searchers",
                        "tagLine": "Natural ordering and statistical values for text fields",
                        "summary": "Defines text searchers in natural order: free and exact.\r\n\r\nExact text searcher enables text field  in 2D statistics gadget.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.jibrok.jira.plugins.message-field"
                            },
                            "alternate": {
                                "href": "/apps/1219615/message-field?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/13"
                                },
                                {
                                    "href": "/rest/2/addonCategories/34"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.jibrok.jira.plugins.message-field/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/bb759b4d-b9c2-4311-a135-38a8b280173f"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.jibrok.jira.plugins.message-field/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1219615/message-field?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1216083"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.jibrok.jira.plugins.message-field/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/13"
                                        }
                                    },
                                    "name": "Custom fields"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/34"
                                        }
                                    },
                                    "name": "Messaging"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 7561,
                                "totalInstalls": 350,
                                "totalUsers": 433379
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/bb759b4d-b9c2-4311-a135-38a8b280173f"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/94ea3424-be6a-44bc-8644-ae697623dd47",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/bb759b4d-b9c2-4311-a135-38a8b280173f",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/bb759b4d-b9c2-4311-a135-38a8b280173f",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/d2ac4dfb-8707-4f20-964f-46aceebc474c",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/a803478e-1fdb-419c-ab64-5e6364e73499",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 4.0,
                                "count": 12
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1216083"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1216083/jibrok",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/bf774753-6e36-468f-a1e8-039d238d46b9"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/bf774753-6e36-468f-a1e8-039d238d46b9"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/f67bd038-52f9-4c8e-acd2-1bdc76191c6d",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/bf774753-6e36-468f-a1e8-039d238d46b9",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/bf774753-6e36-468f-a1e8-039d238d46b9",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/231401e0-4b21-413a-8a79-372eaa72c6b1",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/df1499d5-ef49-448a-afa7-d27d18168d10",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "JiBrok",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-07T07:31:45.293Z"
                        },
                        "id": "1219615",
                        "name": "Message field",
                        "key": "com.jibrok.jira.plugins.message-field",
                        "tagLine": "This field shows message banner on any issue screens. HTML, Display settings, Conditions, Dynamic messages, JavaScript and others",
                        "summary": "This app adds new type of custom field. It shows message as a banner/pop-up on any issue screen and Service Desk portal. HTML, Display settings, Conditions, Dynamic messages, JavaScript and more. App works with Refined for Jira, ScriptRunner, Assets",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.lifeincodes.issue-preview-for-jira"
                            },
                            "alternate": {
                                "href": "/apps/1220952/issue-preview-for-jira?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/5"
                                },
                                {
                                    "href": "/rest/2/addonCategories/55"
                                },
                                {
                                    "href": "/rest/2/addonCategories/7"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.lifeincodes.issue-preview-for-jira/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/e9b6e677-e5b4-4be6-ba67-a8e0974f6e59"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.lifeincodes.issue-preview-for-jira/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1220952/issue-preview-for-jira?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1216756"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.lifeincodes.issue-preview-for-jira/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/5"
                                        }
                                    },
                                    "name": "IT & helpdesk"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/7"
                                        }
                                    },
                                    "name": "Project management"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/55"
                                        }
                                    },
                                    "name": "Monitoring"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 708,
                                "totalInstalls": 29,
                                "totalUsers": 25833
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/e9b6e677-e5b4-4be6-ba67-a8e0974f6e59"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/18fa5803-5196-4250-b861-26f9ece0889a",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/e9b6e677-e5b4-4be6-ba67-a8e0974f6e59",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/e9b6e677-e5b4-4be6-ba67-a8e0974f6e59",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/780acabb-893f-4bb6-a9e1-4413164dae44",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/90145bb8-6d91-4b9e-9145-cad7ec1851a5",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.25,
                                "count": 4
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1216756"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1216756/life-in-codes",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/83521f36-57e8-4981-bb72-144a7a73b46f"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/83521f36-57e8-4981-bb72-144a7a73b46f"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/3da0cee6-00fb-4cc5-92d9-689a1c458fe0",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/83521f36-57e8-4981-bb72-144a7a73b46f",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/19c7cfe5-96ef-48af-82da-dea09cbdbfda",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/4561a6c4-dc0d-49e3-97b0-88be94eba185",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/aac83286-db73-475f-baba-3958c2eba001",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "Life in Codes",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-03T16:55:03.531Z"
                        },
                        "id": "1220952",
                        "name": "Issue Preview for Jira",
                        "key": "com.lifeincodes.issue-preview-for-jira",
                        "tagLine": "Get the information you need faster by simply hovering over the issue key",
                        "summary": "Find the information you need faster by simply hovering over the issue key. Fully customizable, Issue Preview for Jira will save you time and clicks, giving everyone the preview they need.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/com.riadalabs.jira.plugins.userdeactivator"
                            },
                            "alternate": {
                                "href": "/apps/1211109/user-management-license-user-deactivator-for-jira?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/5"
                                },
                                {
                                    "href": "/rest/2/addonCategories/4"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/com.riadalabs.jira.plugins.userdeactivator/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/e5d926fc-1066-4a4c-8b78-48621d139895"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/com.riadalabs.jira.plugins.userdeactivator/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1211109/user-management-license-user-deactivator-for-jira?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1210947"
                            },
                            "versions": {
                                "href": "/rest/2/addons/com.riadalabs.jira.plugins.userdeactivator/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/4"
                                        }
                                    },
                                    "name": "Integrations"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/5"
                                        }
                                    },
                                    "name": "IT & helpdesk"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 11277,
                                "totalInstalls": 277,
                                "totalUsers": 295215
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/e5d926fc-1066-4a4c-8b78-48621d139895"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/8efcda54-51db-409a-8b8d-b105c4ab3d2d",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/e5d926fc-1066-4a4c-8b78-48621d139895",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/c1075138-0430-46b0-ba55-46afe056924c",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/8f20c2a9-fa40-4b6d-b917-7b1330958067",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/e926d50a-ec6d-4002-8bb9-e92ca72f4d32",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 3.3333332538604736,
                                "count": 6
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1210947"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1210947/resolution-reichert-network-solutions-gmbh",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/20a9ec4a-240c-489f-8ce7-ff9c378cd379",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/876c912d-34fe-46e9-b5f7-8bff1b7b3529",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/b07f6afc-ac8f-4c4b-9e91-5a3f3e670fce",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/a6403390-aaa5-4222-a405-05e8e395d862",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/6d72db53-c3fa-4bc3-b8ee-200e128e6773",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "resolution Reichert Network Solutions GmbH",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-08T11:44:41.003Z"
                        },
                        "id": "1211109",
                        "name": "User Management - License & User Deactivator for Jira",
                        "key": "com.riadalabs.jira.plugins.userdeactivator",
                        "tagLine": "User deactivate automates your bulk user management, automatically removes groups, inactive, and occasional users to save licenses",
                        "summary": "User Deactivator automatically deactivates or removes users from groups and sends an email summary report with the results.\r\nIt also supports manual bulk operations on users, such as de- or reactivation and adding or removing them from groups.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.confluence"
                            },
                            "alternate": {
                                "href": "/apps/1221601/user-management-license-user-deactivator-for-confluence?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/5"
                                },
                                {
                                    "href": "/rest/2/addonCategories/4"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.confluence/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/2f19bd50-fb96-41f1-815f-326ebd6a6a21"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/de.resolution.user-deactivator.confluence/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1221601/user-management-license-user-deactivator-for-confluence?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1210947"
                            },
                            "versions": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.confluence/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/4"
                                        }
                                    },
                                    "name": "Integrations"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/5"
                                        }
                                    },
                                    "name": "IT & helpdesk"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 2063,
                                "totalInstalls": 116,
                                "totalUsers": 260966
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/2f19bd50-fb96-41f1-815f-326ebd6a6a21"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/3c826939-78ee-47c3-a5da-12bac09196a7",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/2f19bd50-fb96-41f1-815f-326ebd6a6a21",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/527a3837-c631-4560-8ff1-80447ff53af2",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/1be33a1b-237a-46db-ac78-3657c05e46a3",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/f4b84d64-d073-4a09-a17e-68946e512d03",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 4.0,
                                "count": 2
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1210947"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1210947/resolution-reichert-network-solutions-gmbh",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/20a9ec4a-240c-489f-8ce7-ff9c378cd379",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/876c912d-34fe-46e9-b5f7-8bff1b7b3529",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/b07f6afc-ac8f-4c4b-9e91-5a3f3e670fce",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/a6403390-aaa5-4222-a405-05e8e395d862",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/6d72db53-c3fa-4bc3-b8ee-200e128e6773",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "resolution Reichert Network Solutions GmbH",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-04-26T11:11:22.825Z"
                        },
                        "id": "1221601",
                        "name": "User Management - License & User Deactivator for Confluence",
                        "key": "de.resolution.user-deactivator.confluence",
                        "tagLine": "User deactivate automates your bulk user management, automatically removes groups, inactive, and occasional users to save licenses",
                        "summary": "User Deactivator automatically deactivates or removes users from groups and sends an email summary report with the results.\r\nIt also supports manual bulk operations on users, such as de- or reactivation and adding or removing them from groups.",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.bitbucket"
                            },
                            "alternate": {
                                "href": "/apps/1221629/user-management-license-user-deactivator-for-bitbucket?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/5"
                                },
                                {
                                    "href": "/rest/2/addonCategories/4"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.bitbucket/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/4a4c35dd-61fb-4383-9d22-cd4c58b7abe7"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/de.resolution.user-deactivator.bitbucket/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1221629/user-management-license-user-deactivator-for-bitbucket?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1210947"
                            },
                            "versions": {
                                "href": "/rest/2/addons/de.resolution.user-deactivator.bitbucket/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/4"
                                        }
                                    },
                                    "name": "Integrations"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/5"
                                        }
                                    },
                                    "name": "IT & helpdesk"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 1038,
                                "totalInstalls": 28,
                                "totalUsers": 9084
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/4a4c35dd-61fb-4383-9d22-cd4c58b7abe7"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/a36b8fc0-4ef8-46e3-8575-8d9eda20654d",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/4a4c35dd-61fb-4383-9d22-cd4c58b7abe7",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/f3569875-f3d1-4599-8b0e-12113414d3f5",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/36e290a5-c4bc-45df-b4ac-533d9442b101",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/b37d3f19-8068-4e3c-9324-3088d193c290",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 0.0,
                                "count": 0
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1210947"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1210947/resolution-reichert-network-solutions-gmbh",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/876c912d-34fe-46e9-b5f7-8bff1b7b3529"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/20a9ec4a-240c-489f-8ce7-ff9c378cd379",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/876c912d-34fe-46e9-b5f7-8bff1b7b3529",
                                                "type": "image/png"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/b07f6afc-ac8f-4c4b-9e91-5a3f3e670fce",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/a6403390-aaa5-4222-a405-05e8e395d862",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/6d72db53-c3fa-4bc3-b8ee-200e128e6773",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "resolution Reichert Network Solutions GmbH",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-06-05T10:18:41.090Z"
                        },
                        "id": "1221629",
                        "name": "User Management - License & User Deactivator for Bitbucket",
                        "key": "de.resolution.user-deactivator.bitbucket",
                        "tagLine": "User deactivate automates your bulk user management, automatically removes groups, inactive, and occasional users to save licenses",
                        "summary": "User Deactivator automatically deactivates, filters & generates reports on active & non-active users\r\n\r\nIt can automatically deactivate users for you and deliver nice-looking reports on which users has been deactivated. Keep your user directory clean",
                        "status": "public"
                    },
                    {
                        "_links": {
                            "self": {
                                "href": "/rest/2/addons/de.accxia.jira.addon.IUM.IntelligentUserManager"
                            },
                            "alternate": {
                                "href": "/apps/1225449/intelligent-user-manager-ium-for-jira?hosting=datacenter&tab=overview",
                                "type": "text/html"
                            },
                            "categories": [
                                {
                                    "href": "/rest/2/addonCategories/1"
                                },
                                {
                                    "href": "/rest/2/addonCategories/45"
                                }
                            ],
                            "distribution": {
                                "href": "/rest/2/addons/de.accxia.jira.addon.IUM.IntelligentUserManager/distribution"
                            },
                            "logo": {
                                "href": "/rest/2/assets/be3b7b16-e703-41ff-8d64-571018f869be"
                            },
                            "reviews": [
                                {
                                    "href": "/rest/2/addons/de.accxia.jira.addon.IUM.IntelligentUserManager/reviews{?sort,offset,limit}",
                                    "templated": true
                                },
                                {
                                    "href": "/apps/1225449/intelligent-user-manager-ium-for-jira?hosting=datacenter&tab=reviews",
                                    "type": "text/html"
                                }
                            ],
                            "vendor": {
                                "href": "/rest/2/vendors/1214007"
                            },
                            "versions": {
                                "href": "/rest/2/addons/de.accxia.jira.addon.IUM.IntelligentUserManager/versions"
                            }
                        },
                        "_embedded": {
                            "categories": [
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/1"
                                        }
                                    },
                                    "name": "Admin tools"
                                },
                                {
                                    "_links": {
                                        "self": {
                                            "href": "/rest/2/addonCategories/45"
                                        }
                                    },
                                    "name": "Utilities"
                                }
                            ],
                            "distribution": {
                                "bundled": false,
                                "bundledCloud": false,
                                "downloads": 472,
                                "totalInstalls": 14,
                                "totalUsers": 5944
                            },
                            "logo": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/assets/be3b7b16-e703-41ff-8d64-571018f869be"
                                    },
                                    "image": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/bc049a0b-e228-4a81-9c52-c949eebccde5",
                                        "type": "image/png"
                                    },
                                    "unscaled": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/be3b7b16-e703-41ff-8d64-571018f869be",
                                        "type": "image/png"
                                    },
                                    "highRes": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/be3b7b16-e703-41ff-8d64-571018f869be",
                                        "type": "image/png"
                                    },
                                    "smallImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/2c1d3c1c-ea81-475a-9687-8b316552f432",
                                        "type": "image/png"
                                    },
                                    "smallHighResImage": {
                                        "href": "https://marketplace-cdn.atlassian.com/files/ddee3148-d67c-4a02-819c-bf9bebc48acf",
                                        "type": "image/png"
                                    }
                                }
                            },
                            "reviews": {
                                "averageStars": 0.0,
                                "count": 0
                            },
                            "vendor": {
                                "_links": {
                                    "self": {
                                        "href": "/rest/2/vendors/1214007"
                                    },
                                    "alternate": {
                                        "href": "/vendors/1214007/accxia",
                                        "type": "text/html"
                                    },
                                    "logo": {
                                        "href": "/rest/2/assets/71c746b7-4c59-4114-9368-9fab81aa5a84"
                                    }
                                },
                                "_embedded": {
                                    "logo": {
                                        "_links": {
                                            "self": {
                                                "href": "/rest/2/assets/71c746b7-4c59-4114-9368-9fab81aa5a84"
                                            },
                                            "image": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/1b8bc796-9b66-4f44-9fce-272d79577fb5",
                                                "type": "image/png"
                                            },
                                            "unscaled": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/71c746b7-4c59-4114-9368-9fab81aa5a84",
                                                "type": "image/jpeg"
                                            },
                                            "highRes": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/ab186c25-7512-4b9b-846d-da88d8568259",
                                                "type": "image/png"
                                            },
                                            "smallImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/0bfeed23-6e4d-4e8f-93cc-2f4be60557e6",
                                                "type": "image/png"
                                            },
                                            "smallHighResImage": {
                                                "href": "https://marketplace-cdn.atlassian.com/files/a46c5a48-9e31-4e8d-af03-c7cf7183e296",
                                                "type": "image/png"
                                            }
                                        }
                                    }
                                },
                                "name": "Accxia",
                                "programs": {
                                    "topVendor": {
                                        "status": "not-requested"
                                    }
                                }
                            },
                            "lastModified": "2023-04-18T08:58:17.635Z"
                        },
                        "id": "1225449",
                        "name": "Intelligent User Manager (IUM) for Jira",
                        "key": "de.accxia.jira.addon.IUM.IntelligentUserManager",
                        "tagLine": "License users with floating licenses&reduce the license tier that you subscribe to/delay an upgrade. Also compatible with SERVER",
                        "summary": "Share a limited number of licenses between a larger number of users, without affecting user permissions.\r\n\r\nCircumvent the end of Server license sales or downgrade your Data Center user tier with IUM.",
                        "status": "public"
                    }
                ]
            },
            "count": 11
        },
        "searchProduct": {
            "products": [
                {
                    "productDescription": "ScriptRunner for Jira Data Center",
                    "productKey": "com.onresolve.jira.groovy.groovyrunner.data-center",
                    "productType": "ADDON",
                    "discountOptOut": true,
                    "lastModified": "2022-08-01T02:28:14.702-05:00",
                    "marketplaceAddon": true,
                    "contactSalesForAdditionalPricing": false,
                    "dataCenter": true,
                    "userCountEnforced": true,
                    "parentDescription": "Jira Software (Data Center)",
                    "parentKey": "jira-software.data-center",
                    "billingType": "SUBSCRIPTION",
                    "orderableItems": [
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:50:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 50 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 275,
                            "renewalAmount": 275,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 50,
                            "monthsValid": 12,
                            "editionDescription": "50 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:50:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:100:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 100 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 555,
                            "renewalAmount": 555,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 100,
                            "monthsValid": 12,
                            "editionDescription": "100 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:100:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:250:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 250 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 1380,
                            "renewalAmount": 1380,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 250,
                            "monthsValid": 12,
                            "editionDescription": "250 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:250:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:500:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 500 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 2750,
                            "renewalAmount": 2750,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 500,
                            "monthsValid": 12,
                            "editionDescription": "500 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:500:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:750:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 750 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 3940,
                            "renewalAmount": 3940,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 750,
                            "monthsValid": 12,
                            "editionDescription": "750 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:750:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:1000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 1000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 4500,
                            "renewalAmount": 4500,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 1000,
                            "monthsValid": 12,
                            "editionDescription": "1000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:1000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:2000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 2000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 6750,
                            "renewalAmount": 6750,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 2000,
                            "monthsValid": 12,
                            "editionDescription": "2000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:2000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:3000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 3000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 8100,
                            "renewalAmount": 8100,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 3000,
                            "monthsValid": 12,
                            "editionDescription": "3000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:3000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:4000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 4000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 10500,
                            "renewalAmount": 10500,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 4000,
                            "monthsValid": 12,
                            "editionDescription": "4000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:4000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:5000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 5000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 11250,
                            "renewalAmount": 11250,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 5000,
                            "monthsValid": 12,
                            "editionDescription": "5000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:5000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:6000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 6000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 12600,
                            "renewalAmount": 12600,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 6000,
                            "monthsValid": 12,
                            "editionDescription": "6000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:6000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:7000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 7000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 14175,
                            "renewalAmount": 14175,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 7000,
                            "monthsValid": 12,
                            "editionDescription": "7000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:7000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:8000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 8000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 15600,
                            "renewalAmount": 15600,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 8000,
                            "monthsValid": 12,
                            "editionDescription": "8000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:8000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:9000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 9000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 16875,
                            "renewalAmount": 16875,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 9000,
                            "monthsValid": 12,
                            "editionDescription": "9000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:9000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:10000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 10000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 18000,
                            "renewalAmount": 18000,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 10000,
                            "monthsValid": 12,
                            "editionDescription": "10000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:10000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:11000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 11000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 19140,
                            "renewalAmount": 19140,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 11000,
                            "monthsValid": 12,
                            "editionDescription": "11000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:11000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:12000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 12000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 19800,
                            "renewalAmount": 19800,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 12000,
                            "monthsValid": 12,
                            "editionDescription": "12000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:12000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:13000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 13000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 20475,
                            "renewalAmount": 20475,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 13000,
                            "monthsValid": 12,
                            "editionDescription": "13000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:13000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:14000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 14000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 21240,
                            "renewalAmount": 21240,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 14000,
                            "monthsValid": 12,
                            "editionDescription": "14000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:14000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:15000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 15000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 22500,
                            "renewalAmount": 22500,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 15000,
                            "monthsValid": 12,
                            "editionDescription": "15000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:15000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:20000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 20000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 24000,
                            "renewalAmount": 24000,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 20000,
                            "monthsValid": 12,
                            "editionDescription": "20000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:20000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:25000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 25000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 28125,
                            "renewalAmount": 28125,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 25000,
                            "monthsValid": 12,
                            "editionDescription": "25000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:25000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:30000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 30000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 31500,
                            "renewalAmount": 31500,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 30000,
                            "monthsValid": 12,
                            "editionDescription": "30000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:30000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:35000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 35000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 34125,
                            "renewalAmount": 34125,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 35000,
                            "monthsValid": 12,
                            "editionDescription": "35000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:35000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:40000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 40000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 36000,
                            "renewalAmount": 36000,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 40000,
                            "monthsValid": 12,
                            "editionDescription": "40000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:40000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:45000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 45000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 37125,
                            "renewalAmount": 37125,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 45000,
                            "monthsValid": 12,
                            "editionDescription": "45000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:45000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:50000:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 50000 Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 37500,
                            "renewalAmount": 37500,
                            "licenseType": "COMMERCIAL",
                            "unitCount": 50000,
                            "monthsValid": 12,
                            "editionDescription": "50000 Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:50000:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        },
                        {
                            "orderableItemId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:987654321:COMMERCIAL",
                            "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) Unlimited Users: Commercial Term License",
                            "publiclyAvailable": true,
                            "saleType": "NEW",
                            "amount": 40000,
                            "renewalAmount": 40000,
                            "licenseType": "COMMERCIAL",
                            "unitCount": -1,
                            "monthsValid": 12,
                            "editionDescription": "Unlimited Users",
                            "editionId": "newPricingPlanItem:com.onresolve.jira.groovy.groovyrunner.data-center:user-tier:987654321:COMMERCIAL",
                            "editionType": "user-tier",
                            "editionTypeIsDeprecated": true,
                            "unitLabel": "USER",
                            "enterprise": false,
                            "starter": false,
                            "sku": null,
                            "edition": null,
                            "renewalFrequency": "ANNUAL"
                        }
                    ],
                    "monthly": [],
                    "annual": []
                }
            ],
            "currency": "USD"
        },
        "products": {
            "jira-software.data-center": {
                "id": 8670721476,
                "orderableItemId": 1760711135,
                "description": "Jira Software (Data Center) 500 Users: Commercial Term License",
                "ccpEntitlementId": null,
                "slug": null,
                "nodeCount": 1,
                "maintenanceMonths": 12,
                "maintenanceStartDate": null,
                "maintenanceEndDate": null,
                "maintenanceCreditStartDate": null,
                "creditApplications": [],
                "accountName": null,
                "accountId": null,
                "parentAccountId": null,
                "parentCartItemId": null,
                "addonParentAccountId": null,
                "listPrice": 42000,
                "discountAmount": 0,
                "creditAmount": 0,
                "totalTax": 0,
                "totalIncTax": 42000,
                "remainingMaintenanceAmount": 0,
                "usdMaintenancePortion": 42000,
                "additionalNotes": null,
                "autoRenewalEnabled": false,
                "isCoTermedItem": false,
                "productDetails": {
                    "productKey": "jira-software.data-center",
                    "productDescription": "Jira Software (Data Center)",
                    "saleType": "NEW",
                    "licenseType": "COMMERCIAL",
                    "unitCount": 500,
                    "editionDescription": "500 Users",
                    "unitLabel": "USER",
                    "marketplaceAddon": false,
                    "atlassianAddon": false,
                    "enterprise": false,
                    "isSubscription": true,
                    "isDataCenter": true,
                    "isTraining": false,
                    "edition": null
                },
                "crossgradeAccountId": null,
                "discountDetails": []
            },
            "com.onresolve.jira.groovy.groovyrunner.data-center": {
                "id": 8749700443,
                "orderableItemId": 3140251576,
                "description": "ScriptRunner for Jira Data Center for Jira Software (Data Center) 50 Users: Commercial Term License",
                "ccpEntitlementId": null,
                "slug": null,
                "nodeCount": 1,
                "maintenanceMonths": 12,
                "maintenanceStartDate": null,
                "maintenanceEndDate": null,
                "maintenanceCreditStartDate": null,
                "creditApplications": [],
                "accountName": null,
                "accountId": null,
                "parentAccountId": null,
                "parentCartItemId": null,
                "addonParentAccountId": null,
                "listPrice": 275,
                "discountAmount": 0,
                "creditAmount": 0,
                "totalTax": 0,
                "totalIncTax": 275,
                "remainingMaintenanceAmount": 0,
                "usdMaintenancePortion": 275,
                "additionalNotes": null,
                "autoRenewalEnabled": false,
                "isCoTermedItem": false,
                "productDetails": {
                    "productKey": "com.onresolve.jira.groovy.groovyrunner.data-center",
                    "productDescription": "ScriptRunner for Jira Data Center",
                    "saleType": "NEW",
                    "licenseType": "COMMERCIAL",
                    "unitCount": 50,
                    "editionDescription": "50 Users",
                    "unitLabel": "USER",
                    "marketplaceAddon": true,
                    "atlassianAddon": false,
                    "enterprise": false,
                    "isSubscription": true,
                    "isDataCenter": true,
                    "isTraining": false,
                    "edition": null
                },
                "crossgradeAccountId": null,
                "discountDetails": []
            },
            "com.k15t.scroll.scroll-viewport.data-center": {
                "id": 8749925282,
                "orderableItemId": 3140260883,
                "description": "Scroll Viewport for Confluence Data Center for Confluence (Data Center) 500 Users: Commercial Term License",
                "ccpEntitlementId": null,
                "slug": null,
                "nodeCount": 1,
                "maintenanceMonths": 12,
                "maintenanceStartDate": null,
                "maintenanceEndDate": null,
                "maintenanceCreditStartDate": null,
                "creditApplications": [],
                "accountName": null,
                "accountId": 36159152,
                "parentAccountId": null,
                "parentCartItemId": null,
                "addonParentAccountId": null,
                "listPrice": 5700,
                "discountAmount": 0,
                "creditAmount": 0,
                "totalTax": 0,
                "totalIncTax": 5700,
                "remainingMaintenanceAmount": 0,
                "usdMaintenancePortion": 5700,
                "additionalNotes": null,
                "autoRenewalEnabled": false,
                "isCoTermedItem": false,
                "productDetails": {
                    "productKey": "com.k15t.scroll.scroll-viewport.data-center",
                    "productDescription": "Scroll Viewport for Confluence Data Center",
                    "saleType": "RENEWAL",
                    "licenseType": "COMMERCIAL",
                    "unitCount": 500,
                    "editionDescription": "500 Users",
                    "unitLabel": "USER",
                    "marketplaceAddon": true,
                    "atlassianAddon": false,
                    "enterprise": false,
                    "isSubscription": true,
                    "isDataCenter": true,
                    "isTraining": false,
                    "edition": null
                },
                "crossgradeAccountId": null,
                "discountDetails": []
            },
            "confluence-data-center": {
                "id": 8670722434,
                "orderableItemId": 1760711135,
                "description": "Confluence Software (Data Center) 500 Users: Commercial Term License",
                "ccpEntitlementId": null,
                "slug": null,
                "nodeCount": 1,
                "maintenanceMonths": 12,
                "maintenanceStartDate": null,
                "maintenanceEndDate": null,
                "maintenanceCreditStartDate": null,
                "creditApplications": [],
                "accountName": null,
                "accountId": null,
                "parentAccountId": null,
                "parentCartItemId": null,
                "addonParentAccountId": null,
                "listPrice": 42000,
                "discountAmount": 0,
                "creditAmount": 0,
                "totalTax": 0,
                "totalIncTax": 42000,
                "remainingMaintenanceAmount": 0,
                "usdMaintenancePortion": 42000,
                "additionalNotes": null,
                "autoRenewalEnabled": false,
                "isCoTermedItem": false,
                "productDetails": {
                    "productKey": "confluence-data-center",
                    "productDescription": "Confluence Software (Data Center)",
                    "saleType": "NEW",
                    "licenseType": "COMMERCIAL",
                    "unitCount": 500,
                    "editionDescription": "500 Users",
                    "unitLabel": "USER",
                    "marketplaceAddon": false,
                    "atlassianAddon": false,
                    "enterprise": false,
                    "isSubscription": true,
                    "isDataCenter": true,
                    "isTraining": false,
                    "edition": null
                },
                "crossgradeAccountId": null,
                "discountDetails": []
            },
            "pricingplan.stash-data-center": {
                "id": 8670721234,
                "orderableItemId": 1760711135,
                "description": "Bitbucket (Data Center) 250 Users: Commercial Term License",
                "ccpEntitlementId": null,
                "slug": null,
                "nodeCount": 1,
                "maintenanceMonths": 12,
                "maintenanceStartDate": null,
                "maintenanceEndDate": null,
                "maintenanceCreditStartDate": null,
                "creditApplications": [],
                "accountName": null,
                "accountId": 11685751,
                "parentAccountId": null,
                "parentCartItemId": null,
                "addonParentAccountId": null,
                "listPrice": 42000,
                "discountAmount": 0,
                "creditAmount": 0,
                "totalTax": 0,
                "totalIncTax": 42000,
                "remainingMaintenanceAmount": 0,
                "usdMaintenancePortion": 42000,
                "additionalNotes": null,
                "autoRenewalEnabled": false,
                "isCoTermedItem": false,
                "productDetails": {
                    "productKey": "pricingplan.stash-data-center",
                    "productDescription": "Bitbucket (Data Center)",
                    "saleType": "UPGRADE",
                    "licenseType": "COMMERCIAL",
                    "unitCount": 250,
                    "editionDescription": "250 Users",
                    "unitLabel": "USER",
                    "marketplaceAddon": false,
                    "atlassianAddon": false,
                    "enterprise": false,
                    "isSubscription": true,
                    "isDataCenter": true,
                    "isTraining": false,
                    "edition": null
                },
                "crossgradeAccountId": null,
                "discountDetails": [
                    {
                        "amount": 1084.93,
                        "type": "UPGRADE_CREDIT",
                        "reason": "UPGRADE_CREDIT"
                    }
                ]
            }
        }
    }

    const createCart = (option) => {

        let strNewUUID = "STRONG_UUID-2b34af00-1533-440c-9340-" + generateLassID(12);
        let objNewCart = mockModule.dataList.create;
        objNewCart.uuid = strNewUUID;

        let strFileName = 'mockStorage_' + strNewUUID + '.json';
        let intFileId = file.create({
            name: strFileName,
            fileType: 'JSON',
            contents: JSON.stringify(objNewCart),
            folder: 398
        }).save();
        log.debug('intFileId', intFileId);
        return objNewCart;
    }

    const getCart = (options) => {
        log.debug('getCart | urlParam', options.urlParam);
        let strFileName = '../mockdata/mockStorage_' + options.urlParam + '.json';
        const strResponse = file.load({
            id: strFileName
        }).getContents();
        log.debug('strResponse', typeof strResponse);
        return JSON.parse(strResponse);
    }

    const addToCart = (option) => {

        let objParam = JSON.parse(option.param);
        log.debug('addToCart : objParam', objParam);
        let months = objParam.newItems[0].renewalMonths;
        let strProductKey = objParam.newItems[0].orderableItemId.split(":")[1];
        let intTier = objParam.newItems[0].orderableItemId.split(":")[3];
        let objProduct = mockModule.dataList.products[strProductKey];
        let customRate = ((intTier / 50) * 50) * 5.5;
        objProduct.maintenanceMonths = months;
        objProduct.productDetails.editionDescription = intTier + " Users"
        objProduct.productDetails.unitCount = intTier;
        objProduct.listPrice = customRate;
        objProduct.totalIncTax = customRate;
        let strFileName = 'mockStorage_' + objParam.cartID + '.json';
        const objFile = file.load({
            id: '../mockdata/' + strFileName
        });
        let strResponse = objFile.getContents();
        let objResponse = JSON.parse(strResponse);
        objResponse.items.push(objProduct);

        file.create({
            name: strFileName,
            fileType: 'JSON',
            contents: JSON.stringify(objResponse),
            folder: 398
        }).save();

        return objResponse;
    }

    const removeWhiteSpace = (str) => str.replace(/\s/g, '');
    const removeToCart = (option) => {
        log.debug('removeToCart', option);
        let objParam = JSON(option.param);
        log.debug('removeToCart : objParam', objParam);
        var itemID = objParam.itemID;
        let strFileName = 'mockStorage_' + objParam.cartID + '.json';

        const objFile = file.load({
            id: '../mockdata/' + strFileName
        });
        let strResponse = objFile.getContents();
        let objResponse = JSON.parse(strResponse);

        let indxToRemove = objResponse.items.findIndex((obj) => {
            log.debug('itemID', itemID)
            log.debug('itemID2', removeWhiteSpace("DATACENTER_" + obj.productDetails.productDescription).toUpperCase())
            return itemID == removeWhiteSpace("DATACENTER_" + obj.productDetails.productDescription).toUpperCase()
        }) + 1
        var items = objResponse.items;

        log.debug('items', items)
        temp = items.slice(indxToRemove, 1);

        objResponse.items = temp;

        file.create({
            name: strFileName,
            fileType: 'JSON',
            contents: JSON.stringify(objResponse),
            folder: 398
        }).save();

        return objResponse;
    }

    const addRenewalToCart = (option) => {

        let objParam = JSON.parse(option.param);
        log.debug('addRenewalToCart : objParam', objParam);
        let strFileName = 'mockStorage_' + objParam.cartID + '.json';
        let strProductKey = objParam.data.accountChanges[0].accountChangeOption.orderableItemId.split(":")[1];
        let objProduct = mockModule.dataList.products[strProductKey];

        log.debug('addRenewalToCart :  objProduct', objProduct);
        log.debug('addRenewalToCart :  strProductKey', strProductKey);
        const objFile = file.load({
            id: '../mockdata/' + strFileName
        });
        let strResponse = objFile.getContents();
        let objResponse = JSON.parse(strResponse);
        log.debug('newObject', objResponse.items.push(objProduct));


        file.create({
            name: strFileName,
            fileType: 'JSON',
            contents: JSON.stringify(objResponse),
            folder: 398
        }).save();

        return objResponse;
    }

    const addUpgradeToCrt = (option) => {
        let objParam = JSON.parse(option.param);
        log.debug('addUpgradeToCrt : objParam', objParam);
        let strFileName = 'mockStorage_' + objParam.cartID + '.json';
        let strProductKey = objParam.data.accountChanges[0].accountChangeOption.orderableItemId.split(":")[1];
        let intMonths = objParam.data.accountChanges[0].accountChangeOption.maintenanceMonths;
        log.debug('addUpgradeToCrt :  strProductKey', strProductKey);
        let objProduct = mockModule.dataList.products[strProductKey];
        objProduct.maintenanceMonths = intMonths;

        const objFile = file.load({
            id: '../mockdata/' + strFileName
        });
        let strResponse = objFile.getContents();
        let objResponse = JSON.parse(strResponse);
        objResponse.items.push(objProduct);


        file.create({
            name: strFileName,
            fileType: 'JSON',
            contents: JSON.stringify(objResponse),
            folder: 398
        }).save();


        return objResponse;
    }

    const getQuote = (option) => {
        const strResponse = file.load({
            id: '../mockdata/mockStorage.json'
        }).getContents();
        let objImportQuote = JSON.parse(strResponse);
        objImportQuote.orderNumber = "AT-" + Math.floor(Math.random() * 100000);
        log.debug('getQuote : strResponse | ' + typeof strResponse, strResponse);
        return objImportQuote;
    }

    const generateLassID = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }


    return mockModule;

});
