class Recordset {                    // class for DataForm2.0
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
        let l, i, tmp;
        let jsonobject;
        if( typeof data === "string" ) {
            jsonobject = JSON.parse( data );
        } else {
            jsonobject = data;
        }
        if( !isJ( jsonobject ) ) {
            throw "kein JSON-Objekt übergeben";
        }
        //console.log( jsonobject );
        var fr = window[ jsonobject.dVar ];
        console.log( fr );
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
                        //console.log( jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" ) );
                        switch( tmpType ) {
                            case "bigint":
                            case "int":
                            case "tinyint":
                            case "boolean":
                                // content
                                tmpSize = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" )[0]
                            break;
                            case "varchar": 
                            case "bit": 
                                    // content
                                //console.log( jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" )[0] );
                                tmpLength = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" )[0]
                            break;
                            default:
                                // content
                                tmpSize = undefined;
                            break;
                        }
                    }
/*
                    if( jsonobject.fieldDefs[i].Type.indexOf("(") > -1 && jsonobject.fieldDefs[i].Type.split( "(" ).length > 0 ) {
                        let tmp = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" );
                    } else {
                        let tmp = [];
                    }
*/
                    if( jsonobject.fieldDefs[i].Type.split( "(" ).length === 2 ) {
                        let tmp = jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" );
                        console.log( jsonobject.fieldDefs[i].Type.split( "(" )[1].split( ")" ), tmp );
                        if( tmp[1].indexOf( "unsigned" ) > -1 ) tmpUnsigned = true;
                    }
                    //console.log( tmp );
/*
                    if( tmp.length === 2 ) {
                        let i = tmp[1].indexOf( "unsigned" )
                        if( i > -1 ) {
                            tmpUnsigned = true;
                        }
                    }
*/
                    //console.log( tmpSize );
                    switch( tmpType ) {
                        case "tinyint":
                            if( tmpUnsigned ) {
                                // true
                                tmpMaxVal = 511;
                                tmpMinVal = 0;
                                tmpLength = 3;
                            } else {
                                // false    
                                tmpMaxVal = 255;
                                tmpMinVal = -256;
                                tmpLength = 4;
                            }                            

                        break;
                        case "int":
                            if( tmpUnsigned ) {
                                // true
                                tmpMaxVal = 24294967295;
                                tmpMinVal = 0;
                                tmpLength = 3;
                            } else {
                                // false    
                                tmpMaxVal = 2147483647;
                                tmpMinVal = -2147483648;
                                tmpLength = 11;
                            }                            

                        break; 
                        case "bigint": 
                            if( tmpUnsigned ) {
                                // true
                                tmpMaxVal = 18446744073709551615
                                tmpMinVal = 0;
                                tmpLength = ( "" + tmpMaxVal ).length;
                            } else {
                                // false    
                                tmpMaxVal = 9223372036854775807 ;
                                tmpMinVal = -9223372036854775808;
                                tmpLength = ( "" + tmpMinVal ).length;
                            }                            
                        break;
                        case "date":
                        case "datetime":
                            // content
                            tmpLength = 19;
                        break;
                        case "time":
                            // content
                            tmpLength = 8;
                        break;
                        case "text":
                        case "blob":
                            // content
                            tmpLength = 655354;
                        break;
                        case "json":
                        case "longtext":
                            // content
                            tmpLength = 294967295
                        break;
                        case "varchar": 
                        case "bit": 
                                // content
                              //console.log(tmpLength) ; 
                        break;
                        default:
                            // content
                            tmpLength = tmpLength.substring(0, tmpLength.length - 1 );
                    
                        break;
                    }
                    console.log( fr, tmpType, tmpLength, tmpMaxVal, tmpMinVal );
                    fr.opt.fields.push( new Field({dVar: fr.opt.dVar + ".opt.fields[" + i + "]", id: "fields_" + i, maxLength: tmpLength, maxValue: tmpMaxVal, minValue: tmpMinVal }))
                    i += 1;
                }
//            console.log( fr.opt.fields );
            break;
            default:
                // content
        
            break;
        }
    }
    init = function ( fieldDefinitions ) {
        // content
        if( typeof fieldDefinitions === "undefined" ) {
            // true
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
