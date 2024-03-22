//javascript
const DIV_UPLOAD_HTML = `<div id="[dVar]_tmpUploadId" class="divUploadFile">
    <div id="[dVar]_tmpDivUploadFormErrorText" class="fileUploadErrorText">Datei auswählen und "Öffnen" wählen.</div>
    <div>
        <label id="[dVar]_tmpLabelUpload" class="fileUploadLabel">Hochladen</label>
    </div
    <input type="file" id="[dVar]_tFUFile">
</div>`;
class DataForm {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            dVar:                               undefined,  // necessary - var of field object
            id:                                 undefined,  // id of field object; if not isset id is dVar
            target:                             document.body,  // id of target element; if not isset target is body
            fields:                             undefined,  // field list divided by ","; if not isset all fields
            title:                              undefined,  // title of dataform dialog
            fieldDefinitions:                   [],         // object array of field definitions
            primaryKey:                         [],         // object array of field definitions
            recordsets:                         [],         // object array of recordsets
            optionLists:                        [],         // object array of option lists for fields e.g. 
                                                            /*
                                                            [
                                                                {   
                                                                    field:"[selectfield1]", 
                                                                    options: '<value="1">[value 1]</option><value="2">[value 2]</option>..'
                                                                }, 
                                                                {   
                                                                    field:"[selectfield2]", 
                                                                    options: '<value="0">[value 0]</option><value="1">[value 1]</option>..'
                                                                }, 
                                                                ...
                                                            ]
                                                            */
            currentRecord:                      1,
            orderBy:                            "",
            whereClausel:                       "",
            pageNumber:                         0,
            countPerPage:                       undefined,          // if is 0 all records
            orderArray:                         [],
            filter:                             "",
            searchArray:                        [],
            hasNew:                             true,
            addPraefix:                         "",
            widthSave:                          true,
            widthDelete:                        true,
            dfHasLabel:                         true,
            validOnSave:                        false,
            baseClassRecordSet:                "cRecordset",
            addRSClasses:                       "",
            baseClassField:                     "cField",
            addFieldClasses:                    "",
            classButtonSize:                    "",
            autoOpen:                           true,
            formType:                           "html",
            divForm:                            undefined,
            divUpload:                          new DialogDR( { 
                                                    dVar: param.dVar + ".opt.divUpload", 
                                                    title: "Datei laden", 
                                                    innerHTML: DIV_UPLOAD_HTML.replaceAll( "[dVar]", param.dVar ) 
                                                } ),
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
            tmpEl, 
            tmpEls,
            tmpSearchString = "",
            searchWasGreaterThanTwo;
        Object.assign( this.opt, param );
        this.opt.id = "#" + this.opt.addPraefix + this.opt.id.substring( 1 );
        if( this.opt.formType === "html") {            
            if( !nj( this.opt.id ).isE() ) {
                tmpEl = nj().cEl( "div" );
                tmpEl.id = this.opt.id.substring( 1 );
                nj( this.opt.target ).aCh( tmpEl );
            }
        }
        tmpEl = nj().cEl( "div" );
        tmpEl.id = this.opt.id.substring( 1 ) + "_headline";
        nj( this.opt.id ).aCh( tmpEl );
        tmpEl = nj().cEl( "div" );
        tmpEl.id = this.opt.id.substring( 1 ) + "_data";
        nj( this.opt.id ).aCh( tmpEl );
        this.showDfHeadline();
        if( this.opt.searchArray.length > 0 ) {
            this.showSearchHeadline();
        }
        data = {};
        data.command = "getFielddefinitions";
        data.dVar = this.opt.dVar;
        data.table = this.opt.table;
        data.fields = this.opt.fields;
        nj( "#" + this.opt.dVar + "_tFUFile" ).on( "change", function( args ) {
            console.log( nj( this ).gRO() );
            nj( this ).gRO().uploadFile();    
        }  );
    }
    evaluateDF = function ( data ) {
        // content
        let jsonobject, l, i, m, j, tmp, decVal, strVal;
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
                l = df.opt.fieldDefinitions.length;
                i = 0;
                let field, options;
                while( i < l ) {
                    field = nj().fOA( jsonobject.fieldDefs, "Field", df.opt.fieldDefinitions[ i ].field )[0];
                    if( typeof field !== "undefined" ) {
                        Object.assign( df.opt.fieldDefinitions[ i ], df.buildLengthProps( field ) );
                    }
                    options = nj().fOA( df.opt.optionLists, "field", df.opt.fieldDefinitions[ i ].field )[0];
                    if( typeof options !== "undefined" ) {
                        df.opt.fieldDefinitions[ i ].options = options.options;
                    }
                    i += 1;
                }
                df.opt.primaryKey = jsonobject.primaryKey;
                df.getRecords();
            break;
            case "getRecords":
                df.prepareRecords( jsonobject );
            break;
            case "saveRecordset":

            break;
            default:
                // content
        
            break;
        }
    }
    buildLengthProps = function ( fieldProps ) {
        // content
        let field = {}, decVal, strVal, i, l;
        //console.log( fieldProps );
        field.title = fieldProps.Comment;
        field.default = fieldProps.Default;
        fieldProps.Null === "NO" ? field.canBeNull = false: field.canBeNull = true;
        fieldProps.Key === "Uni" || fieldProps.Key === "Pri" ? field.isUnique = false: field.isUnique = true;
        fieldProps.Extra.indexOf( "auto_increment" ) > - 1 ? field.isAutoInc = true: field.isAutoInc = false;
        field.maxValue = "";
        field.minValue = "";
        let tmpType = fieldProps.Type.split( "(" )[0];
        let tmpLength = fieldProps.Type.split( "(" )[1];
        let tmpSize = undefined;
        let tmpMinVal = undefined;
        let tmpMaxVal = undefined;
        let tmpUnsigned = false;
        if( fieldProps.Type.split( "(" ).length === 2 ) {
            let tmp = fieldProps.Type.split( "(" )[1].split( ")" );
            tmp[1].indexOf( "unsigned" ) > -1 ? tmpUnsigned = true:  tmpUnsigned = false;
        }
        switch( tmpType ) {
            case "tinyint":
                if( tmpUnsigned ) {
                    field.maxValue = 511;
                    field.minValue = 0;
                    field.maxLength = 3;
                } else {
                    field.maxValue = 255;
                    field.minValue = -256;
                    field.maxLength = 4;
                }            
            break;
            case "mediumint":
                field.maxLength = 8;
                if( tmpUnsigned ) {
                    field.maxValue = 16777215;
                    field.minValue = 0;
                 } else {
                    field.maxValue = 8388607;
                    field.minValue = -8388608;
                }            
            break;
            case "int":
                field.maxLength = 11;
                if( tmpUnsigned ) {
                    field.maxValue = 24294967295;
                    field.minValue = 0;
                } else {
                    field.maxValue = 2147483647;
                    field.minValue = -2147483648;
                }
            break;
            case "bigint":
                field.maxLength = 20;
                if( tmpUnsigned ) {
                    field.maxValue = 18446744073709551615
                    field.minValue = 0;
                } else {
                    field.maxValue = 9223372036854775807;
                    field.minValue = -9223372036854775808;
                }           
            break;
            case "decimal":
                let decVal = tmpLength.substring(0, tmpLength.length - 1 ).split( "," );
                l = parseInt( decVal[0] );
                i = 0;
                let strVal = "";
                while( i < l ) {
                    strVal += "9";
                    i += 1;
                }
                strVal += ".";
                l = parseInt( decVal[1] );
                i = 0;
                while( i < l ) {
                    strVal += "9";
                    i += 1;
                }
                if( tmpUnsigned ) {
                    field.maxValue = parseFloat( strVal );
                    field.minValue = 0;
                    field.maxLength = parseInt( decVal[0]) + parseInt( decVal[1]) + 1;
                } else {
                    field.maxValue = parseFloat( strVal );
                    field.minValue = field.maxValue * - 1;
                    field.maxLength = parseInt( decVal[0]) + parseInt( decVal[1]) + 2;
                }
            break;
            case "float":
                if( tmpUnsigned ) {
                    field.maxValue = 3.402823466e38;
                    field.minValue = 1.175494351e-38 ;
                    field.maxLength = ( "" + tmpMaxVal ).length;
                } else {
                    field.maxValue = 3.402823466e+38;
                    field.maxValue = -1.175494351e-38;
                    field.maxValue = ( "" + tmpMinVal ).length;
                }     
            break;
            case "double":
                if( tmpUnsigned ) {
                    field.maxValue = Infinity;
                    field.minValue = 0;
                    field.maxLength = 16;
                } else {
                    field.maxValue = Infinity;
                    field.minValue = -Infinity;
                    field.maxLength = 17;
                }     
            break;
            case "date":
                field.maxLength = 10;
            break;
            case "datetime":
                field.maxLength = 19;
            break;
            case "time":
                field.maxLength = 8;
            break;
            case "tinytext":
                field.maxLength = 255;
            break;
            case "text":
            case "blob":
                field.maxLength = 655354;
            break;
            case "mediumtext":
            case "mediumblob":
                field.maxLength = 16777215;
            break;
            case "longtext":
            case "longblob":
                field.maxLength = 4294967295;
            break;
            case "json":
            case "longtext":
                field.maxLength = 294967295
            break;
            case "varchar":
            case "bit":
                field.maxLength = parseInt( tmpLength );
            break;
            default:
            
            break;
        }
        return field;

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
    showDfHeadline = function() {
        if( this.opt.dfHasLabel ) {
            let el;
            let l = this.opt.fieldDefinitions.length;
            let i = 0;
            el = nj().cEl( "div" );
            nj( el ).sDs( "dvar", this.opt.dVar );
            el.id = this.opt.id.substring( 1 ) + "_orderline"
            nj( this.opt.id + "_headline" ).aCh( el );
            while ( i < l ) {
                el = nj().cEl( "div" );
                el.id = this.opt.addPraefix + "hl_" + this.opt.fieldDefinitions[i].field;
                if( typeof this.opt.fieldDefinitions[i].label === "undefined" || this.opt.fieldDefinitions[i].label === "" ) {
                    nj( el ).htm( "&nbsp;" );
                } else {
                    if( this.opt.orderArray.indexOf( this.opt.fieldDefinitions[i].field ) > -1) {
                        nj( el ).htm( this.opt.fieldDefinitions[i].label + "&nbsp;♦" );
                    } else {
                        nj( el ).htm( this.opt.fieldDefinitions[i].label );    
                    }                    
                }

                nj( el ).sDs( "field", this.opt.fieldDefinitions[i].field );
                nj( this.opt.id + "_orderline" ).aCh( el );
                if( this.opt.orderArray.indexOf( this.opt.fieldDefinitions[i].field ) > -1 ) {
                nj( "#" + el.id ).on( "click", function( args ) {
                    console.log( nj(this).htm(), this );
                    if( nj(this).htm().slice( - 1 ) == "▼" ) {
                        nj("#" + this.id ).htm( nj(this).htm().substring( 0, nj(this).htm().length - 1 ) + "▲" );
                        console.log( nj( this ).gRO().opt.orderBy );
                        nj( this ).gRO().opt.orderBy = nj( this ).gRO().opt.orderBy.replace( " " + nj(this).ds("field") + " ASC,", "" );
                        nj( this ).gRO().opt.orderBy += " " + nj(this).ds("field") + " DESC,"
                        nj( this ).gRO().getRecords();
                        return;
                    }
                    if( nj(this).htm().slice( - 1 ) == "▲" ) {        
                        nj(this).htm( nj(this).htm().substring( 0, nj(this).htm().length - 1 ) + "♦" );
                        nj( this ).gRO().opt.orderBy = nj( this ).gRO().opt.orderBy.replace( " " + nj(this).ds("field") + " DESC,", "" );
                        nj( this ).gRO().getRecords();
                    }
                    if( nj(this).htm().slice( - 1 ) == "♦" ) {        
                        nj(this).htm( nj(this).htm().substring( 0, nj(this).htm().length - 1 ) + "▼" );
                        console.log( " " + nj(this).ds("field") + ' ASC,' );
                        nj( this ).gRO().opt.orderBy += " " + nj(this).ds("field") + (" ASC,");
                        nj( this ).gRO().getRecords();
                    }
                });
                }                   
                i += 1;
            }
        }        
    }
    showSearchHeadline = function() {
        let el, field;
        el = nj().cEl( "div" );
        el.id = this.opt.id.substring( 1 ) + "_searchline";
        nj( el ).sDs( "dvar", this.opt.dVar );
        nj( this.opt.id + "_headline" ).aCh( el );
        let l = this.opt.searchArray.length;
        let i = 0;
        while( i < l ) {
            field = new Field( {
                id: "#" + this.opt.addPraefix + "search_" + this.opt.searchArray[i].field,
                type: this.opt.searchArray[i].type,
                addAttr: this.opt.searchArray[i].addAttr + " data-field='" + this.opt.searchArray[i].field + "'",
                options: this.opt.searchArray[i].options,
                dVar: this.opt.dVar,    
            } );
            nj( this.opt.id + "_searchline" ).aCh( field.getField()[0] );
            nj( field.opt.id ).v( this.opt.searchArray[i].value );
            if( this.opt.searchArray[i].type === "select" ) {
                nj( field.opt.id ).on( "change", function( args ) {
                    console.log( nj( this ).gSV() );
                    nj( this ).Dia().getSearchString();   
                } );    
            }
            if( this.opt.searchArray[i].type === "input_text" ) {
                nj( field.opt.id ).on( "keyup", function() {
                    if( nj( this ).v().length < 3 && this.searchWasGreaterThanTwo ) {
                        nj( this ).v("");
                        this.searchWasGreaterThanTwo = false;    
                        nj( this ).Dia().getSearchString();
                    } else {
                        if( nj( this ).v().length > 2 ) {
                            this.searchWasGreaterThanTwo = true;
                            nj( this ).Dia().getSearchString();
                        }
                    }

                } );    
            }
            i += 1;
        }
    }
    getSearchString = function( args ) {
        let l = this.opt.searchArray.length;
        let i = 0;
        let searchString = "where ";
        if( this.opt.filter !== "" ) {
            searchString += this.opt.filter + " AND ";
        }
        while ( i < l ) {
            if( this.opt.searchArray[i].type === "input_text" ) {
                if( nj( "#" + this.opt.addPraefix + "search_" + this.opt.searchArray[i].field ).v().length > 1 ) {
                    searchString += this.opt.searchArray[i].field + " like '" + nj( "#" + this.opt.addPraefix + "search_" + this.opt.searchArray[i].field ).v() + "%' AND ";    
                } else {
                    searchString += "";
                }
            }
            if( this.opt.searchArray[i].type === "select" ) {
                if( nj( "#" + this.opt.addPraefix + "search_" + this.opt.searchArray[i].field ).gSV().join( "," ) !== ">-1" ) {
                    searchString += this.opt.searchArray[i].field + " = '" + nj( "#" + this.opt.addPraefix + "search_" + this.opt.searchArray[i].field ).gSV().join( "," ) + "' AND ";    
                } else {
                    searchString += "";
                }
                
            }
            i += 1;
        }
        this.opt.whereClausel = searchString.substring( 0, searchString.length - 5 );
        this.getRecords();
    }
    checkValidity = function( fieldId ) {

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
        let orderBy = "";
        data.command = "getRecords";
        data.dVar = this.opt.dVar;
        data.table = this.opt.table;
        data.primaryKey = this.opt.primaryKey;
        data.fields = this.opt.fields;
        data.fieldDefinitions = [];
        if( this.opt.orderBy !== "" ) {
            orderBy = this.opt.orderBy.substring( 0, this.opt.orderBy.length - 1 );    
        }
        data.orderBy = orderBy;
        data.whereClausel = this.opt.whereClausel;
        data.pageNumber = this.opt.pageNumber;
        data.countPerPage = this.opt.countPerPage;
        data.hasNew = this.opt.hasNew;
        data.primaryKey = this.opt.primaryKey;
        nj().fetchPostNew("library/php/ajax_dataform20.php", data, this.evaluateDF);
    }
    prepareRecords = function ( data ) {
        // content
        this.opt.recordsets = [];
        let i, j, l, m, field, tmpField = {}, primaryKeyValue, tmpFieldType;
        l = data.records.length;
        this.opt.countRecords = l;
        i = 0;
        while( i < l ) {
            this.opt.recordsets.push( new RecordSet( {
                dVar: this.opt.dVar + ".opt.recordsets." + i, 
                id: "#" + this.opt.addPraefix + this.opt.id.substring( 1 ) + "RS" + "_" + data.records[ i ][ this.opt.primaryKey ], 
                target: this.opt.id + "_data", 
                table: this.opt.table,
                baseClass: this.opt.baseClassRecordSet,
                addClasses: this.opt.addRSClasses,
                baseClassField: this.opt.baseClassField,
                classButtonSize: this.opt.classButtonSize,
            } ) );
            m = this.opt.fieldDefinitions.length;
            j = 0;
            while( j < m ) {
                field = this.opt.fieldDefinitions[j];
                field.id = "#" + this.opt.addPraefix + field.field + "_" + data.records[ i ].primaryKey;
                if( typeof data.records[i][this.opt.fieldDefinitions[j].field] !== "undefined" ) {
                    field.value = data.records[i][this.opt.fieldDefinitions[j].field];
                }
                field.tabIndex = j;
                field.table = this.opt.table;
                field.target = this.opt.recordsets[i].opt.id;
                field.dVar = this.opt.dVar + ".opt.recordsets." + i + ".opt.fields." + j;
                field.validOnSave = this.opt.validOnSave;
                field.classButtonSize = this.opt.classButtonSize;
                field.onBlur = function( args ) {
                    console.log( nj( this ).Dia() );    
                }
                this.opt.recordsets[i].opt.fields.push( new Field( field ) );
                j += 1;
            }
            if( this.opt.widthSave ) {
                tmpField.id = this.opt.addPraefix + "RS_save_" + data.records[ i ][ this.opt.primaryKey ];
                tmpField.value = 0;
                tmpField.label = "Datensatz speichern";
                tmpField.baseClass = "";
                tmpField.addClasses = "cFieldSave";
                tmpField.classButtonSize = this.opt.classButtonSize;
                tmpField.onClick = function ( args ) {
                    nj( this ).Dia( "dvar", 4 ).saveRecordset( nj( this ).gRO(), nj( this ).Dia( "dvar", 5 ), this.id.split("_")[this.id.split("_").length - 1] );
                }
                tmpField.tabIndex = j;
                tmpFieldType = { type: "button" }
                //console.log( tmpField );
                tmpField.table = this.opt.table;
                tmpField.target = this.opt.recordsets[i].opt.id;
                tmpField.dVar = this.opt.dVar + ".opt.recordsets." + i + ".opt.fields." + j;
                tmpField.value = "&nbsp;";
                tmpField.title = "Datensatz speichern"
                Object.assign( tmpField, tmpFieldType );
                this.opt.recordsets[i].opt.fields.push( new Field( tmpField ) );
            }
            if( this.opt.widthDelete ) {
                tmpField.id = this.opt.addPraefix + "RS_delete_" + data.records[ i ][ this.opt.primaryKey ];
                tmpField.value = 0;
                tmpField.label = "Datensatz löschen";
                tmpField.baseClass = "";
                tmpField.addClasses = "cFieldDelete";
                tmpField.classButtonSize = this.opt.classButtonSize;
                tmpField.onClick = function ( args ) {
                    nj( this ).Dia( "dvar", 4 ).deleteRecordset( nj( this ).gRO(), nj( this ).Dia( "dvar", 5 ), this.id.split("_")[this.id.split("_").length - 1] );
                }
                tmpField.tabIndex = j;
                tmpFieldType = { type: "button" }
                //console.log( tmpField );
                tmpField.table = this.opt.table;
                tmpField.target = this.opt.recordsets[i].opt.id;
                tmpField.dVar = this.opt.dVar + ".opt.recordsets." + i + ".opt.fields." + ( j + 1 );
                tmpField.value = "&nbsp;";
                tmpField.title = "Datensatz löschen"
                Object.assign( tmpField, tmpFieldType );
                this.opt.recordsets[i].opt.fields.push( new Field( tmpField ) );
            }
            i += 1;
        }
        

        if( this.opt.hasNew ) {
            this.opt.recordsets.push( new RecordSet( {
                dVar: this.opt.dVar + ".opt.recordsets." + i, 
                id: "#" + this.opt.addPraefix + this.opt.id.substring( 1 ) + "RS" + "_new", 
                target: this.opt.id + "_data", 
                table: this.opt.table,
                baseClass: this.opt.baseClassRecordSet,
                addClasses: this.opt.addRSClasses,
                baseClassField: this.opt.baseClassField,
                classButtonSize: this.opt.classButtonSize,
            } ) );
            m = this.opt.fieldDefinitions.length;
            j = 0;
            while ( j < m ) {
                field = this.opt.fieldDefinitions[j];
                field.id = "#" + this.opt.addPraefix + field.field + "_new";
                if( typeof this.opt.fieldDefinitions[j].default !== "undefined" && this.opt.fieldDefinitions[j].default != null ) {
                    field.value = this.opt.fieldDefinitions[j].default;
                } else {
                    field.value = "";
                }

                field.tabIndex = j;
                field.table = this.opt.table;
                field.target = this.opt.recordsets[i].opt.id;
                field.dVar = this.opt.dVar + ".opt.recordsets." + i + ".opt.fields." + j;
                field.validOnSave = this.opt.validOnSave;
                field.classButtonSize = this.opt.classButtonSize;
                this.opt.recordsets[i].opt.fields.push( new Field( field ) );
                j += 1;
            }
            if( this.opt.widthSave ) {
                tmpField.id = this.opt.addPraefix + "RS_save_new";
                tmpField.value = 0;
                tmpField.label = "Datensatz speichern";
                tmpField.baseClass = "";
                tmpField.addClasses = "cFieldSave";
                tmpField.classButtonSize = this.opt.classButtonSize;
                tmpField.onClick = function ( args ) {
                    nj( this ).Dia( "dvar", 4 ).saveRecordset( nj( this ).gRO(), nj( this ).Dia( "dvar", 5 ), this.id.split("_")[this.id.split("_").length - 1] );
                }
                tmpField.tabIndex = j;
                tmpFieldType = { type: "button" }
                //console.log( tmpField );
                tmpField.table = this.opt.table;
                tmpField.target = this.opt.recordsets[i].opt.id;
                tmpField.dVar = this.opt.dVar + ".opt.recordsets." + i + ".opt.fields." + j;
                tmpField.value = "&nbsp;";
                tmpField.title = "Datensatz speichern"
                Object.assign( tmpField, tmpFieldType );
                this.opt.recordsets[i].opt.fields.push( new Field( tmpField ) );
            }
            this.buildNewRecord();    
        }
        if( this.opt.autoOpen ) {
            this.showRecordSets();
        }
    }
    buildNewRecord = function () {
        let l = this.opt.fieldDefinitions.length;
        let i = 0;
        while( i < l ) {
//            console.log(  this.opt.fieldDefinitions[ i ] );
            i += 1;
        }
    }
    showRecordSets = function () {
        nj( this.opt.id + "_data" ).htm( "" );
        let l = this.opt.recordsets.length;
        let i = 0;
        while( i < l ) {
            this.opt.recordsets[i].getRecord();
            i += 1;
        }
    }
    init = function () {
        // content
        if( this.opt.filter !== "" ) {
            this.opt.whereClausel = " where " + this.opt.filter;
        }

        this.getFieldDefinitions();
    }
}
