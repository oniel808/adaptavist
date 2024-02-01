/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        PUBLIC = {}

        PUBLIC.elapsedTime = (options) => {
            if (!options) {
                return new Date();
            } else if (options.start) {
                var elapsedTime = new Date() - options.start;
                log.audit('Response Time | ' + options.title, ' Elapsed Time (ms): ' + elapsedTime);
            }
        }

        return PUBLIC

    });
