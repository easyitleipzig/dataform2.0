//javascript
innerCheckValidity = function( field ) {
    console.log( field );    
}

class Field {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            dVar:               undefined, // necessary - var of field object
            id:                 "", // id of field - is dVar if not set
            recordset:          undefined, // bound recordset variable
            target:             undefined,
            index:              undefined,
            value:              undefined, // value of field
            oldValue:           undefined, // value before change
            default:            undefined, // default value of field
            maxValue:           undefined,
            minValue:           undefined,
            maxLength:          undefined,
            label:              "", // label of field - is id if not set
            table:              "", // source table for field
            field:              "", // source tablefield
            type:               "input_text", /* fieldtype: 
                                                    select
                                                    recordPointer
                                                    button
                                                    input_text
                                                    input_number
                                                    input_date
                                                    input_time
                                                    input_month
                                                    input_week
                                                    input_datetime
                                                    input_datetime-local
                                                    input_button
                                                    input_password
                                                    input_color
                                                    input_email
                                                    input_tel
                                                    input_url
                                                    input_range
                                                    radio
                                                    checkbox
                                                    div
                                                    label
                                                    textarea
                                                    stars
                                                    img
                                                    bckg
                                                */
//            addPraefix:         "", // classes for field; e.g. "cUsusal cLabel ..."
            addPraefix:         "", // classes for field; e.g. "cUsusal cLabel ..."
            addClass:           "", // classes for field; e.g. "cUsusal cLabel ..."
            addAttr:            "", // additional attributes for html e.g.: 'target = "_blank" placeholder="[placeholder]"; ...' / combinitions are possible
            valid:              [], // validity ["not empty", "not 0", "not null", "not undifined", "is email", "is postalcode", "is unique"]; combinitions are possible
            validOnSave:        false, // checks validity on save
            options:            undefined, // options for select field, options for input text datalist
                                /* <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
                                        <datalist id="ice-cream-flavors">
                                            <option value="Chocolate"></option>
                                            <option value="Coconut"></option>
                                            <option value="Mint"></option>
                                            <option value="Strawberry"></option>
                                            <option value="Vanilla"></option>
                                        </datalist>
                                */
            withLabel:          false,
            withDiv:            false,
            onFocus:            this.beforeChange,
            onBlur:             undefined,
            onChange:           undefined,
            onClick:            undefined,
            onDblClick:         undefined,
            onInit:             undefined,
            onChange:           undefined,
            onBeforeChange:     undefined,
            variables:          {},         // optional - additional values for Field

        }
        let showOnInit = true,
            boxId = "",
            tmpId = "",
            tmpClasses = "",
            tmpEl = {}, 
            tmpEls;
        Object.assign( this.opt, param );
        if( this.opt.id === "" ) {
            this.opt.id = "#" + this.opt.addPraefix + this.opt.dVar; 
        }
        if( typeof this.opt.default !== "undefined" && typeof this.opt.value === "undefined" ) {
            this.opt.value = this.opt.default;       
        }
        if( typeof this.opt.onBeforeChange === "function" ) {
            this.beforeChange = this.opt.onBeforeChange;       
        }
        if( this.opt.type === "img" ) {
            nj().els( "body" )[0].appendChild( htmlToElement( DIV_UPLOAD_HTML ) );
            nj( "#tmpUploadId" ).atr( "id", "uploadDiv_" + this.getId() );
            nj( "#tmpDivUploadFormErrorText" ).atr( "id", "uploadErrorText_" + this.getId() );            
            nj( "#tmpFileUploadFile" ).atr( "id", "fileUploadFile_" + this.getId() );
            nj( "#fileUploadFile_" + this.getId() ).on( "change", function() {
                const [last] = this.value.split("\\").slice(-1);
                console.log(last);
            })            
            nj( "#tmpLabelUpload" ).atr( "id", "labelUpload_" + this.getId() );
            nj( "#" + "labelUpload_" + this.getId() ).atr( "for", "fileUploadFile_" + this.getId() );
        }
        if( this.opt.label === "" ) this.opt.label = this.opt.id;
        if( typeof this.opt.onFocus === "function" ) {

        }
    }
    beforeChnage = function() {
        switch( this.opt.type ) {
            case "checkbox":
                this.opt.oldValue = nj( "#" + this.opt.id ).chk();        
            break;
            case "img":
                this.opt.oldValue = nj( "#" + this.opt.id ).atr( "src" );        
            break;
            case "bckg":
                this.opt.oldValue = nj( "#" + this.opt.id ).sty( "background-image" );        
            break;
            case "label":
                this.opt.oldValue = nj( "#" + this.opt.id ).htm();        
            break;
            default:
                this.opt.oldValue = nj( "#" + this.opt.id ).v();
            break;
        }
    }
    getId = function( args ) {        
        if( this.opt.addPraefix === "" ) {
            this.tmpId = this.opt.id;    
        } else {
            this.tmpId = this.opt.addPraefix + "_" + this.opt.id;
        }
        return this.tmpId;   
    }
    innerCheckValidity = function() {
        let tmpValid = this.opt.valid;
        let l = tmpValid.length;
        let i = 0;
        while ( i < l ) {
            console.log( tmpValid[ i ] );
            switch( tmpValid[ i ] ) {
                case "not 0":
                    if( nj( this.opt.id ).tag() === "SELECT" ) {
                        if( nj( this.opt.id ).gSV().includes('0') && nj( this.opt.id ).gSV().length === 1 ) {
                            console.log( "is 0" );
                        }            
                    } else {
                        if( nj( this.opt.id ).v() == "0" ) {
                            console.log( "is 0" );
                        }
                    }   
                break;
                case "not empty":
                    if( nj( this.opt.id ).tag() === "SELECT" ) {
                        if( nj( this.opt.id ).gSV().includes('') && nj( this.opt.id ).gSV().length === 1 ) {
                            console.log( "is 'empty'" );
                        }            
                    } else {
                        if( nj( this.opt.id ).v() == "" ) {
                            console.log( "is 'empty'" );
                        }
                    }   
                break;
            }
            i += 1;
        }
        
    }
    setRecordPointer = function( res ) {
        console.log( res );
    }
    setRecordPointer = function( res ) {
        console.log( res );
    }    
    checkValidity = function() {
        console.log( this.getValue() );
        let tmpValid = this.opt.valid;
        let l = tmpValid.length;
        let i = 0;
        while ( i < l ) {
            console.log( tmpValid[ i ] );
            switch( tmpValid[ i ] ) {
                case "not 0":
                    if( nj( this.opt.id ).tag() === "SELECT" ) {
                        if( nj( tmp ).gSV().includes('0') && nj( tmp ).gSV().length === 1 ) {
                            console.log( this.opt.label, "is 0" );
                        }            
                    } else {
                        if( nj( this.opt.id ).v() == "0" ) {
                            console.log( this.opt.label, "is 0" );
                        }
                    }   
                break;
                case "not empty":
                    if( nj( this.opt.id ).tag() === "SELECT" ) {
                        if( nj( this.opt.id ).gSV().includes('') && nj( this.opt.id ).gSV().length === 1 ) {
                            console.log( this.opt.label, "is 'empty'" );
                        }            
                    } else {
                        if( nj( this.opt.id ).v() == "" ) {
                            console.log( this.opt.label, "is 'empty'", "Das Feld '" + this.opt.label + "' darf nicht leer sein!" );
                            dMNew.show( { title: "Fehler", type: false, text: "Das Feld '" + this.opt.label + "' darf nicht leer sein!" } );
                        }
                    }   
                break;
            }
            i += 1;
        }
        
    }
    setActions = function() {
        if( typeof this.opt.onFocus === "function" ) {
            nj( this.opt.id ).on( "focus", this.opt.onFocus );          
        }
        if( typeof this.opt.onBlur === "function" ) {
            nj( this.opt.id ).on( "blur", this.opt.onBlur );          
        }
        if( typeof this.opt.onChange === "function" ) {
            nj( this.opt.id ).on( "change", this.opt.onChange );          
        }
        if( typeof this.opt.onBeforeChange === "function" ) {
            nj( this.opt.id ).on( "focus", this.opt.onBeforeChange );          
        }
        if( typeof this.opt.onClick === "function" ) {
            nj( this.opt.id ).on( "click", this.opt.onClick );          
        }
        if( typeof this.opt.onDblClick === "function" ) {
            nj( this.opt.id ).on( "dblclick", this.opt.onDblClick );          
        }        
    }
    setValue = function( value ) {
        switch( this.opt.type ) {
            case "img":
                nj( this.opt.id ).atr( "src", value );
            break;
            case "bckg":
                nj( this.opt.id ).sty( "background-image", "url(" + value + ")" );
            break;
            case "radio": 
                // content
                nj().els( "div[id=" + this.opt.id)
            break;
            default:
                nj( this.opt.id ).v( value );
            break;
        }
    }
    getValue = function( value ) {
        if( typeof this.opt.index !== "undefined" ) {
            if( this.opt.addPraefix === "" ) {
                if( this.opt.type === "checkbox" ) {
                    return nj( "#" + this.opt.id + '_' + this.opt.index ).chk();
                } else {
                    return nj( "#" + this.opt.id + '_' + this.opt.index ).v();
                }                    
            } else {
                if( this.opt.type === "checkbox" ) {
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).chk();
                } else {
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).v();    
                }
            }
        } else {
            if( this.opt.addPraefix === "" ) {
                if( this.opt.type === "checkbox" ) {
                    return nj( "#" + this.opt.id ).chk();
                } else {
                    return nj( "#" + this.opt.id ).v();    
                }
            } else {
                if( this.opt.type === "checkbox" ) {
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).chk();
                } else {
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).v();   
                }
            }            
        }
    }
    getField = function() {
        let fieldHTML = "", tmpValueArry = [], el, tmpId, i, l, fieldElements = [];
        if( this.opt.type.substring( 0, 6 ) === "input_" ) {
            this.opt.type = this.opt.type.split( "_" )[1]
        }
        if( this.opt.widthLabel ) {
            if( this.opt.addPraefix !== "" ) {
                el = this.opt.addPraefix + "_" + this.opt.id;
            } else {
                el = this.opt.id;
            }
            if( this.opt.index !== "" ) {
                el += "_" + this.opt.index;
            }
            if( this.opt.addPraefix === "" ) {
                fieldElements.push( htmlToElement( "<label for='" + el + "'>" + this.opt.label + "</label>" ) );
            } else {
                fieldElements.push( htmlToElement( '<label class="lab_' + this.opt.dVar + '" for="' + el + '">' + this.opt.label + "</label>" ) );
            }
        }
        switch ( this.opt.type) {
            case "select":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<select id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<select id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<select id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<select id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="cSelect ' + this.opt.addClass + '" ';
                fieldHTML += this.opt.attributes + '>' + this.opt.options + '</select>';
                this.tmpEl = htmlToElement( fieldHTML );
                if( typeof this.opt.value !== "undefined" ) {
                    this.tmpValueArry = this.opt.value.split( "," );
                    l = this.tmpEl.children.length;
                    i = 0;
                    while (i < l) {
                         if( this.tmpValueArry.includes(  this.tmpEl.children[i].value ) ) {
                            nj( this.tmpEl.children[i] ).atr( "selected", "" );
                        } 
                        i += 1;
                    }
                }
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "text":
            case "date":
            case "file":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" type="' + this.opt.type + '" value="' + this.opt.value + '">';
                this.tmpEl = htmlToElement( fieldHTML );
                if( typeof this.opt.options !== "undefined" && this.opt.type === "text" ) {
                    tmpId = "list_" + this.tmpEl.id;
                    this.tmpEl.setAttribute("list", tmpId );
                }
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  );
                if( typeof this.opt.options !== "undefined" && this.opt.type === "text" ) {
                    el = nj().cEl( "datalist" );
                    el.id = "list_" + this.tmpEl.id;
                    nj( el ).htm( this.opt.options );
                    fieldElements.push( el  );
                }
            break;
            case "checkbox":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                if( this.opt.value == true ) {
                    fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" type="checkbox" checked>';
                } else {
                    fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" type="checkbox">';
                }
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "button":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '">' + this.opt.value + '</button>';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "img":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<img id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<img id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<img id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<img id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" src="' + this.opt.value + '">';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "recordPointer":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" type="checkbox" checked>' + this.opt.value + '</button>';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "radio":

            break;
            default:
                // statements_def
                break;
        }        
        if( this.opt.widthDiv ) {
            el = nj().cEl( "div" );
            if( this.opt.addPraefix === "" ) {
                el.id = 'div_' + this.opt.id;    
            } else {
                el.id = this.opt.addPraefix + '_div_' + this.opt.id;    
            }
            nj( el ).aCl( "divField_" + this.opt.id );
            l = fieldElements.length;
            i = 0;
            while ( i < l ) {
                nj( el ).aCh( fieldElements[i] ); 
                i += 1;
            }
            fieldElements = [];
            fieldElements.push( el ); 
        }
        return fieldElements;
    }
    appendField = function () {
        // content
        if( typeof this.opt.target === "undefined" ) this.opt.target = "body";
        nj( this.opt.target ).aCh( this.getField() );
    }
}
