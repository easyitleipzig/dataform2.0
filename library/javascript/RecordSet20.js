class RecordSet {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            id:                 undefined,  // necessary - id of field; fieldname in databasetable
            dVar:               undefined,  // necessary - var of field object
            target:             undefined,
            fields:             [],         // necessary - fielddefinitions 
            values:             [],
            table:              undefined,  // nessacary - tablename for Recordset
            variables:          {},         // optional - additional values for Recordset
        }
        let showOnInit = true, primaryKey, primaryKeyValue;
        Object.assign( this.opt, param );
    }
    evaluateRS = function ( data ) {
        let jsonobject, l, i, tmp;
        if( typeof data === "string" ) {
            jsonobject = JSON.parse( data );
        } else {
            jsonobject = data;
        }
        if( !nj().isJ( jsonobject ) ) {
            throw "kein JSON-Objekt übergeben";
        }
        //console.log( jsonobject );
        var fr = window[ jsonobject.dVar ];
        switch( jsonobject.command ) {
            case "getFielddefinitions":
                // content
                let l = jsonobject.fieldDefs.length;
                let i = 0;
                while( i < l ) {
                    //console.log( jsonobject.fieldDefs[i] );
                    let field = new Field( { id: jsonobject.fieldDefs[i].Field, maxLength: jsonobject.fieldDefs[i].Field } );
                    let tmpType = jsonobject.fieldDefs[i].Type.split( "(" )[0];
                    let tmpLength = jsonobject.fieldDefs[i].Type.split( "(" )[1];
                    //console.log( tmpType, jsonobject.fieldDefs[i].Type.split( "(" ), tmpLength );
                    let tmpSize = undefined;
                    let tmpMinVal = undefined;
                    let tmpMaxVal = undefined;
                    let tmpUnsigned = false;
                    if( typeof tmpLength !== "undefined" ) {
                        switch( tmpType ) {
                            case "bigint":
                            case "int":
                            case "tinyint":
                            case "boolean":
                                tmpSize = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" )[0]
                            break;
                            case "varchar": 
                            case "bit": 
                                tmpLength = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" )[0]
                            break;
                            default:
                                tmpSize = undefined;
                            break;
                        }
                    }
                    if( jsonobject.fieldDefs[i].Type.split( "(" ).length === 2 ) {
                        let tmp = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" );
                        if( tmp[1].indexOf( "unsigned" ) > -1 ) tmpUnsigned = true;
                    }
                    switch( tmpType ) {
                        case "tinyint":
                            if( tmpUnsigned ) {
                                tmpMaxVal = 511;
                                tmpMinVal = 0;
                                tmpLength = 3;
                            } else {
                                tmpMaxVal = 255;
                                tmpMinVal = -256;
                                tmpLength = 4;
                            }
                        break;
                        case "int":
                            if( tmpUnsigned ) {
                                tmpMaxVal = 24294967295;
                                tmpMinVal = 0;
                                tmpLength = 3;
                            } else {
                                tmpMaxVal = 2147483647;
                                tmpMinVal = -2147483648;
                                tmpLength = 11;
                            }
                        break; 
                        case "bigint": 
                            if( tmpUnsigned ) {
                                tmpMaxVal = 18446744073709551615
                                tmpMinVal = 0;
                                tmpLength = ( "" + tmpMaxVal ).length;
                            } else {
                                tmpMaxVal = 9223372036854775807 ;
                                tmpMinVal = -9223372036854775808;
                                tmpLength = ( "" + tmpMinVal ).length;
                            }     
                        break;
                        case "date":
                        case "datetime":
                            tmpLength = 19;
                        break;
                        case "time":
                            tmpLength = 8;
                        break;
                        case "text":
                        case "blob":
                            tmpLength = 655354;
                        break;
                        case "json":
                        case "longtext":
                            tmpLength = 294967295
                        break;
                        case "varchar": 
                        case "bit": 
                                // content
                              //console.log(tmpLength) ; 
                        break;
                        default:
                            tmpLength = tmpLength.substring(0, tmpLength.length - 1 );                    
                        break;
                    }
                    fr.opt.fields.push( new Field({dVar: fr.opt.dVar + ".opt.fields." + i, id: "fields_" + i, maxLength: tmpLength, maxValue: tmpMaxVal, minValue: tmpMinVal }))
                    i += 1;
                }
            break;
            default:
                // content
        
            break;
        }
    }
    init = function ( fieldDefinitions ) {
        if( typeof fieldDefinitions === "undefined" ) {
            let data = {};
            data.dVar = this.opt.dVar;
            data.command = "getFielddefinitions";
            data.table = this.opt.table;
            nj().fetchPostNew("library/php/ajax_dataform20.php", data, this.evaluateRS)        
        } else {
            // false    
        }
    }
}
