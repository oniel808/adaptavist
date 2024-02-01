/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', '../../Library/SQL/adap_sql_library.js'],

    (record, libSuitesQl) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            log.debug('beforeLoad | scriptContext.type', scriptContext.type);

            try {
                var intInvoiceId = scriptContext.newRecord.id

                var hasEmail = libSuitesQl.search({
                    type: 'getEmailForInvoiceRecord',
                    params: {
                        id: intInvoiceId,
                    }
                });

                log.debug('hasEmail', hasEmail);

                objSubmitFields = {
                    type: record.Type.INVOICE,
                    id: intInvoiceId,
                    values: {
                        'custbody_adap_atl_email_sent': true
                    },
                    options: {
                        ignoreFieldChange: true
                    }
                }

                if ((scriptContext.type == scriptContext.UserEventType.VIEW ||
                    scriptContext.type == scriptContext.UserEventType.EMAIL ||
                    scriptContext.type == scriptContext.UserEventType.PRINT) &&
                    hasEmail.length) {
                    // let intSavedId = record.submitFields(objSubmitFields);
                    // log.debug('intSavedId', intSavedId);
                }
            } catch (e) {
                log.error('Invoice beforeLoad Error | ', e)
            }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            log.debug('beforeSubmit | scriptContext.type', scriptContext.type);
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            log.debug('afterSubmit | scriptContext.type', scriptContext.type);
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
