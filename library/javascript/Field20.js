//javascript
class Field {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            id:                 undefined,  // necessary - id of field; fieldname in databasetable
            dVar:               undefined,  // necessary - var of field object
            tabIndex:           undefined,  // index in recordset 
            value:              undefined,  // value of field
            default:            undefined,  // default value of field
            isPrimaryKey:       false,      // is true if field is primary key
            isAutoInc:          false,      // is true if field is auto increment
            maxValue:           undefined,
            minValue:           undefined,
            maxLength:          undefined,
            label:              "", // label of field - is id if not set
            title:              "", // tooltip value
            table:              "", // nessecary - source table for field
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
            addPraefix:         "", // praefix for recordsets and fields; e.g. "Df_", "df"
            baseClass:          "cField",
            addClasses:         "", // additional classes for field; e.g. "cUsusal cLabel ..."
            classButtonSize:    "", // additional classes for button size; e.g. "cButtonMin", "cButtonSmall" .. 
            addAttr:            "", // additional attributes for html e.g.: 'target = "_blank" placeholder="[placeholder]"; ...' / combinitions are possible
            valid:              [], // validity ["not empty", "not 0", "not null", "not undifined", "is email", "is postalcode", "is unique", "is in range", ...]; combinitions are possible
            validOnSave:        false, // checks validity on save else validation will be done if field onblur
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
            widthLabel:          false,
            widthDiv:            false,
            onFocus:            function( args ) {
                if( nj().els( "button[id^=" + nj( this ).gRO().opt.addPraefix + "recordPointer_].cRecPointerSelected" ).length === 1 ) {
                    if( getIdAndName( this.id ).Id !== getIdAndName( nj().els( "button[id^=" + nj( this ).gRO().opt.addPraefix + "recordPointer_].cRecPointerSelected" )[0].id ).Id ) {
                        nj( "button[id^=" + nj( this ).gRO().opt.addPraefix + "recordPointer_].cRecPointerSelected" ).rCl("cRecPointerSelected");
                        let l = nj( this ).gRO().opt.boundForm.length;
                        let i = 0;
                        while ( i < l ) {
                            console.log( nj( this ).gRO().opt.boundForm[i]);

                            nj( window[nj( this ).gRO().opt.boundForm[i]].opt.id + "_data" ).htm( "" );
                            i += 1;
                        }
                    }
                }
            },
            onBlur:             function( args ) {
                console.log( nj( this ).gRO().opt.validOnSave );    
            },
            onChange:           undefined,
            onClick:            undefined,
            onDblClick:         undefined,
        }
        let showOnInit = true,
            boxId = "",
            tmpId = "",
            tmpClasses = "",
            tmpEl = {}, 
            tmpEls;
        Object.assign( this.opt, param );
        if( typeof this.opt.default !== "undefined" && typeof this.opt.value === "undefined" ) {
            this.opt.value = this.opt.default;       
        }
        if( this.opt.type === "button" || this.opt.type === "input_button" ) {
            this.opt.addClasses = this.opt.baseClass + " " + this.opt.classButtonSize + " " + this.opt.addClasses;
        } else {
            this.opt.addClasses = this.opt.baseClass + " " + this.opt.addClasses;
        }
        if( this.opt.label === "" ) this.opt.label = this.opt.id;
        if( typeof this.opt.onFocus === "function" ) {
        }
    }
    buildFieldDefs( fieldDef ) {
        this.opt.id = fieldDef.id;
        return this;
    }
    getId = function( args ) {        
        if( typeof this.opt.index !== "undefined" ) {
            if( this.opt.addPraefix === "" ) {
                this.tmpId = this.opt.id + '_' + this.opt.index;    
            } else {
                this.tmpId = this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index;
            }                    
        } else {
            if( this.opt.addPraefix === "" ) {
                this.tmpId = this.opt.id;    
            } else {
                this.tmpId = this.opt.addPraefix + "_" + this.opt.id;
            }
        }
        return this.tmpId;   
    }
    setRecordPointer = function( res ) {
        console.log( res );
    }    
    checkValidity = function() {
        let result = {success: true};
        //console.log( this.getValue(), this.opt.type );
        let tmpValid = this.opt.valid;
        let v = this.getValue();
        let l = tmpValid.length;
        let i = 0;
        while ( i < l ) {
            switch( tmpValid[ i ] ) {
                case "not 0":
                    if( v == 0 ) {
                        result.success = false;
                        result.message = "Das Feld '" + this.opt.label + "' darf nicht 0 sein."    
                    }
                break;
                case "not empty":
                    if( v === "" ) {
                        result.success = false;
                        result.message = "Das Feld '" + this.opt.label + "' darf nicht leer sein."    
                    }
                break;
                case "is email":
                    if( v !== "" && !validateEmail( this.getValue() ) ) {
                        result.success = false;
                        result.message = "Das Feld '" + this.opt.label + "' muss eine E-Mail-Adresse sein.";    
                    }
                break;
                case "is number":
                    if( Number( v ) === NaN ) {
                        result.success = false;
                        result.message = "Das Feld '" + this.opt.label + "' muss eine Zahl sein.";    
                    }
                case "is integer":
                    if( Number( v ) !== NaN && Number.isInteger( Number( v ) ) ) {
                    } else {
                        result.success = false;
                        result.message = "Das Feld '" + this.opt.label + "' muss eine Ganzzahl sein.";                       
                    }
                break;
            }
            i += 1;
        }
        return result;
    }
    setActions = function( field_id ) {
        //console.log( field_id );
/*        if( typeof this.opt.onFocus === "function" ) {
            nj( "#" + field_id ).on( "focus", this.opt.onFocus );          
        }
        /*
        if( typeof this.opt.onBlur === "function" ) {
            nj( field ).on( "blur", this.opt.onBlur );          
        }
        if( typeof this.opt.onChange === "function" ) {
            nj( field ).on( "change", this.opt.onChange );          
        }
        if( typeof this.opt.onClick === "function" ) {
            nj( field ).on( "click", this.opt.onClick );          
        }
        if( typeof this.opt.onDblClick === "function" ) {
            nj( field ).on( "dblclick", this.opt.onDblClick );          
        }
        */        
    }
    setValue = function( value ) {
        console.log( this, value );
        if( typeof this.opt.index !== "undefined" ) {
            if( this.opt.addPraefix === "" ) {
                switch( this.opt.type ) {
                case "checkbox":
                    nj( "#" + this.opt.id + '_' + this.opt.index ).chk( value);
                    break;
                case "select":
                    nj( "#" + this.opt.id ).sSV( value );
                    break;
                case "img":
                    nj( "#" + this.opt.id ).atr( "src", value );
                    break;
                default:
                    nj( "#" + this.opt.id + '_' + this.opt.index ).v( value );
                    break;
                }
             } else {
                switch( this.opt.type ) {
                case "checkbox":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).chk( value );
                    break;
                case "select":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).sSV( value );
                    break;
                case "img":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).atr("src", value );
                    break;
                default:
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).v( value );
                    break;
                }
            }
        } else {
            if( this.opt.addPraefix === "" ) {
                switch( this.opt.type ) {
                case "checkbox":
                    nj( "#" + this.opt.id ).chk( value );
                    break;
                case "select":
                    nj( "#" + this.opt.id ).sSV( value );
                    break;
                case "img":
                    nj( "#" + this.opt.id ).atr("src", value );
                    break;
                default:
                    nj( "#" + this.opt.id ).v( value );
                    break;
                }                
            } else {
                switch( this.opt.type ) {
                case "checkbox":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).chk( value );
                    break;
                case "select":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).sSV( value );
                    break;
                case "img":
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).atr("src", value );
                    break;
                default:
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).v( value );
                    break;
                }                
            }            
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
                console.log( this.opt.id );
            if( this.opt.addPraefix === "" ) {
                switch( this.opt.type ) {
                case "checkbox":
                    return nj( this.opt.id ).chk();
                    break;
                case "select":
                    return nj( this.opt.id ).gSV().join();
                    break;
                case "img":
                    return nj( this.opt.id ).atr( "src" );
                    break;
                case "stars":
                    console.log(  );
                    return nj().els( this.opt.id ).children[1].getAttribute( "width" ) / 20;
                    break;
                default:
                    return nj( this.opt.id ).v();    
                    break;
                }
            } else {
                switch( this.opt.type ) {
                case "checkbox":
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).chk();
                    break;
                case "select":
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).gSV().join();
                    break;
                case "stars":
                    console.log( nj().els( "#" + this.opt.addPraefix + "_" + this.opt.id ).children[1].getAttribute( "width" ) );
                    return 1;
                    break;
                default:
                    return nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).v();    
                    break;
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
                        fieldHTML += '<select id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ' + this.opt.addAttr + " ";    
                    } else {
                        fieldHTML += '<select id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ' + this.opt.addAttr + " ";
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<select id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ' + this.opt.addAttr + " ";
                    } else {
                        fieldHTML += '<select id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ' + this.opt.addAttr + " ";
                    }
                }
                fieldHTML += ' class="cSelect ' + this.opt.addClasses + ' " title="' + this.opt.title +'" ';
                fieldHTML += this.opt.addAttr + '>' + this.opt.options + '</select>';
                this.tmpEl = htmlToElement( fieldHTML );
                if( typeof this.opt.value !== "undefined" && this.opt.value != null ) {
                    this.tmpValueArry = ( "" + this.opt.value ).split( "," );
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
            case "time":
            case "file":
            case "number":
            case "datetime-local":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" maxlength="' + this.opt.maxLength + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" maxlength="' + this.opt.maxLength + '" ';
                    }
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" maxlength="' + this.opt.maxLength + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + ' maxlength="' + this.opt.maxLength + '" ';
                    }
                }
                if( typeof this.opt.minValue !== "undefined" ) {
                    fieldHTML += ' min="' + this.opt.minValue + '"';
                }
                if( typeof this.opt.maxValue !== "undefined" ) {
                    fieldHTML += ' max="' + this.opt.maxValue + '"';
                }
                if( typeof this.opt.maxLength !== "undefined" ) {
                    fieldHTML += ' maxlength="' + this.opt.maxLength + '"';
                }

                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '" type="' + this.opt.type + '" value="' + this.opt.value + '" title="' + this.opt.title + '">';
                this.tmpEl = htmlToElement( fieldHTML );
                if( typeof this.opt.options !== "undefined" && this.opt.type === "text" ) {
                    tmpId = "list_" + this.tmpEl.id;
                    this.tmpEl.setAttribute("list", tmpId );
                }
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  );
                if( typeof this.opt.options !== "undefined" && this.opt.type === "text" ) {
                    this.opt.options = this.opt.options.replaceAll( "value=", "");
                    el = nj().cEl( "datalist" );
                    el.id = "list_" + this.tmpEl.id;
                    nj( el ).htm( this.opt.options );
                    fieldElements.push( el  );
                }
            break;
            case "but":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '"';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '"';
                    }
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '"';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '" type="button" value="' + this.opt.value + '">';
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
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<input id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<input id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                if( this.opt.value == true ) {
                    fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '" type="checkbox" checked ' + 'title="' + this.opt.title + '">';
                } else {
                    fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '" type="checkbox" ' + 'title="' + this.opt.title + '">';
                }
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "button":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" title="' + this.opt.title + '"';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" title="' + this.opt.title + '"';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '"  title="' + this.opt.title + '"';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '"  title="' + this.opt.title + '"';
                    }
                }
                if( typeof this.opt.value === "undefined" ) this.opt.value = "";
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '">' + this.opt.value + '</button>';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "img":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<img id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<img id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<img id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<img id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                let img = new Image(), w, h;
                img.src = this.opt.value;
                img.onload = function( e ) {
                    let c = this.width;    
                }
                if( img.width / img.height >= 1 ) {
                    w = "width=100";
                    h = "height=auto";
                } else {
                    w = "width=auto";
                    h = "height=100";
                }
                fieldHTML += " " + w + " " + h + " ";
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '" src="' + this.opt.value + '">';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "recordPointer":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<button id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<button id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '">' + this.opt.value + '</button>';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            case "stars":
                if( typeof this.opt.index !== "undefined" ) {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<div id="' + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<div id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '_' + this.opt.index + '" data-dvar="' + this.opt.dVar + '" ';
                    }                    
                } else {
                    if( this.opt.addPraefix === "" ) {
                        fieldHTML += '<div id="' + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';    
                    } else {
                        fieldHTML += '<div id="' + this.opt.addPraefix + "_" + this.opt.id.substring( 1 ) + '" data-dvar="' + this.opt.dVar + '" ';
                    }
                }
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClasses + '">';
                fieldHTML += '<img src="library/css/icons/star_bar.png" width="100" style="position: relative;z-index: 1">';
                fieldHTML += '<img src="library/css/icons/background_yellow.png" width="' + parseFloat(this.opt.value) * 20 + '" height="20" style="position: relative; left: -100px; z-index: 0">';
                fieldHTML += '</div>';
                this.tmpEl = htmlToElement( fieldHTML );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
            default:
                // statements_def
                break;
        }        
        if( this.opt.widthDiv ) {
            el = nj().cEl( "div" );
            if( this.opt.addPraefix === "" ) {
                el.id = 'div_' + this.opt.id.substring( 1 );    
            } else {
                el.id = this.opt.addPraefix + '_div_' + this.opt.id.substring( 1 );    
            }
            nj( el ).aCl( "divField_" + this.opt.id.substring( 1 ) );
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
}
