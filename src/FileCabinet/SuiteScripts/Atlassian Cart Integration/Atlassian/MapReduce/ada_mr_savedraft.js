/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/file', 'N/runtime',
    '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js',
    './lib/adap_save_draft_lib.js'],

    (file, runtime,
        libMapper,
        libSaveDraft) => {
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

        const objMrSaveDraftMapper = libMapper.mrSaveDraft;

        const getInputData = (inputContext) => {
            try {
                log.debug('GetInput | START')
                const objScript = runtime.getCurrentScript();
                const intFileId = objScript.getParameter({ name: objMrSaveDraftMapper.params.file });
                const intUniqueId = objScript.getParameter({ name: objMrSaveDraftMapper.params.uniqueId });
                // const scriptCache = cache.getCache({ name: PREFIX_ID + intUniqueId });
                const fileObj = file.load({ id: intFileId });
                let option = JSON.parse(fileObj.getContents());
                // option.scriptCache = scriptCache
                option = libSaveDraft.createCartRecord(option)

                file.create({
                    name: intUniqueId,
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(option),
                    folder: objMrSaveDraftMapper.folderId
                }).save();

                return option.cartResponse.items
            } catch (e) {
                log.debug('GetInput | Error', e)
            }
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
            try {
                log.debug('map | start');
                const objScript = runtime.getCurrentScript();
                const intFileId = objScript.getParameter({ name: objMrSaveDraftMapper.params.file });
                const intUniqueId = objScript.getParameter({ name: objMrSaveDraftMapper.params.uniqueId });
                // const scriptCache = cache.getCache({ name: PREFIX_ID + intUniqueId });
                var objMapContext = JSON.parse(mapContext.value);
                log.debug('map | objMapContext', objMapContext);

                const fileObj = file.load({ id: intFileId });

                let option = JSON.parse(fileObj.getContents());
                option.mapContext = objMapContext

                option = libSaveDraft.createCartItemRecords(option)

                file.create({
                    name: intUniqueId,
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(option),
                    folder: objMrSaveDraftMapper.folderId
                }).save();

                mapContext.write(intUniqueId, option);

                log.debug('map | end');
            } catch (e) {
                log.debug('map | error', e)
            }
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
            try {
                log.debug('reduce | start')
                const objScript = runtime.getCurrentScript();
                const intFileId = objScript.getParameter({ name: objMrSaveDraftMapper.params.file });
                const intUniqueId = objScript.getParameter({ name: objMrSaveDraftMapper.params.uniqueId });
                const fileObj = file.load({ id: intFileId });
                let option = JSON.parse(fileObj.getContents());
                option.EstRemoveLines = libSaveDraft.removeNonExistingCartItem(option)
                file.create({
                    name: intUniqueId,
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(option),
                    folder: objMrSaveDraftMapper.folderId
                }).save();
                log.debug('reduce | end')
            } catch (e) {
                log.debug('reduce | Error', e)
            }
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
            try {
                log.debug('summarize | start');
                const objScript = runtime.getCurrentScript();
                const intFileId = objScript.getParameter({ name: objMrSaveDraftMapper.params.file });
                const intUniqueId = objScript.getParameter({ name: objMrSaveDraftMapper.params.uniqueId });

                const fileObj = file.load({ id: intFileId });
                const option = JSON.parse(fileObj.getContents());

                log.debug('summarize | summaryContext', summaryContext);
                option.cartIdentifier = intUniqueId;

                var intEstId = libSaveDraft.createUpdateEstimateRecord(option);

                log.debug('summarize | intEstId', intEstId);
                file.delete({ id: intFileId });
            } catch (e) {
                log.debug('summarize | summaryContext', e)
            }
        }

        return { getInputData, map, reduce, summarize }

    });
