/**
 * @NApiVersion 2.1
 */
define(['../api/atlassian.js', '../api/netsuite.js'],

    (atlassian, netsuite) => {

        var router = {
            functionRouter: {
                createCart: atlassian.createCart,
                searchAddon: atlassian.searchAddon,
                searchProduct: atlassian.searchProduct,
                addToCart: atlassian.addToCart,
                getCart: atlassian.getCart,
                removeItemFromCart: atlassian.removeItemFromCart,
                getUpgradeOptions: atlassian.getUpgradeOptions,
                getRenewOptions: atlassian.getRenewalOptions,
                saveDraft: atlassian.saveDraft,
                generateQuote: atlassian.generateQuote,
                getAtlassianQuote: atlassian.getAtlassianQuote,
                importQuote: netsuite.createCart,
                getupgrades: atlassian.addUpgradeItem,
                getrenewals: atlassian.addRenewalItem,
                getLastState: netsuite.getLastState,
                removeLastState: netsuite.removeLastState,
                getRefreshQuote: netsuite.getRefreshQuote,
                refreshQuote: netsuite.refreshQuote,
                getMrStatus: netsuite.getMrStatus,
                cartIsChanged: netsuite.cartIsChanged,
            },
            pageRouter: {
                atlassianCart: './template/html/QBv1.html',
                getAtlassianQuote: './template/html/getquote.html',
                getRefreshQuote: './template/html/refreshQuote.html',
            }
        }
        return router

    });
