/**
 * @NApiVersion 2.1
 */
define(['N/query', '../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js'],
    /**
 * @param{query} query
 */
    (query, libMapper) => {

        const search = (option) => {
            log.debug('searchSql', option);
            let arrResult = [];
            let sql = libMapper.sql[option.type];
            let params = option.params;
            for (const key in params) {
                sql = sql
                    .replace(`{{${key}}}`, typeof params[key] == 'object' ? params[key].join() : params[key])
                    .replaceAll('\n', '');
            }
            arrResult = query.runSuiteQL({ query: sql }).asMappedResults();
            log.debug('sql',sql)
            return arrResult;
        }

        return {
            search,
        }

    });
