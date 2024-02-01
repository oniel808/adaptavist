define(['./lib/cart', './lib/marketplace'],
    (cart, marketplace) => {

        const createCart = (option) => {
            return cart.create(option);
        }

        const addToCart = (option) => {
            return cart.add(option);
        }

        const addUpgradeItem = (option) => {
            return cart.addUpgradeItem(option);
        }
        const addRenewalItem = (option) => {
            return cart.addRenewalItem(option);
        }

        const getCart = (option) => {
            return cart.get(option);
        }

        const removeItemFromCart = (option) => {
            return cart.remove(option);
        }

        const searchAddon = (option) => {
            return marketplace.searchAddon(option);
        }

        const searchProduct = (option) => {
            return marketplace.searchProduct(option);
        }

        const getUpgradeOptions = (option) => {
            return marketplace.getUpgradeOptions(option);
        }

        const getRenewalOptions = (option) => {
            return marketplace.getRenewalOptions(option);
        }

        const toOrder = (option) => {
            return cart.toOrder(option);
        }

        const saveDraft = (option) => {
            return cart.saveDraft(option);
        }

        const generateQuote = (option) => {
            return cart.generateQuote(option);
        }

        const getAtlassianQuote = (option) => {
            return cart.getAtlassianQuote(option);
        }


        return {
            createCart,
            addToCart,
            getCart,
            removeItemFromCart,
            searchAddon,
            searchProduct,
            getUpgradeOptions,
            getRenewalOptions,
            toOrder,
            saveDraft,
            generateQuote,
            getAtlassianQuote,
            addUpgradeItem,
            addRenewalItem
        }

    });
