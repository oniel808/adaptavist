/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', '../../Purchase Order/Mapping/adap_po_field_mapping.js',
        '../Library/adap_mod_handlebars.js', 'N/query', 'N/search', 'N/ui/serverWidget', 'N/redirect', 'N/render','N/file'],

    (record, mapper, modHandleBars, query, search, serverWidget, redirect, render,file) => {

        //to be deployed to message record
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */

        const INVOICE_TYPE = 'CustInvc'
        const FOLDER_TO_SAVE_ATTACHMENT = -20
        const beforeLoad = (scriptContext) => {
            try {

                log.audit('beforeLoad', scriptContext.type)
                let objMessage = scriptContext.newRecord;
                let intTransaction = objMessage.getValue('transaction')
                let objTransDetail = checkIfInvoice(objMessage)
                if (objTransDetail.type === INVOICE_TYPE) {
                    objMessage.setValue({fieldId:'includetransaction',value:false})
                    var transactionFile = render.transaction({
                        entityId: parseInt(intTransaction),
                        printMode: render.PrintMode.PDF,
                        inCustLocale: true
                    });
              let objInv = record.load({
                  type:record.Type.INVOICE,
                  id:intTransaction
              })
                    let strTranId = objInv.getValue('tranid')

                    var fileObj = file.create({
                        name: 'Invoice_' +strTranId+'.pdf',
                        fileType: file.Type.PDF,
                        contents: transactionFile.getContents(),
                        folder: FOLDER_TO_SAVE_ATTACHMENT
                    });

                    var fileId = fileObj.save();
                    objMessage.setSublistValue({
                        sublistId:'mediaitem',
                        fieldId:'mediaitem',
                        value:fileId,
                        line:0
                    })
                }
            } catch (e) {
                log.error('error', e.message)
            }
        }


        const beforeSubmit = (scriptContext) => {
            log.audit('beforeSubmit', scriptContext.type)
        }

        const afterSubmit = (scriptContext) => {
            log.audit('afterSubmit', scriptContext.type)
            try {
                let objMessage = scriptContext.newRecord;
                let objTransDetail = checkIfInvoice(objMessage)
                if (objTransDetail.type === INVOICE_TYPE && objTransDetail.custbody_adap_atl_email_sent === 'F') {
                    log.debug('creating PO')
                    redirect.toSuitelet({
                        scriptId: mapper.objMapping.scriptRecord,
                        deploymentId: mapper.objMapping.scriptDeployment,
                        parameters: {
                            invoiceId: objTransDetail.id
                        }
                    })
                } else {
                    log.debug('not creating PO')
                }

            } catch (e) {
                log.error('error', e.message)
            }
        }

        const checkIfInvoice = (objMessage) => {
            let objTransDetail = {}
            let intTransaction = objMessage.getValue('transaction')
            log.debug('intTransaction', intTransaction);
            let strQuery = mapper.objMapping.getTransTypeSQL
            strQuery = strQuery.replace('{tranId}', intTransaction)
            let arrQueryResult = query.runSuiteQL({
                query: strQuery
            }).asMappedResults();
            log.debug('arrQueryResult', arrQueryResult)
            if (arrQueryResult.length > 0) {
                objTransDetail = arrQueryResult[0]
            }
            return objTransDetail
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
