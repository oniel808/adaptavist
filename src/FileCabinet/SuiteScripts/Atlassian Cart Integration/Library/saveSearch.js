/**
 * @NApiVersion 2.1
 */
define(['N/search'],
    /**
 * @param{query} query
 */
    (search) => {

        const saveSearchQueries = {
            addCartDetails: {
                columns: [
                    { name: "email",        join: "salesRep",      label: "purchaseremail",     type:'value'},
                    { name: "firstname",    join: "salesRep",      label: "purchaserfirstname", type:'value'},
                    { name: "lastname",     join: "salesRep",      label: "purchaserlastname",  type:'value'},
                    { name: "phone",        join: "salesRep",      label: "purchaserphone",     type:'value'},

                    { name: "firstname",    join: "salesRep",      label: "billingfirstname",   type:'value'},
                    { name: "lastname",     join: "salesRep",      label: "billinglastname",    type:'value'},
                    { name: "email",        join: "salesRep",      label: "billingemail",       type:'value'},
                    { name: "phone",        join: "salesRep",      label: "billingphone",       type:'value'},

                    // { name: "email",        join: "customerMain",  label: "technicalemail",     type:'value'},
                    { name: "custbody_atl_tech_contact_email",        label: "technicalemail",     type:'value'},
                    // { name: "phone",        join: "customerMain",  label: "technicalphone",     type:'value'},
                    { name: "vatregnumber", join: "customerMain",  label: "technicaltaxid",     type:'value'},

                    { name: "custbody_adap_enduser_phone",                          label: "technicalphone",             type:'value'  },
                    { name: "custbody_adap_enduser_name",                           label: "technicalorganisationname",  type:'value'  },
                    { name: "custbodyadap_enduser_address1",                        label: "technicaladdress1",          type:'value'  },
                    { name: "custbody_enduser_address2",                            label: "technicaladdress2",          type:'value'  },
                    { name: "custbody_adap_enduser_city",                           label: "technicalcity",              type:'value'  },
                    { name: "custbody_adap_enduser_country",                        label: "technicalcountry",           type:'text'   },
                    { name: "custbody_adap_enduser_country",                        label: "technicalcountryinternalid", type:'value'  },
                    { name: "custbody_adap_enduser_state",                          label: "technicalstate",             type:'value'  },
                    // { name: "custbody_adap_enduser_country",  join: "country",      label: "technicalisocountrycode" ,   type:'text'   },
                    { name: "custbody_adap_enduser_zip",                            label: "technicalpostcode",          type:'value'  },
                    { name: "vatregnumber",                   join: "customerMain", label: "technicaltaxid",             type:'value'  },

                ]
            },
            addCartDetailsContacts: {
                columns: [
                    { name: "firstname", label: "technicalfirstname" },
                    { name: "lastname",  label: "technicallastname"  },
                ]
            },
            isInvoiceExist: {
                columns: [
                    { name: "createdfrom", join: "", label: "createdfrom" },
                    { name: "internalid", join: "", label: "internalid" },
                    { name: "type", join: "", label: "type" },
                ]
            },
            getMRScript: {
                columns: [
                    { name: "scriptid", join: "script", label: "scriptid" },
                ]
            }
        }
        const ssearch = (option) => {
            var arrColumns = []
            var arrResult = []
            log.debug('option.type', option.type)
            log.debug('saveSearchQueries', saveSearchQueries)
            var objColumns = saveSearchQueries[option.type].columns
            log.debug('objColumns', objColumns)
            for (let column of objColumns) {
                arrColumns.push(search.createColumn(column))
            }

            var cartDetailSearch = search.create({
                type: option.record || "transaction",
                filters: [option.filters],
                columns: arrColumns
            });

            cartDetailSearch.run().each(function (result) {
                objData = {}
                for (let columnData of objColumns) {
                    if (columnData.type == 'value' || !columnData.type) {
                        objData[columnData.label] = result.getValue(columnData)
                    } else if (columnData.type == 'text') {
                        objData[columnData.label] = result.getText(columnData)
                    }
                }
                arrResult.push(objData)
                return true
            });
            return arrResult;
        }


        return {
            ssearch,
        }

    });
