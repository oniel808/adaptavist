/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        let objMessages = {}
        objMessages.mapReduceMessage={
            refresh:{
                title: 'Refresh Atlassian Quote is in progress',
                    message: 'Thank you for your patience! The Atlassian quote is currently being refreshed. <br>  Please manually refresh the page.', //The page will refresh once the Refresh Quote is done
            },
            generateQuote:{
                title: 'Quote Generation is in progress',
                    message: 'Thank you for your patience! The Atlassian quote is currently being generated. <br>', //The page will refresh once the Generate Quote is done
                    footerMessage: '<br>Please manually refresh the page.',
                    initializingMessage: 'Thank you for your patience! <br>Quote Generation is being initialized.',
                    finilazingMessage: 'Thank you for your patience! <br>Final touches are being applied to the quote generation.',
                    processingMessage: 'quoted out of length cart orders has been processed into an Atlassian quote.',
                    quoted:0,
                    order:0,
            },
            doneGenerateQuote:{
                title:'Atlassian Generation Quote',
                    message:'Atlassian Generation Quote process has been completed.'//The page will refresh within 5 seconds
            },
            doneRefreshQuote:{
                title:'Refresh Atlassian Quote',
                    message:'Atlassian refresh process has been completed.'//The page will refresh within 5 seconds
            },
            failedGenerateQuote:{
                title:'Failed to Generate Quote',
                    message:'Atlassian Generation Quote process has Failed,<br> Please consult with Administrator.'
            },
            failedRefreshQuote:{
                title:'Failed to Refresh Quote',
                    message:'Atlassian refresh process has Failed,<br> Please consult with Administrator.'
            },
            genericEstimate:{
                title:'Atlassian Quote Busy',
                    message: 'Thank you for your patience! The Atlassian quote is currently being processed. <br>Please wait a moment for the updated content, or manually refresh the page if needed.'
            },
            doneGenericEstimate:{
                title:'Atlassian Quote',
                    message: 'Thank you for your patience! The Atlassian quote has been successfully generated or refreshed.'
            },
            failedGenericEstimate:{
                title:'Atlassian Quote Failed',
                    message: 'We apologize for the inconvenience. The Atlassian quote could not be generated or refreshed due to a technical issue. <br>Please try again later or contact support for assistance.'
            },
            failedRefreshEstimate:{
                title: 'Atlassian Quote Refresh Failed',
                message: 'We apologize for the inconvenience. There are Atlassian quote/s that was not  refreshed due to some technical issue. <br>Please try again by Clicking "Refresh Quote" button or contact support for assistance.'
            },
            expiredAtlCart:{
                message: 'The order could not generate because the Atlassian Cart is corrupted.'
            }
        }
        objMessages.confirmationMessage = {
            currencyField : {
                message: 'Would you kindly confirm your selection of the currency?'
            }
        }
        objMessages.itemDescription = {
            COMMERCIAL:{
                message: "Commercial Term License"
            }
        }

        return {
            objMessages
        }
    });
