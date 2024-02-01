/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

/*
    ID					: customscript_adap_atlassiancart_op_sl
    Name				: [SR] Atlassian Cart SL
    Client Script       : ../ClientScript/ada_cs_qbcs.js
    Created On			: May 30, 2023
    Author				: ServiceRocket
    Script Type			: Suitelet
*/
define(['N/file', 'N/ui/serverWidget', 'N/runtime',
    '../Library/htmllib/handlebar/handlebars.min-v4.7.7.js', './api/router.js'],
    function (file, serverWidget, runtime,
        handlebar, routerLib) {
        function onRequest(scriptContext) {
            try {

                const objParams = scriptContext.request.parameters;
                const strAction = objParams.action;
                const strMethod = scriptContext.request.method;
                const strView = objParams.view;
                let strTmplPath = '';

                var response = {};
                log.debug('strAction,', strAction)
                if (strAction) {
                    response = routerLib.functionRouter[strAction](objParams)
                    scriptContext.response.write(JSON.stringify(response));
                    var objScript = runtime.getCurrentScript();
                    log.audit('Available Governance Score | ' + strAction, objScript.getRemainingUsage());
                } else if (strMethod == 'GET') {
                    if (!strAction) {
                        strTmplPath = routerLib.pageRouter[strView]

                        var strTemplate = file.load({
                            id: strTmplPath
                        }).getContents();

                        var strHandlebarTemplate = handlebar.compile(strTemplate);

                        var form = serverWidget.createForm({
                            title: ' ',
                            hideNavBar: true
                        });

                        form.clientScriptModulePath = './ClientScript/domScriptImport.js';

                        form.addField({
                            id: "inline",
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'inline',
                        }).defaultValue = strHandlebarTemplate({
                            jsonMockupFields: strHandlebarTemplate
                        });

                        scriptContext.response.writePage(form);

                    }
                }
            } catch (e) {
                log.debug('Atlassian Integration | Error', e);
                scriptContext.response.write(JSON.stringify(e));
            }
        }

        return { onRequest }

    });
