define(['./lib/nscart.js', './lib/nsestimate.js'],

    (nscart, nsestimate) => {

        const createCart = (options) => {
            return nscart.create(options)
        }

        const getLastState = (options) => {
            return nscart.getLastState(options)
        }
        const removeLastState = (options) => {
            return nscart.removeLastState(options)
        }

        const getRefreshQuote = (options) => {
            return nsestimate.getRefreshQuote(options)
        }

        const refreshQuote = (options) => {
            return nsestimate.refreshQuote(options)
        }
        const toDeleteAndUpdate = (options) => {
            return nsestimate.toDeleteAndUpdate(options)
        }
        const toAddItems = (options) => {
            return nsestimate.toAddItems(options)
        }
        const getMrStatus = (options) => {
            return nsestimate.getMrStatus(options)
        }
        const cartIsChanged = (options) => {
            return nscart.cartIsChanged(options)
        }

        return {
            createCart,
            getLastState,
            removeLastState,
            getRefreshQuote,
            refreshQuote,
            toDeleteAndUpdate,
            toAddItems,
            getMrStatus,
            cartIsChanged
        }
    })
