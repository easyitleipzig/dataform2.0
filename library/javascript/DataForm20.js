//javascript
const DIV_UPLOAD_HTML = `<div id="[dVar]_tmpUploadId" class="divUploadFile">
    <div id="[dVar]_tmpDivUploadFormErrorText" class="fileUploadErrorText">Datei auswählen und "Öffnen" wählen.</div>
    <div>
        <label id="[dVar]_tmpLabelUpload" class="fileUploadLabel">Hochladen</label>
    </div
    <input type="file" id="[dVar]_tFUFile">
</div>`;
innerCheckValidity = function( field ) {
    console.log( field );    
}

class DataForm {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            dVar:                               undefined,  // necessary - var of field object
            id:                                 undefined,  // id of field object; if not isset id is dVar
            target:                             undefined,  // id of target element; if not isset target is body
            fields:                             undefined,  // field list divided by ","; if not isset all fields
            fieldDefinitions:                   [],         // object array of field definitions
            additionalFieldDefs:                [],         // object array of additional field definitions
            primaryKey:                         [],         // object array of field definitions
            recordsets:                         [],         // object array of recordsets
            currentRecord:                      1,
            orderBy:                            "",
            whereClausel:                       "",
            pageNumber:                         0,
            countPerPage:                       undefined,          // if is 0 all records
            hasNew:                             true,
            addPraefix:                         "",
            addClasses:                         "cRecordset",
            divUpload:                          new DialogDR( { dVar: param.dVar + ".opt.divUpload", title: "Datei laden", innerHTML: DIV_UPLOAD_HTML.replaceAll( "[dVar]", param.dVar ) } ),
            rootPath:                           "library",
            tFUTargetPath:                      "../documents/", // tUF means tmpFileUpload
            tFUTargetFileName:                  "",
            tFUTargetUpdateElementId:           false,
            tFUTargetElementId:                 "",
            tFUTargetElementAttr:               "value",
            tFUTargetElementLinkText:           "Link",
            tFUTargetElementLinkTarget:         "_blank",
            tFURepalce:                         true,
            tFUOldFileName:                     "",
            tFUWidthTimestamp:                  false,
            tFUUpdateTable:                     false,
            tFUTable:                           "",
            tFUField:                           "",
            tFUFieldIndex:                      "",
        }
        let tmpId = "",
            tmpClasses = "",
            tmpEl = {}, 
            tmpEls;
        Object.assign( this.opt, param );
        data = {};
        data.command = "getFielddefinitions";
        data.dVar = this.opt.dVar;
        data.table = this.opt.table;
        data.fields = this.opt.fields;
        //nj().fetchPostNew("library/php/ajax_dataform20.php", data, this.evaluateDF)        
        //nj().post("library/php/ajax_dataform20.php", data, this.evaluateDF)        
        nj( "#" + this.opt.dVar + "_tFUFile" ).on( "change", function( args ) {
            console.log( nj( this ).gRO() );
            nj( this ).gRO().uploadFile();    
        }  );
    }
    evaluateDF = function ( data ) {
        // content
        let jsonobject, l, i, tmp;
        if( typeof data === "string" ) {
            jsonobject = JSON.parse( data );
        } else {
            jsonobject = data;
        }
        if( !nj().isJ( jsonobject ) ) {
            throw "kein JSON-Objekt übergeben";
        }
        console.log( jsonobject );
        var df = window[ jsonobject.dVar ];
        switch( jsonobject.command ) {
            case "getFieldDefinitions":
                // content
                let l = jsonobject.fieldDefs.length;
                let i = 0;
                while( i < l ) {
                    //console.log( jsonobject.fieldDefs[i] );
                    //let field = new Field( { id: jsonobject.fieldDefs[i].Field, maxLength: jsonobject.fieldDefs[i].Field } );
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
                    console.log( tmpType, tmpUnsigned );
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
                                tmpLength = 10;
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
                        case "decimal":
                            tmpLength = 19;
                        break;
                        case "float":
                            if( tmpUnsigned ) {
                                tmpMaxVal = 3.402823466e38
                                tmpMinVal = 1.175494351e-38 ;
                                tmpLength = ( "" + tmpMaxVal ).length;
                            } else {
                                tmpMaxVal = 3.402823466e+38;
                                tmpMinVal = -1.175494351e-38;
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
                    df.opt.fieldDefinitions.push( { field: jsonobject.fieldDefs[i].Field, maxLength: tmpLength, maxValue: tmpMaxVal, minValue: tmpMinVal } );
                    i += 1;
                }
                df.opt.primaryKey = jsonobject.primaryKey;
                df.getRecords();
            break;
            case "getRecords":
                console.log( df, jsonobject );
                df.prepareRecords( jsonobject );
            break;
            default:
                // content
        
            break;
        }
    }
    resolveFileUpload = async function( targetPath = this.opt.tFUTargetPath, targetFileName = this.opt.tFUTargetFileName, targetElementId = this.opt.tFUTargetElementId, targetElementAttr = this.opt.tFUTargetElementAttr, timeStamp = new Date().getTS(), replace = this.opt.tFUReplace, oldFileName = this.opt.tFUOldFileName, withTimeStamp = this.opt.tFUWidthTimestamp, path = "library/php/upload_dataform20.php", fileObject = nj().els( "#" + this.opt.dVar + "_tFUFile").files[0], cb = this.afterSuccessFileUpload( data, targetPath, targetFileName, timeStamp, targetElementId, targetElementAttr, withTimeStamp, df = this ) ) {
        let formData = new FormData();
        console.log( timeStamp );
        formData.append("file", fileObject );
        formData.append("targetPath", targetPath );
        formData.append("replace", replace );
        formData.append("oldFileName", oldFileName );
        formData.append("timestamp", timeStamp )
        formData.append("withTimeStamp", withTimeStamp )
        formData.append("UpdateTargetElement", this.opt.tFUTargetUpdateElementId );
        formData.append("targetElementAttr", targetElementAttr );
        formData.append("targetElementAttr", targetElementAttr );
        formData.append("targetElementAttr", targetElementAttr );
        formData.append("targetElementAttr", targetElementAttr );
        if( targetFileName === "" ) {
            this.opt.tFUTargetFileName = fileObject.name
        }
        await fetch( path , {
          method: "POST", 
          body: formData
        })
      .then( data => { 
        console.log( data );
        cb;
      } )
      .catch( data => { 
        console.log(data);
      })   
    }
    afterSuccessFileUpload = function( data, targetPath, targetFileName, timeStamp, targetElementId, targetElementAttr, withTimeStamp, df ) {
        dMNew.show( {title: "Dateiupload", type: true, text: "Die Datei wurde erfolgreich übertragen.", variables: { dataform: df }, buttons:[{title:"Schliessen", action: function() {
            nj( this ).Dia().opt.variables.dataform.opt.divUpload.hide();
            let opts = nj( this ).Dia().opt.variables.dataform.opt;
            console.log( nj( this ).Dia().opt.variables.dataform.opt );
            dMNew.hide();
            switch( opts.tFUTargetElementAttr ) {
                case "value":
                    nj( targetElementId ).v( targetPath.replace( "..", opts.rootPath ) + opts.tFUTargetFileName );
                break;
                case "src":
                    nj( targetElementId ).atr( "src", targetPath.replace( "..", opts.rootPath ) + opts.tFUTargetFileName );
                break;
            case "bckg":
                    nj( targetElementId ).sty( "background-image", "url(" + targetPath.replace( "..", opts.rootPath ) + opts.tFUTargetFileName + ")" );
                break;
            case "href":
                    nj( targetElementId ).atr( "href", targetPath.replace( "..", opts.rootPath ) + opts.tFUTargetFileName );
                    nj( targetElementId ).atr( "target", opts.tFUTargetElementLinkTarget );
                    nj( targetElementId ).htm( opts.tFUTargetElementLinkText );
                break;
            }
        }}] } );
        console.log( data, targetPath, targetFileName, timeStamp, targetElementId, targetElementAttr, withTimeStamp, this.opt.rootPath, df );
        nj( targetElementId ).v( null );   
    }
    uploadFile = function() {
        this.resolveFileUpload();
    }
    showUploadDiv = function( acceptFileTypes = "*.*", tFUTargetFileName = "" ) {
        if( tFUTargetFileName !== "" ) {
            this.opt.tFUTargetFileName = tFUTargetFileName;
        }
        nj( "#" + this.opt.dVar + "_tFUFile" ).atr( "accept", acceptFileTypes );

        this.opt.divUpload.show();
    }
    getFieldDefinitions = function ( args ) {
        // content
        data = {};
        data.command = "getFieldDefinitions";
        data.dVar = this.opt.dVar;
        data.table = this.opt.table;
        data.fields = this.opt.fields;
        data.fieldDefinitions = this.opt.fieldDefinitions;
        nj().fetchPostNew("library/php/ajax_dataform20.php", data, this.evaluateDF);
    }
    getRecords = function ( args ) {
        // content
        data.command = "getRecords";
        data.dVar = this.opt.dVar;
        data.table = this.opt.table;
        data.primaryKey = this.opt.primaryKey;
        data.fields = this.opt.fields;
        data.fieldDefinitions = [];
        data.orderBy = this.opt.orderBy;
        data.whereClausel = this.opt.whereClausel;
        data.pageNumber = this.opt.pageNumber;
        data.countPerPage = this.opt.countPerPage;
        data.hasNew = this.opt.hasNew;
        nj().fetchPostNew("library/php/ajax_dataform20.php", data, this.evaluateDF);
    }
    prepareRecords = function ( data ) {
        // content
        let i, j, l, m, recordIndex, recordsets = [], records = [], field, tmp = [];
        l = data.records.length;
        i = 0;
        recordIndex = "";
        while( i < l ) {
            m = Object.keys( data.records[i] ).length;
            j = 0;
            records = [];
            this.opt.recordsets.push( new RecordSet( {dVar: this.opt.dVar + ".opt.recordsets." + i } ) );
            while( j < m ) {
                field = this.opt.fieldDefinitions.filter(character => {
                    return character.field === this.opt.fieldDefinitions[j].field;
                })[0];
                field.fieldDVar = ".opt.fields." + j;
                field.value = data.records[i][this.opt.fieldDefinitions[j].field]; 
                field.tabIndex = j;
                field.recordsetDVar = this.opt.recordsets[i].opt.dVar;
                field.dVar = this.opt.recordsets[i].opt.dVar + ".opt.fields." + j;
                if( typeof this.opt.additionalFieldDefs[j] !== "undefined" ) {
                    Object.assign( field, this.opt.additionalFieldDefs[j] );
                }
                this.opt.recordsets[i].opt.fields.push( new Field( field ) );
                j += 1;
            }
            recordsets.push( records );
            i += 1;
        }
        console.log( this.opt.recordsets );
    }
    init = function () {
        // content
        this.getFieldDefinitions();
    }
}
