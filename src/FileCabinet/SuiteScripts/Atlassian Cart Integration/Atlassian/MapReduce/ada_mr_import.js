/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/file', 'N/runtime',
    '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js',
    '../MapReduce/lib/adap_import_quote_lib.js'
],

    (file, runtime,
        libMapper,
        libImportCart
    ) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const objMrImportMapper = libMapper.mrImport;
        const getInputData = (inputContext) => {

            const objScript = runtime.getCurrentScript();
            const intFileId = objScript.getParameter({ name: objMrImportMapper.params.file });
            const intUniqueId = objScript.getParameter({ name: objMrImportMapper.params.uniqueId });

            const fileObj = file.load({ id: intFileId });
            log.debug('atlassianCart | fileObj.getContents()', fileObj.getContents());
            var options = JSON.parse(fileObj.getContents());
            log.debug('getInputData | START')
            try {
                options = libImportCart.initializeImportCart(options)
                file.create({
                    name: intUniqueId,
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(options),
                    folder: objMrImportMapper.folderId
                }).save();
            } catch (e) {
                log.debug('getInputData | ERROR', e)
            }
            log.debug('getInputData | END')
            return { cartId: options.cartId }

        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            log.debug('map | START 2')
            const objScript = runtime.getCurrentScript();
            const intFileId = objScript.getParameter({ name: objMrImportMapper.params.file });
            const intUniqueId = objScript.getParameter({ name: objMrImportMapper.params.uniqueId });

            const fileObj = file.load({ id: intFileId });

            var options = JSON.parse(fileObj.getContents());
            log.debug('map | options, ', options)
            try {
                options = libImportCart.createCartItemRecords(options)
                file.create({
                    name: intUniqueId,
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(options),
                    folder: objMrImportMapper.folderId
                }).save();
            } catch (e) {
                log.debug('map | ERROR', e)
            }
            log.debug('map | END')
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            log.debug('summarize | START')
            const objScript = runtime.getCurrentScript();
            const intFileId = objScript.getParameter({ name: objMrImportMapper.params.file });
            const intUniqueId = objScript.getParameter({ name: objMrImportMapper.params.uniqueId });
            const fileObj = file.load({ id: intFileId });

            var options = JSON.parse(fileObj.getContents());
            try {
                options.cartIdentifier = intUniqueId;
                options = libImportCart.createUpdateEstimateRecord(options);
            } catch (e) {
                log.debug('summarize | ERROR', e)
            }
            file.delete({ id: intFileId });
            log.debug('summarize | END');
            return true
        }

        return { getInputData, map, reduce, summarize }

    });
