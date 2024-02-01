/**
 * @NApiVersion 2.1
 */
define(['N/record',
    '../calculations/calculations.js', '../TechnicalContact/adap_lib_tech_contact.js',
    '../../Library/FieldAndValueMapper/adap_field_and_def_value_mapper.js', '../htmllib/moment/momentjs.js'],
    /**
 * @param{record} record
 */
    (record,
        libCalculations, libTechContact,

        libMapper, moment) => {
        PUBLIC = {};
        PRIVATE = {};

        const SUBLISTID = 'item';
        const METHOD_CREATE = 'create';
        const METHOD_ADDITEMS = 'additems';
        const METHOD_UPDATE = 'update';

        PUBLIC.configRecord = (option) => {
            let maptype = option.type;
            let data = option.data;
            let intIDReturn;
            let objRecord;
            if (option.method == METHOD_CREATE || (option.method == METHOD_ADDITEMS && (option.option.estid == 'null' || !option.option.estid))) {
                objRecord = record.create({
                    type: libMapper[maptype].id,
                    isDynamic: true,
                });
            } else if (option.method == METHOD_UPDATE || (option.method == METHOD_ADDITEMS && (option.option.estid != 'null' || option.option.estid))) { //|| option.method == METHOD_ADDITEMS)

                var objDataRec = {
                    type: libMapper[maptype].id,
                    id: option.id,
                    values: {},
                    defaultValues: {},
                    isDynamic: true
                }
                log.debug('configureRecord | cf: ', option.cf)
                if (option.method == METHOD_ADDITEMS) {
                    objDataRec.defaultValues.cf = libMapper.customForms.estimate
                }
                objRecord = record.load(objDataRec);
            }
            let objFieldIds = libMapper[maptype].fields;
            //add bodyfield values
            for (const fieldkey in objFieldIds) {
                var dataValue = maptype == record.Type.ESTIMATE ? option.option[fieldkey] : data[fieldkey]

                let field = objFieldIds[fieldkey]
                let fieldType = ''
                if (typeof dataValue == 'undefined' ||
                    typeof dataValue == 'null' ||
                    dataValue == 'undefined' ||
                    dataValue == 'null' ||
                    dataValue == null ||
                    dataValue == undefined
                ) {
                    if (field.default) {
                        dataValue = field.default
                    } else {
                        continue
                    }
                }
                fieldType += field.type

                if (fieldType == 'date') {
                    fieldType = 'text'
                    momentDateTime = moment(dataValue).utc().format('MM/DD/YYYY hh:mm:ss a')
                    dateTime = format.parse({ value: momentDateTime, type: format.Type.DATETIME })
                    dataValue = dateTime
                } else if (fieldType == 'checkbox') {
                    fieldType = 'value'
                } else if (fieldType == 'url') {
                    fieldType = 'value';
                    if (dataValue) {
                        dataValue = 'https://' + dataValue + '/'
                    } else {
                        dataValue = ''
                    }
                }

                let objValueSetter = {
                    fieldId: field.id,
                    [fieldType]: dataValue
                }

                if (fieldType == 'text') {
                    objRecord.setText(objValueSetter)
                } else {
                    objRecord.setValue(objValueSetter)
                }
            }
            intIDReturn = objRecord.save();
            return intIDReturn
        }

        return PUBLIC

    });
