//javascript
"use strict";
const DIFF_PAGINATION = 2;
const SELECT_CHECKBOX_HTML = '<option value=">-1" selected>alle</option><option value="1">Ja</option><option value="0">Nein</option>';
const PATH_CSS_DATAFORM = "library/css/";
const FORM_UPLOAD = "<form id=\"df_uploadForm\"><input id=\"df_loadFiles\" class=\"custom-file-input\" type=\"file\" multiple accept=\"\" form=\"df_uploadForm\" data-dVar=\"[dVar]\"></form>";
var JO, tmpSearchString, dfCurrentRecord;
async function uploadDataFormFile( df, el, rootPath, targetPath ) {
    let formData = new FormData();
    const files = el.files;
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        // add timestamp to file name
        file = getFileExtAndName( file ).Name + "_" + new Date.getTS() + "." + getFileExtAndName( file ).Ext;
        formData.append( 'files[]', file );
    }
    formData.append("rootPath", rootPath );
    formData.append("targetPath", targetPath );
    // Uses browser's built in Fetch API - you can replace this with jQuery or whatever you choose.
    fetch("library/php/upload_dataform.php", {
        method: 'POST',
        body: formData
    }).then(response => {
        console.log(response);
        if( response.status == 200 ) {
            let test = window[fr].opt.dFR + ".sendData( 'showContent', '" + window[fr].opt.path + "')";
            dMNew.show({ title: "Upload", type: true, text: "Die Daten wurden erfolgreich übertragen.", buttons: [{title: "Okay", action: function(){ dMNew.hide(); currentFr.sendData("showContent", currentFr.opt.path ) } }]}  );
        } else {
            dMNew.show({ title: "Upload", type: false, text: "Beim Upload der Datei(en) sind Fehler aufgetreten." } );

        }
    });
}
var evaluateDataFormNew = function( data ) {
    let df, els, l, i;
    console.log( data );
    let jsonobject;
    if( typeof data === "string" ) {
        jsonobject = JSON.parse( data );
    } else {
        jsonobject = data;
    }
    if( !isJ( jsonobject ) ) {
        throw "kein JSON-Objekt übergeben";
    }
    console.log( jsonobject );
    JO = jsonobject;
    if( typeof jsonobject.dVar !== "undefined" ) df = window[ jsonobject.dVar ];
    console.log( df );
    switch( jsonobject.command ) {
        case "initForm":

        break;
        case "showRecordList":
            if( jsonobject.success ) {
                let tCl = nj( df.opt.id + "_box" ).hCl( "boxHide");
                if( !tCl ) {
                    const listItem = nj().els( "#" + df.opt.fieldPraefix + "_div_data" );
                    const newItem = document.createElement('div');
                    newItem.id = df.opt.fieldPraefix + "_div_data";
                    newItem.innerHTML = jsonobject.html;
                    listItem.parentNode.replaceChild(newItem, listItem);
                    dMNew.hide();
                } else {
                    df.opt.divVar.show( { innerHTML:"<div id='" +  df.opt.fieldPraefix + "_div_headline'></div><div id='" +  df.opt.fieldPraefix + "_div_data'>" + jsonobject.html + "</div><div id='" +  df.opt.fieldPraefix + "_div_footer'></div>" } );                    
                }
                if( jsonobject.hasPag === "true" ) {
                    df.opt.countPages = jsonobject.countPages;
                    df.opt.currentPage = jsonobject.currentPage;
                    df.initPagination( jsonobject.currentPage, df.opt.countPages);
                }
                if( df.opt.type === "html" || ( df.opt.widthLabels && tCl ) ) {
                    let el = nj().cEl( "div" );
                    nj( el ).htm( jsonobject.labelLine );
                    nj( "#" + df.opt.fieldPraefix + "_div_headline" ).aCh( el );
                    if( df.opt.orderArray.length > 0 ) {
                        df.initOrder( df.opt.orderArray );
                    }
                }
                df.initSaveButton();
                df.initDeleteButton();
                df.initSearchfields();
                df.initSelectFields();
                df.initAddFieldActions( df );
                df.initRecPointer( df );
                df.initValidValues();
            }
            console.log( df.opt.boundFormArray );
            l = df.opt.boundFormArray.length;
            i = 0;
            while ( i < l ) {
                console.log( jsonobject.currentRecord, df.opt.boundFormArray[i] );
                i += 1;
            }
            df.replaceDoubleQuota();
            if( typeof df.opt.afterShow === "function" ) df.opt.afterShow();
        break;
        case "showRecordHtml":
            if( jsonobject.success ) {
                if( df.opt.parrentFormDVar !== "" ) {
                    console.log( df.opt.parrentFormDVar, window[ df.opt.parrentFormDVar ].ifCurrRecordInIds() );
                    if( !window[ df.opt.parrentFormDVar ].ifCurrRecordInIds() ) {
                        nj( "#" +  df.opt.fieldPraefix + "_div_data" ).htm( "" );    
                    } else {
                        nj( "#" +  df.opt.fieldPraefix + "_div_data" ).htm( jsonobject.html );
                    }
                }
                if( df.opt.parrentFormDVar !== "" ) {
                    if( typeof window[ df.opt.parrentFormDVar ].opt.currentRecord === "undefined" ) {
                        console.log( window[ df.opt.parrentFormDVar ].ifCurrRecordInIds() );
                        nj( "#" +  df.opt.fieldPraefix + "_div_data" ).htm( "" );
                    } else {
                        console.log( window[ df.opt.parrentFormDVar ].ifCurrRecordInIds() );
                        
                    }
                } else {
                    nj( "#" +  df.opt.fieldPraefix + "_div_data" ).htm( jsonobject.html );
                }
                if( jsonobject.hasPag === "true" ) {
                    df.opt.countPages = jsonobject.countPages;
                    df.opt.currentPage = jsonobject.currentPage;
                    df.initPagination( jsonobject.currentPage, df.opt.countPages);
                }
                if( df.opt.widthLabels ) {
                    if( nj( "#" + df.opt.fieldPraefix + "_div_headline" ).htm() === "" ) {
                        let el = nj().cEl( "div" );
                        nj( el ).htm( jsonobject.labelLine );
                        nj( "#" + df.opt.fieldPraefix + "_div_headline" ).aCh( el );
                        if( df.opt.orderArray.length > 0 ) {
                            df.initOrder( df.opt.orderArray, df );
                        }                        
                    }
                }
                let els = nj().els( "#" + df.opt.fieldPraefix + "_div_searchline" );
                if( typeof els === "object" && els === null ) {
                    df.initSearchfields();
                }
                df.initSaveButton();
                df.initDeleteButton();
                df.initSelectFields();
                df.initAddFieldActions( df );
                df.initRecPointer( df );
                df.initValidValues();
            }
            //dMNew.hide();
            if( !df.ifCurrRecordInIds() && typeof df.opt.boundFormArray === [] ) {
                let l = df.opt.boundFormArray.length;
                let i = 0;
                while ( i < l ) {
                    let dataDivId = "#" + window[ df.opt.boundFormArray[i] ].opt.fieldPraefix + "_div_data";
                    //console.log( dataDivId );
                    nj( dataDivId ).htm("");                    
                    i += 1;
                }
            } else {

            }
            if( df.opt.parrentFormDVar !== "" ) {
                let v = window[ df.opt.parrentFormDVar ].getBoundFieldValue( df.opt.parrentFormId );
                nj( "#" + df.opt.fieldPraefix + "_" + df.opt.childFieldTo + "_new" ).v( v );
            }
            nj( window ).tri( "resize" );
            df.replaceDoubleQuota();
            if( typeof df.opt.afterShow === "function" ) df.opt.afterShow();
        break;
        case "saveRecordList":
            JO = jsonobject;
            if( jsonobject.success ) {
                if( typeof df.opt.afterSave === "function" ) df.opt.afterSave( jsonobject );
                dMNew.show( { title: "Datensatz speichern", type: true, text: jsonobject.message, buttons: [
                    {
                        "title": "Okay", 
                        action: function(){
                            dMNew.hide(); 
                            window[ JO.dVar ].show();} 
                        } 
                    ] 
                } );
            } else {
                dMNew.show( { title: "Datensatz speichern", type: false, text: jsonobject.message, buttons: [
                    {
                        "title": "Okay", 
                        action: function(){
                            dMNew.hide(); 
                            window[ JO.dVar ].show();} 
                        } 
                    ] 
                } );
            }
        break;
         case "newRecordList":
            JO = jsonobject;
            if( jsonobject.currentRecord === "new" && jsonobject.success ) {
                dMNew.show( { title: "Datensatz anlegen", type: true, text: jsonobject.message, buttons: [
                    {
                        "title": "Okay", 
                        action: function(){
                            if( typeof window[ JO.dVar ].opt.afterNewRecord === "function" ) {
                                window[ JO.dVar ].opt.afterNewRecord( JO );
                            }
                            dMNew.hide();
                            window[ JO.dVar ].show();
                        } 
                    } 
                    ] 
                } );                
                return;
            } else {
                dMNew.show( { title: "Datensatz anlegen", type: false, text: jsonobject.message } );
                return;                
            }
        break;
        case "deleteRecord":
            JO = jsonobject;
            if( jsonobject.success ) {
                
                let l = df.opt.boundFormArray.length;
                let i = 0;
                while ( i < l ) {
                    // delete child records 
                    //console.log( window[ df.opt.boundFormArray[i] ].opt.boundFormRefInt );
                    i += 1;
                }
                dMNew.show( { title: "Datensatz löschen", type: true, text: jsonobject.message, buttons: [{"title": "Okay", action: function(){console.log( "this", typeof df.opt.afterDelete );if( typeof df.opt.afterDelete === "function" ) { afterDelete( JO ); }; dMNew.hide(); window[ JO.dVar ].show();} } ] } );
            } else {
                dMNew.show( { title: "Datensatz löschen", type: false, text: jsonobject.message } );
                return;                
            }
        break;
        case "setCurrentRecordId":
                nj( "button[id^=" + getIdAndName( jsonobject.elementId ).name.substr( 1, getIdAndName( jsonobject.elementId ).name.length - 1 ) + "]:not(button[id*=_new])" ).htm( "" );
                if( jsonobject.elementId.indexOf( "_new" ) === -1 ) {
                        nj( jsonobject.elementId ).htm( "<img src='library/css/icons/cTriangleRightBlack.png'>");
                    } else {
                }
                nj( jsonobject.elementId ).sty( "background-color", "unset");                
            // TODO: refresh bound forms
            //console.log( jsonobject.Id, df.ifCurrRecordInIds() );
            if( typeof jsonobject.Id !== "undefined" && jsonobject.Id !== "" && jsonobject.Id !== "new" ) {
                l = df.opt.boundFormArray.length;
                i = 0;
                let searchString, cf, pf;
                while ( i < l ) {
                    cf = window[ df.opt.boundFormArray[i] ];
                    pf = window[ cf.opt.parrentFormDVar ];
                    //console.log( pf.ifCurrRecordInIds(), pf.getBoundFieldValue( cf.opt.parrentFormId ) );
                    if( pf.ifCurrRecordInIds() ) {
                        //console.log( pf, cf.opt.parrentFormDVar, cf.opt.parrentFormId, cf.opt.childFieldTo );
                        cf.opt.searchString = cf.opt.childFieldTo + "=" + pf.getBoundFieldValue( cf.opt.parrentFormId );
                        //console.log( cf.opt.searchString );
                        cf.show();
                    } else {
                        nj( "#" + cf.opt.fieldPraefix + "_div_data" ).htm( "" ) ;

                    }
                    i += 1;
                }
            } else {
                l = df.opt.boundFormArray.length;
                i = 0;
                while ( i < l ) {
                    //nj( "#" + window[ df.opt.boundFormArray[i] ].opt.fieldPraefix + "_div_data" ).htm( "" ) ;
                    i += 1;
                }                

            }
            if( jsonobject.Id === "new" ) {
                l = df.opt.boundFormArray.length;
                i = 0;
                while ( i < l ) {
                    //nj( "#" + window[ df.opt.boundFormArray[i] ].opt.fieldPraefix + "_div_data" ).htm( "" ) ;
                    i += 1;
                }
            }

            //if( typeof df.opt.onSelectRecord === "function" ) df.opt.onSelectRecord();
        break
    }    
}
class DataFormNewDR {
    constructor( setup ) {
        this.opt = {
            dVar:               "",
            id:                 "#dataform",
            divVar:             {},
            clearId:            "", // id without # - do not set, is set by class
            title:              "",
            pageSource:         "",
            fields:             "*",        //"user.id,user.firstname" - if not isset all fields will use
            fieldDefs:          "",         //"text;button" ... - if not isset all fields will be input type text fields
            fieldAddAttr:       "",         // additional attributes for fields - e.g."disabled readonly;disabled;..." 
            /* TODO: set fields to object e.g.
            fields: [ 
                {
                    id: id,                         // field in table
                    table: table,                   // source table
                    addAttr: attributes,            // additional attributes in dataform e.g. disabled, readonly, style
                    fieldDef: fieldDef,             // field def e.g. input_text, input_date, div ...
                    invalidValue: invalid value,    // e.g. 'not empty', 'not email' ...
                    label: label,
                    unique: unique,                 // value is unique in source table
                    alias: field as e.g.            // alias
                },
                {
        
                } ...
            ]
            */
            /* TODO: add validation function for fields e.g. NOT EMPTY, IS EMAIL ...
            validValues: "NOT EMPTY;IS EMAIL, NOT EMPTY;NOT EMPTY,IS TEL",
            */
            validateOnSave:     false,      // if true the validation is done before save else after input
            validationArray:    [],         // e.g. ["NOT EMPTY", "IS EMAIL", "NOT ZERO", "NOT NULL", , "NOT UNDEFINED;NOT EMPTY;NOT NULL" ...]
            countRecords:       0,
            currentRecord:      undefined,
            target:             "",
            type:               "form", // form / list / html
            widthSave:          true,
            widthDel:           true,
            boundFormArray:     [],         // bound form dVar array ["form1", "form2", ...]  
            boundFormRefInt:    false,      // bound form referential integrity [true, false, ...]
            parrentFormDVar:     "",        // dVar of parent form
            parrentFormId:      undefined,  // id of parent form field
            childFieldTo:       undefined,  // id of child form field
            addClassesPath:     "",
            addClassFiles:      "dialog.css DataFormNew.css", // add class files to form divided by " "
            addClasses:         undefined,  // add classes to form divided by " "
            width:              300,
            height:             300,
            modal:              true,
            center:             true,
            canMove:            true,
            canResize:          false,
            hasMin:             false,
            hasMax:             false,
            buttons:            undefined,
            recPraefix:         "dfRec",    // if you want to use more than one DataFormNew on a page you must set different values for every DataFormNew - value must end of "_rec_"
            fieldPraefix:       "df",       // if you want to use more than one DataFormNew on a page you must set different values for every DataFormNew
            classPraefix:       "df",       // if you want to use more than one DataFormNew on a page you must set different values for every DataFormNew
            widthLabels:        true,
            labels:             "",
            fieldsWidthLabel:   false,  // if true fields will extended width label
            fieldsWidthDiv:     false,   // if true fields will extended width div
            cbButtonSize:       "iconButtMiddle",
            readOnlyIds:        [], // readonly ids eg. ["0", "1", "6" ]
            searchString:       "",
            additionalSearch:   "",
            searchFields:       [], // nr -> { id: [id], type: [text|select|checkbox], datafield: [datafield], [options: [<option value[v]>val</option>...]] } ]
            orderString:        "",
            orderArray:         [], // nr -> { id: [id], index: [index], datafield: [datafield] ], sortOrder: [ASC|DESC] } ]
            isNew:              true,
            hasPag:             false,
            divPag:             undefined,
            divUpload:          undefined,
            currentPage:        0,
            countPerPage:       0, 
            additionalButtons:  "",
            onShow:             undefined,
            afterShow:          undefined,
            onSave:             undefined,
            afterSave:          undefined,
            //beforeDelete:       undefined,
            afterDelete:        undefined,
            beforeNewRecord:    undefined,
            afterNewRecord:     undefined,
            onSelectRecord:     undefined,
            onSelectRecordDblCl:undefined,
            afterNewPage:       undefined,  // function after pagination click
            variables:          undefined,  // given variables (can be all)
/*            lists: [ {
                        "name": "<list_user",   // list must start width <list_
                        "field": undefined,
                        "sql": "select id, concat(lastname, ' ', firstname ) as fullname from user order by lastname",
                        "isInitialized": false,
                        "widthNull": true,
                        "options": undefined
                    }, {
                        "name": "<list_role",   // list must start width <list_
                        "field": undefined,
                        "sql": "select id, role from role order by role",
                        "isInitialized": false,
                        "widthNull": false,
                        "options": undefined
                    }
                ]
*/
        }
        Object.assign( this.opt, setup );
        console.log( this.opt.dVar, this.opt.hasMin );
        this.opt.clearId = this.opt.id.substr( 1, this.opt.id.length - 1 );
        let el = nj().cEl( "div" );
        el.id = this.opt.clearId;
        if( this.opt.target === "" ) {
            document.body.appendChild( el );
        } else {
            nj( this.opt.target ).aCh( el );
        }
        let tmp = this.opt.addClassFiles.split( " " );
        let l = tmp.length;
        let i = 0;
        while ( i < l ) {
            loadCSS( PATH_CSS_DATAFORM + tmp[i] );
            i += 1;
        }
        this.opt.addClasses += " df" + uppercaseWords( this.opt.type ); 
        switch( this.opt.type ) {
            case "list":
                this.opt.divVar = new DialogDR( { 
                    dVar: this.opt.dVar + ".opt.divVar", 
                    id: this.opt.id,
                    title: this.opt.title,
                    addClasses: this.opt.addClasses,
                    canResize: this.opt.canResize,
                    hasMin: this.opt.hasMin,
                    hasMax: this.opt.hasMax,
                    buttons: this.opt.buttons,
                    width: this.opt.width,
                    height: this.opt.height,
                    center: true,
                    variables: this.opt.variables,
                } );
            break;
            case "html":
                nj( this.opt.id ).htm( "<div id='" +  this.opt.fieldPraefix + "_div_headline'></div><div id='" +  this.opt.fieldPraefix + "_div_data'></div><div id='" +  this.opt.fieldPraefix + "_div_footer'></div>" );
                nj( this.opt.id ).atr( "data-dvar", this.opt.dVar + ".opt.divVar" );
            break;
        }
        this.opt.divUpload = new DialogDR( { 
            dVar: this.opt.dVar + ".opt.divUpload", 
            title: "Datei laden",
        });
    }
    afterDelete = function( args ) {
        console.log( args );    
    }
    buildLists = function( args ) {
        let l = this.opt.lists.length;
        let i = 0;
        data.command = "getList";
        while ( i < l ) {
            this.opt.lists[i].isInitialized = true;
            data.pageSource = this.opt.pageSource;
            data.currentRecord = 0;
            data.name = this.opt.lists[i].name;
            data.field = this.opt.lists[i].field;
            data.sql = this.opt.lists[i].sql;
            console.log( data );
            nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );
            i += 1;
        }
    }
    checkValidValue = function( el ) {
        
    }
    replaceDoubleQuota = function() {
        nj( "input" ).on( "blur", function() {
            nj( this ).v( nj( this ).v().replaceAll( '"', "“" ) );
        })
    }
    getBoundFieldValue = function( id ) {
        let v;
        //console.log( id, nj().els( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ) );
        if( nj().els( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ) === null ) return;
        switch( nj().els( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ).tagName ) {
        case "BUTTON":
                v = getIdAndName( nj( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ).atr( "id") ).Id;
            break;
        case "INPUT":
        case "SELECT":
                v = nj( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ).v();
            break;
        case "DIV":
                v = nj( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord ).htm();
            break;
        }
        let els = nj().els( "#" + this.opt.fieldPraefix + "_" + id + "_" + this.opt.currentRecord );
        let l = els.length;
        let i = 0;
        while ( i < l ) {
            //console.log( nj( els[i] ) );
            i += 1;
        }    
        return v;
    }
    checkUnique = function( formElement, v ) {
        // TODO: functionality for unique check for an i
        let els = nj().els( formElement );
        let l = els.length;
            let i = 0;
            while ( i < l ) {
                console.log( nj().els( els[i] ).value === v, nj().els( els[i] ).value, v );
                if( nj().els( els[i] ).value === v ) return false;
                i += 1;
            }
        return true    
    }
    getOrderEntry = function( orderArray, id ) {
        let l = orderArray.length;
        let i = 0;
        while ( i < l ) {
            if( orderArray[i].id === id ) return orderArray[i];
            i += 1;
        }
        return false;       
    }
    getMaxOrderIndex = function( pag ) {
        let l = window[ pag ].opt.orderArray.length;
        let i = 0;
        let tmpIndex = 0;
        while( i < l ) {
            if( window[ pag ].opt.orderArray[i].index > tmpIndex ) {
                tmpIndex = window[ pag ].opt.orderArray[i].index;
            } 
            i += 1;    
        }
        return tmpIndex;    
    }
    dynamicSort = function(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    buildOrderString = function( orderArray ) {
        let l = orderArray.length;
        let i = 0;
        this.opt.orderString = "";
        //console.log( this );
        while ( i < l ) {
            if( orderArray[i].index !== 0 ) {
                this.opt.orderString += orderArray[i].dataField + " " + orderArray[i].order + ", ";
            }
            i += 1;
        }
        if( this.opt.orderString !== "" ) {
            this.opt.orderString = this.opt.orderString.substr( 0, this.opt.orderString.length - 2 );   
        }
        this.show(); 
    }
    initOrder = function( orderArray, d ) {
        let df, l = orderArray.length;
        let i = 0;
        while ( i < l ) {
            nj( orderArray[i].id ).aCl( "orderNone" );
            nj( orderArray[i].id ).on( "click", function( e ) {
                if( typeof d === "undefined" ) {
                    df = window[ getDVar( this ).split( "." )[0] ]
                } else {
                    df = d;
                }
                let maxIndex, tmpEntry;
                switch( nj().els( "#" + e.target.id ).classList.value ) {
                case "orderNone":
                    maxIndex = df.getMaxOrderIndex( df.opt.dVar );
                    tmpEntry = df.getOrderEntry( df.opt.orderArray, "#" + e.target.id );
                    tmpEntry.index = maxIndex + 1;
                    tmpEntry.order = "ASC"
                    nj( "#" + e.target.id ).aCl( "orderAsc" );
                    nj( "#" + e.target.id ).rCl( "orderNone" );
                    break;
                case "orderAsc":
                    tmpEntry = df.getOrderEntry( df.opt.orderArray, "#" + e.target.id );
                    tmpEntry.order = "DESC"
                    nj( "#" + e.target.id ).aCl( "orderDesc" )
                    nj( "#" + e.target.id ).rCl( "orderAsc" )
                    break;
                case "orderDesc":
                    tmpEntry = df.getOrderEntry( df.opt.orderArray, "#" + e.target.id );
                    tmpEntry.index = 0;
                    tmpEntry.order = "none"
                    nj( "#" + e.target.id ).aCl( "orderNone" )
                    nj( "#" + e.target.id ).rCl( "orderDesc" )
                    break;
                }
                orderArray.sort(df.dynamicSort("index"));
                df.buildOrderString( df.opt.orderArray );
            });
            i += 1;
        }        
    }
    ifCurrRecordInIds = function() {
        let els = nj().els( "div[id^=" + this.opt.recPraefix + "_rec_]" );
        let l = els.length;
        let i = 0;
        while ( i < l ) {
            if( getIdAndName( els[i].id ).Id == this.opt.currentRecord ) {
                return this.opt.currentRecord;
            }
            i += 1;
        }
        return false;    
    }
    initRecPointer  = function( df ) {
        let els = document.querySelectorAll( "button[id^=" + df.opt.fieldPraefix + "_].cRecPointer" );
        let l = els.length;
            let i = 0;
            while ( i < l ) {
                nj( "#" + els[i].id ).on( "click", function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    let pub = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    //console.log( df, getIdAndName( this.id ).Id );
                    pub.opt.currentRecord = getIdAndName( this.id ).Id;
                    data = {};
                    data.command = "setCurrentRecordId";
                    data.id = getIdAndName( this.id ).Id;
                    data.elementId = "#" + this.id;
                    data.praefix = pub.opt.fieldPraefix;
                    data.pageSource = pub.opt.pageSource;
                    data.currentRecord = pub.opt.currentRecord;
                    data.dVar = pub.opt.dVar;
                    nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );
                    //df.show();
                });
                if( typeof this.opt.onSelectRecordDblCl === "function" ) {
                    nj( "#" + els[i].id ).on( "dblclick", function(e) {
                        let pub = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                        pub.opt.onSelectRecordDblCl();   
                    });
                }
                i += 1;
            }
    }
    initSelectFields = function() {
        let els = nj().els( "SELECT[data-list]");
        let l = els.length;
        let i = 0;
        //console.log( this.opt.fieldDefs );
        while ( i < l ) {
            let tmpFieldDefs = this.opt.fieldDefs.split(";");
            let m = tmpFieldDefs.length - 1;
            let j = 0;
            while ( j < m ) {
                if( tmpFieldDefs[j].substring( 0, 4 ) === "list" ) {
                    //console.log( tmpFieldDefs[j] );
                    nj( els[i] ).htm( window[ tmpFieldDefs[j] ]  );
                    let v = nj().els( els[i] ).dataset["value"];
                    nj( els[i] ).sSV( v );
                }
                j += 1;
            }
            i += 1;
        }
    }
    initSearchfields = function() {
        let el, l = this.opt.searchFields.length, i = 0, h = "";
        while ( i < l ) {
            this.opt.searchFields[i].id = "#" + this.opt.fieldPraefix + '_search_' + this.opt.searchFields[i].datafield;
            switch( this.opt.searchFields[i].type ) {
            case "text":
            case "checkbox":
                    if( this.opt.searchFields[i].title !== "" ) {
                        h += "<div><label>" + this.opt.searchFields[i].title + "</label>";
                    }
                    h += '<input type="' + this.opt.searchFields[i].type + '" id="' + this.opt.fieldPraefix + '_search_' + this.opt.searchFields[i].datafield + '">';
                    if( this.opt.searchFields[i].title !== "" ) {
                        h += "</div>";
                    }
                break;
            case "select":
                    if( this.opt.searchFields[i].title !== "" ) {
                        h += "<div><label>" + this.opt.searchFields[i].title + "</label>";
                    }
                    h += '<select id="' + this.opt.fieldPraefix + '_search_' + this.opt.searchFields[i].datafield + '">';
                    h += this.opt.searchFields[i].options;
                    h += '</select>'
                    if( this.opt.searchFields[i].title !== "" ) {
                        h += "</div>";
                    }
                break;
            }
            i += 1;
        }
        el = nj().cEl( "div" );
        el.id = this.opt.fieldPraefix + "_div_searchline";
        nj( el ).htm( h );
        nj( "#" + this.opt.fieldPraefix + "_div_headline" ).aCh( el );
        i = 0;
        while ( i < l ) {
            nj( this.opt.searchFields[i].id ).atr( "data-dvar", this.opt.dVar );
            switch( this.opt.searchFields[i].type ) {
                case "text":
                    nj( this.opt.searchFields[i].id ).on( "keypress", function( e ) {
                        window[ getDVar( nj().els( "#" + e.target.id ) ) ].opt.pageNr = undefined;
                        nj( "#" + e.target.id ).atr( "data-oldlength", nj( "#" + e.target.id ).v().length );
                    });
                    nj( this.opt.searchFields[i].id ).on( "keyup", function( e ) {
                        //nj( "#" + e.target.id ).atr( "data-oldlength", nj( "#" + e.target.id ).v().length );
                        if( parseInt( nj( "#" + e.target.id ).atr( "data-oldlength" ) ) > 1 ) {
                            window[ getDVar( nj().els( "#" + e.target.id ) ) ].buildSearchString();
                        }    
                    });
                break;
                case "select":
                     nj( this.opt.searchFields[i].id ).on( "change", function( e ) {
                        window[ getDVar( nj().els( "#" + e.target.id ) ) ].buildSearchString();
                    });
                break;
                case "checkbox":
                    nj( this.opt.searchFields[i].id ).on( "change", function( e ) {
                        window[ getDVar( nj().els( "#" + e.target.id ) ) ].buildSearchString();
                    });
                break;
            }
            i += 1;
        }
    }
    initAddFieldActions = function( df ) {
        //console.log( this.opt.additionalButtons );
        let l = this.opt.additionalButtons.length;
        let i = 0;
        while ( i < l ) {
            //console.log( this.opt.additionalButtons[i].action, this.opt.additionalButtons[i].id );
            nj( "button[id*=" + this.opt.additionalButtons[i].id + "]" ).on( "click", this.opt.additionalButtons[i].action );
            i += 1;
        }
    }
    initValidValues = function() {
        nj( "#" + this.opt.dVar + " *" ).on( "blur", function() {
            console.log( getDVar( nj().els( this ) ), getChildIndex( this ), "check valid" );
        })    
    }
    buildSearchString = function() {
        let tS, searchArr = [];
        let l = this.opt.searchFields.length;
        let i = 0;
        while ( i < l ) {
            switch( this.opt.searchFields[i].type ) {
                case "text":
                    tS = this.opt.searchFields[i].datafield + " LIKE '" + nj( this.opt.searchFields[i].id ).v() + "%'";
                    searchArr.push( tS );
                break;
                case "select":
                    if( nj( this.opt.searchFields[i].id ).v().substr( 0, 1 ) === ">" || 
                        nj( this.opt.searchFields[i].id ).v().substr( 0, 1 ) === "<" ||
                        nj( this.opt.searchFields[i].id ).v().substr( 0, 1 ) === "!") {
                            tS = this.opt.searchFields[i].datafield + nj( this.opt.searchFields[i].id ).v();
                    } else {
                            tS = this.opt.searchFields[i].datafield + " = '" + nj( this.opt.searchFields[i].id ).v() + "'";
                    }
                    
                    searchArr.push( tS );
                 break;
            case "checkbox":
                    if( nj( this.opt.searchFields[i].id ).chk() ) {
                        tS = this.opt.searchFields[i].datafield + " = '1'";
                    } else {
                        tS = this.opt.searchFields[i].datafield + " = '0'";
                    }
                    searchArr.push( tS );
                break;
            }
            i += 1;
        }
        l = searchArr.length;
        i = 0;
        this.opt.searchString = "";
        while ( i < l ) {
            this.opt.searchString += searchArr[i] + " AND ";
            i += 1;
        }
        this.opt.searchString = this.opt.searchString.substr( 0, this.opt.searchString.length - 5 ) + this.opt.additionalSearch;
        nj( "#" + this.opt.fieldPraefix + "_pag_firstPage" ).tri( "click" );
        this.show();
    }
    initSaveButton = function() {
        nj( "button[id^=" + this.opt.fieldPraefix + "_save_button]" ).on( "click", function( e ) {
            e.stopImmediatePropagation();
            e.preventDefault();
            let id = getIdAndName( e.target.id ).Id;
            let df = window[ getDVar( this ).split( ".")[0] ];
            df.opt.currentRecord = id;
            let els = document.querySelectorAll( "#" + df.opt.fieldPraefix + " div[id=" + df.opt.recPraefix + "_rec_" + id + "]>*:not(button[id*=_save_button_]):not(button[id*=_delete_button_]):not(button[id*=_additional_button_]):not(*[id*=empty])" );
            let l = els.length;
            let i = 0, data = {};
            if( id !== "new" ) {
                data.command = "saveRecordList";
            } else {
                data.command = "newRecordList";
                if( typeof df.opt.beforeNewRecord === "function" ) {
                    df.opt.beforeNewRecord();
                }
            }
            data.pageSource = df.opt.pageSource;
            data.dVar = df.opt.dVar;
            data.divId = df.opt.id;
            data.currentRecord = id;
            //console.log( df.opt.fieldPraefix );
            let tmpData = []
            data.data = [];
            while ( i < l ) {
                //console.log( nj( "#" + els[i].id ).tag() );
                if( nj( "#" + els[i].id ).tag() === "DIV" ) {
                    data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).htm() });                
                }
                if( nj( "#" + els[i].id ).tag() === "IMG" ) {
                    data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).atr( "src" ) } );
                }
                if( nj( "#" + els[i].id ).tag() === "INPUT" || nj( "#" + els[i].id ).tag() === "TEXTAREA" ) {/* || nj( "#" + els[i].id ).tag() === "SELECT" ) {*/
                    if( nj( "#" + els[i].id ).atr( "type") === "checkbox" || nj( "#" + els[i].id ).atr( "type") === "radio" ) {
                        data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).chk() } );
                    } else {
                        let v = nj( "#" + els[i].id ).v().replaceAll( "'", "\\'" );
                        data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": v } );
                    }
                }
                if( nj( "#" + els[i].id ).tag() === "SELECT" ) {
                    data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).gSV() } );
                }
                //console.log( getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix );
                i += 1;
            }
            data.data = JSON.stringify( data.data );
            console.log( data );
            nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );        
        });
    }
    initDeleteButton = function() {
        nj( "button[id^=" + this.opt.fieldPraefix + "_delete_button]" ).on( "click", function( e ) {
            let id = getIdAndName( e.target.id ).Id;
            let df = window[ getDVar( this ).split( ".")[0] ];
            //console.log( id, df, getIdAndName( e.target.id ).name );
            data.command = "deleteRecord";
            data.pageSource = df.opt.pageSource;
            data.dVar = df.opt.dVar;
            data.divId = df.opt.id;
            data.currentRecord = id;
            nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );        
        });
    }
    getBoundPages = function() {
        let l = this.opt.boundFormArray.length;
        let i = 0;
        while ( i < l ) {
            //console.log( this.opt.boundFormArray[i], this.ifCurrRecordInIds(), this.opt.currentRecord );
            if( this.opt.type === "html" && this.opt.boundFormArray.length > 0 ) window[ this.opt.boundFormArray[i] ].show();
            i += 1;
        }
    }
    initPagination = function( currentPage, countPages ) {
        console.log( this.opt.type );
        let cName;
        if( (this.opt.type === "list" && this.opt.hasPag) || (this.opt.type === "html" && this.opt.hasPag) ) {
            cName = "dfList_Pagination " + this.opt.classPraefix + "_Pagination";
        }
        let cPag = DIFF_PAGINATION * 2 + 1, htm = "<div id='" + this.opt.fieldPraefix + "_Pagination' class='" + cName + "'><a href='#'  id='" + this.opt.fieldPraefix + "_pag_firstPage'>«</a><a href='#'  id='" + this.opt.fieldPraefix + "_pag_prevPage'>‹</a><span>...</span>";
        if( countPages < cPag ) {
            let l = countPages;
            let i = 0;
            while ( i < l ) {
                if( currentPage == i ) {
                    htm += '<a href="#" id="' + this.opt.fieldPraefix + '_pag_' + i + '" class="' + this.opt.classPraefix + '_activePage">' + ( i + 1 ) + '</a>';
                } else {
                    htm += '<a href="#" id="' + this.opt.fieldPraefix + '_pag_' + i + '">' + ( i + 1 ) + '</a>';                    
                }
                i += 1;
            }
        } else {
            currentPage = parseInt( currentPage );
            let l = cPag;
            let i = currentPage - DIFF_PAGINATION;
            if( currentPage + DIFF_PAGINATION < countPages ) {
                i = currentPage - DIFF_PAGINATION;
                l = i + cPag;
                if( i < 0 ) {
                    i = 0;
                    l = cPag;    
                }
            } else {
                i = countPages - cPag;
                l = countPages;
            }
            while ( i < l ) {
                if( i >= countPages ) break;
                if( currentPage == i ) {
                    htm += '<a href="#" id="' + this.opt.fieldPraefix + '_pag_' + i + '" class="' + this.opt.classPraefix + '_activePage">' + ( i + 1 ) + '</a>';
                } else {
                    htm += '<a href="#" id="' + this.opt.fieldPraefix + '_pag_' + i + '">' + ( i + 1 ) + '</a>';                    
                }
                i += 1;
            }

        }
        htm += '<span>...</span><a href="#"  id="' + this.opt.fieldPraefix + '_pag_nextPage">›</a><a href="#"  id="' + this.opt.fieldPraefix + '_pag_lastPage">»</a></div>';
        nj( "#" + this.opt.fieldPraefix + "_div_footer" ).htm( htm );
        let els = document.querySelectorAll( "#" + this.opt.fieldPraefix + "_Pagination>a" );
        let l = els.length;
        let i = 0;
        let id, df;
        while ( i < l ) {
            id = getIdAndName( els[i].id ).Id;
            switch( id ) {
            case "firstPage":
                nj( els[i] ).on( "click", function() {
                    df = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    df.opt.currentPage = 0;
                    df.show();
                    df.getBoundPages();    
                    if( typeof df.opt.afterNewPage === "function" ) df.opt.afterNewPage( df );    
                });
                break;
            case "prevPage":
                nj( els[i] ).on( "click", function() {
                    df = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    df.opt.currentPage = parseInt( df.opt.currentPage ) -1;
                    if( df.opt.currentPage < 0 ) {
                        df.opt.currentPage = 0;
                    }
                    df.show();    
                    df.getBoundPages();    
                    if( typeof df.opt.afterNewPage === "function" ) df.opt.afterNewPage( df );    
                });
                 break;
            case "nextPage":
                nj( els[i] ).on( "click", function() {
                    df = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    df.opt.currentPage = parseInt( df.opt.currentPage ) + 1;
                    //console.log( df.opt.countPages, df.opt.currentPage );
                    if( df.opt.currentPage == df.opt.countPages ) {
                        df.opt.currentPage = df.opt.countPages - 1;
                    }
                    df.show();
                    df.getBoundPages();    
                    if( typeof df.opt.afterNewPage === "function" ) df.opt.afterNewPage( df );    
                });
                break;
            case "lastPage":
                nj( els[i] ).on( "click", function() {
                    df = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    df.opt.currentPage = df.opt.countPages - 1;
                    df.show();    
                    df.getBoundPages();    
                    if( typeof df.opt.afterNewPage === "function" ) df.opt.afterNewPage( df );    
                });
                break;
            default:
                nj( els[i] ).on( "click", function( e ) {
                    df = window[ getDVar( nj().els( this ) ).split( "." )[0] ];
                    df.opt.currentPage = parseInt( getIdAndName( e.target.id ).Id );;
                    df.show();    
                    df.getBoundPages();    
                    if( typeof df.opt.afterNewPage === "function" ) df.opt.afterNewPage( df );    
                });
                break;
            }
            i += 1;
        }
        /* set data area height for type list if height is given and hasPag is true */
        if( typeof this.opt.divVar.opt !== "undefined" && typeof this.opt.divVar.opt.height === "number" && this.opt.hasPag ) {
            let tmpHeight = this.opt.divVar.opt.height - nj( this.opt.id + "_Pagination" ).gRe().height - 102;
            nj(this.opt.divVar.opt.id + "_div_data").sty("height", tmpHeight + "px")
        }
    }
    getIsLastPage = function() {
            
    }
    saveForm = function( df ) {
        //console.log( df.opt.recPraefix );
        let e = nj().els( "div[id^=" + df.opt.recPraefix + "_rec_]" )[0];
        let id = getIdAndName( e.id ).Id;
             if( id !== "new" ) {
                data.command = "saveRecordList";
            } else {
                data.command = "newRecordList";
            }
        let els = document.querySelectorAll( "div[id^=" + df.opt.recPraefix + "_rec_]>*>*:not(label):not(button[id*=_save_button_]):not(button[id*=_delete_button_]):not(button[id*=_additional_button_]):not(div)" );
        let l = els.length;
        let i = 0;
            data.pageSource = this.opt.pageSource;
            data.dVar = this.opt.dVar;
            data.divId = this.opt.id;
            data.currentRecord = id;
            //console.log( df.opt.fieldPraefix );
            let tmpData = []
            data.data = [];
            while ( i < l ) {
                //console.log( nj( "#" + els[i].id ).tag() );
                if( nj( "#" + els[i].id ).tag() === "DIV" ) {
                    data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).htm() });                
                }
                if( nj( "#" + els[i].id ).tag() === "IMG" ) {
                    data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).atr( "src" ) } );
                }
                if( nj( "#" + els[i].id ).tag() === "INPUT" || nj( "#" + els[i].id ).tag() === "TEXTAREA" || nj( "#" + els[i].id ).tag() === "SELECT" ) {
                    if( nj( "#" + els[i].id ).atr( "type") === "checkbox" || nj( "#" + els[i].id ).atr( "type") === "radio" ) {
                        data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": nj( "#" + els[i].id ).chk() } );
                    } else {
                        let v = nj( "#" + els[i].id ).v().replaceAll( "'", "\\'" );
                        data.data.push( {"id": getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix, "value": v } );
                    }
                }
                //console.log( getIdAndName( els[i].id, df.opt.fieldPraefix + "_").widthoutPraefix );
                i += 1;
            }
            data.data = JSON.stringify( data.data );
        console.log( data );
        nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );        
    }
    show = function( args ) {
        if( typeof this.opt.beforeShow === "function" ) this.opt.beforeShow();
        data.command = "showRecord" + uppercaseWords( this.opt.type );
        data.dVar = this.opt.dVar;
        data.divId = this.opt.id;
        data.type = this.opt.type;
        data.pageSource = this.opt.pageSource;
        data.currentRecord = this.opt.currentRecord;
        data.fields = this.opt.fields;
        data.fieldAddAttr = this.opt.fieldAddAttr;
        data.widthSave = this.opt.widthSave;
        data.widthDel = this.opt.widthDel;
        data.searchString = this.opt.searchString;
        data.orderString = this.opt.orderString;
        data.fieldDefs = this.opt.fieldDefs;
        data.widthLabels = this.opt.widthLabels;
        data.fieldsWidthDiv = this.opt.fieldsWidthDiv;
        data.fieldsWidthLabel = this.opt.fieldsWidthLabel;
        data.labels = this.opt.labels;
        data.recPraefix = this.opt.recPraefix; 
        data.fieldPraefix = this.opt.fieldPraefix;
        data.classPraefix = this.opt.classPraefix;
        data.additionalButtons = this.opt.additionalButtons;
        data.currentPage = this.opt.currentPage;
        data.countPerPage = this.opt.countPerPage;
        data.isNew = this.opt.isNew;
        data.hasPag = this.opt.hasPag;
        data.divPag = "#" + this.opt.fieldPraefix + "_div_footer";
        data.additionalButtons = JSON.stringify( this.opt.additionalButtons );
        nj().post( "library/php/ajax_dataform_new.php", data, evaluateDataFormNew );        
    }
    options( param, value ) {
        switch( param ){
            case "setRecordId":
                this.opt.recordId = value;
            break;
            case "getPosition":
                    let r = nj().els( this.opt.id + "_box" ).getBoundingClientRect();
                    let top = r.y;
                    let left = r.x;
                    return( {top: top, left: left } );
            break;
            case "position":
                    nj( this.opt.id + "_box" ).sty({top:value.top, left:value.left});
            break;
            case "title":
                    nj( this.opt.id + "_headlineTitle" ).htm( value );
            break;
            case "dimension":
                    nj( this.opt.id + "_box" ).sty({width: value.width, height: value.height});
                    if( value.removeClass ) {
                        nj( this.opt.id ).rCl( value.removeClass );
                    }                    
                    if( value.addClass ) {
                        nj( this.opt.id ).aCl( value.addClass );
                    }
                    if( this.opt.center ) {
                        nj( window ).tri( "resize" );
                    }
            break;
        }
    }
}
