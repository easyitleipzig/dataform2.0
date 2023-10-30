//javascript
innerCheckValidity = function( field ) {
    console.log( field );    
}

class Field {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            id:                 undefined, // necessary - id of field; fieldname in databasetable
            dVar:               undefined, // necessary - var of field object
            index:              undefined,
            value:              undefined, // value of field
            label:              "", // label of field - is id if not set
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
            onFocus:            undefined,
            onBlur:             undefined,
            onChange:           undefined,
            onClick:            undefined,
            onDblClick:         undefined,
        }
        let showOnInit = true,
            boxId = "",
            tmpClasses = "",
            tmpEl = {}, 
            tmpEls;
        Object.assign( this.opt, param );
        if( this.opt.label === "" ) this.opt.label = this.opt.id;
        if( typeof this.opt.onFocus === "function" ) {

        }
    }
    innerCheckValidity = function( field ) {
        let tmp;
        if( this.opt.addPraefix === "" ) {
            if( typeof this.opt.index !== "undefined" ) {
                tmp = '#' + this.opt.id + '_' + this.opt.index;
            } else {
                tmp =  '#' + this.opt.id;
            }
        } else {
            if( typeof this.opt.index !== "undefined" ) {
                tmp = '#' + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index;
            } else {
                tmp =  '#' + this.opt.addPraefix + "_" + this.opt.id;
            }
        }
        if( nj( tmp ).tag() === "SELECT" ) {
            //console.log( nj( tmp ).gSV() );
            //console.log( nj(tmp).Dia() );            
        }
        let tmpValid = nj(tmp).Dia().opt.valid;
        let l = tmpValid.length;
        let i = 0;
        while ( i < l ) {
            console.log( tmpValid[ i ] );
            switch( tmpValid[ i ] ) {
                case "not 0":
//                    console.log( nj( tmp ).tag() );
                    if( nj( tmp ).tag() === "SELECT" ) {
                        if( nj( tmp ).gSV().includes('0') && nj( tmp ).gSV().length === 1 ) {
                            console.log( "is 0" );
                        }            
                    } else {
                        if( nj( tmp ).v() == "0" ) {
                            console.log( "is 0" );
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
        console.log( nj( this ).Dia() );

        //nj( this ).Dia().innerCheckValidity();
        executeCode( this.dataset.dvar + ".innerCheckValidity(" + this.dataset.dvar + ");" );
    }
    setActions = function( field ) {
        if( typeof this.opt.onFocus === "function" ) {
            nj( field ).on( "focus", this.opt.onFocus );          
        }
        if( typeof this.opt.onBlur === "function" ) {
            nj( field ).on( "blur", this.opt.onBlur );          
        }
        if( typeof this.opt.onChange === "function" ) {
            nj( field ).on( "change", this.opt.onChange );          
            //nj( field ).on( "change", this.checkValidity() );          
        }
        if( typeof this.opt.onClick === "function" ) {
            nj( field ).on( "click", this.opt.onClick );          
        }
        if( typeof this.opt.onDblClick === "function" ) {
            nj( field ).on( "dblclick", this.opt.onDblClick );          
        }        
    }
    setValue = function( value ) {
        if( typeof this.opt.index !== "undefined" ) {
            if( this.opt.addPraefix === "" ) {
                if( this.opt.type === "checkbox" ) {
                    return nj( "#" + this.opt.id + '_' + this.opt.index ).chk( value);
                } else {
                    nj( "#" + this.opt.id + '_' + this.opt.index ).v( value );
                }
            } else {
                if( this.opt.type === "checkbox" ) {
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).chk( value );
                } else {
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id + '_' + this.opt.index ).v( value );
                }               
            }
        } else {
            if( this.opt.addPraefix === "" ) {
                if( this.opt.type === "checkbox" ) {
                    nj( "#" + this.opt.id ).chk( value );
                } else {
                    nj( "#" + this.opt.id ).v( value );
                }               
                
            } else {
                if( this.opt.type === "checkbox" ) {
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).chk( value );
                } else {
                    nj( "#" + this.opt.addPraefix + "_" + this.opt.id ).v( value );
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
        let fieldHTML = "", tmpValueArry = [], el, i, l, fieldElements = [];
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
        //console.log( this.opt );
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
                console.log( this.tmpEl );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
                // statements_1
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
                console.log( this.tmpEl );
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
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
                fieldHTML += ' class="c' + uppercaseWords( this.opt.type ) + ' ' + this.opt.addClass + '" type="checkbox" checked>' + this.opt.value + '</button>';
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
/*
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
                this.setActions( this.tmpEl );
                fieldElements.push( this.tmpEl  )
            break;
*/
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
}
