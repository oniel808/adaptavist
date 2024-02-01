
/*
    Purpose				: show button for atlassian
    Created On			: May 30, 2023
    Author				: ServiceRocket
    Script Type			: Map/Reduce Script
*/
define(['N/https', 'N/query', './mocker.js', './mockerAPI.js', '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../SQL/adap_sql_library.js',
    '../elapsedTime/elapsedTimeMonitor.js'],
    (https, query, mocker, mockerAPI, libMapper, libSuitesQl,
        libElapsedTime) => {
        integrate = (option) => {

            var objResponse = {};
            var isMocked = false;
            var intSandEnvironment = libMapper.environment.sandbox
            var intProdEnvironment = libMapper.environment.production

            var intElapsedTimeStart = libElapsedTime.elapsedTime()
            var objQueryResult = libSuitesQl.search({
                type: 'getIntegrator',
                params: {
                    appid: option.integration,
                    env: intProdEnvironment,
                    macid: option.mac || 1
                }
            })[0]
            let objPayload = {
                url: `${objQueryResult.url}${option.path}${option.urlParam || ''}`,
                headers: {
                    [objQueryResult.custrecord_adap_integration_mapper_auth]: `{${objQueryResult.secret}}`,
                    'Content-Type': 'application/json',
                    'mac': objQueryResult.mac_display
                },
                credentials: [objQueryResult.secret]
            }

            if (isMocked) {
                objResponse.body = JSON.stringify(mockerAPI.mockerControllerAPI(option));
                objResponse.code = 200;
            } else if (option.method == 'get') {
                objResponse = https.get(objPayload);
            } else if (option.method == 'post') {
                objPayload.body = option.param;
                objResponse = https.post(objPayload);
            }
            var objResponseOutput = JSON.parse(objResponse.body);

            libElapsedTime.elapsedTime({ title: 'Integrator 2', start: intElapsedTimeStart });
            objResponseOutput.httpcode = objResponse.code;
            return objResponseOutput;
        }

        return {
            integrate
        }

    });
