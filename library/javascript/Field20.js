//javascript
const STARS_WIDTH = 100;
const PATH_TO_STARS = "library/css/icons/star_foreground.png";
innerCheckValidity = function( field ) {
    console.log( field );    
}

class Field {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            dVar:               undefined,  // necessary - var of field object
            id:                 "",         // id of field - is dVar if not set
            recordset:          undefined,  // bound recordset variable
            target:             undefined,
            value:              undefined,  // value of field
            oldValue:           undefined,  // value before change
            default:            undefined,  // default value of field
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
            addPraefix:         "",             // praefix for field; e.g. "field, f_ ..."
            addClass:           "cField",       // classes for field; e.g. "cUsusal cLabel ..."
            addAttr:            "",             // additional attributes for html e.g.: 'target = "_blank" placeholder="[placeholder]"; ...' / combinitions are possible
            valid:              [],             // validity ["not empty", "not 0", "not null", "not undifined", "is email", "is postalcode", "is unique"]; combinitions are possible
            validOnSave:        false,          // checks validity on save
            options:            undefined,      // options for select field, options for input text datalist
                                /* <input list="ice-cream-flavors" id="ice-cream-choice" name="ice-cream-choice" />
                                        <datalist id="ice-cream-flavors">
                                            <option value="Chocolate"></option>
                                            <option value="Coconut"></option>
                                            <option value="Mint"></option>
                                            <option value="Strawberry"></option>
                                            <option value="Vanilla"></option>
                                        </datalist>
                                */
            variables:          {},             // optional - additional values for Field
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
            nj( "#tmpUploadId" ).atr( "id", "uploadDiv_" + this.getOnlyId() );
            nj( "#tmpDivUploadFormErrorText" ).atr( "id", "uploadErrorText_" + this.getOnlyId() );            
            nj( "#tmpFileUploadFile" ).atr( "id", "fileUploadFile_" + this.getOnlyId() );
            nj( "#fileUploadFile_" + this.getOnlyId() ).on( "change", function() {
                const [last] = this.value.split("\\").slice(-1);
                console.log(last);
            })            
            nj( "#tmpLabelUpload" ).atr( "id", "labelUpload_" + this.getOnlyId() );
            nj( "#" + "labelUpload_" + this.getOnlyId() ).atr( "for", "fileUploadFile_" + this.getOnlyId() );
        }
        if( this.opt.label === "" ) this.opt.label = this.opt.id;
        if( typeof this.opt.onFocus === "function" ) {

        }
    }
    getOnlyId = function ( args ) {
        return this.opt.id.substring( 1 );
    }
    beforeChnage = function() {
        switch( this.opt.type ) {
            case "checkbox":
                this.opt.oldValue = nj( "#" + this.opt.id ).chk();        
            break;
            case "radio":
                //this.opt.oldValue = nj( "#" + this.opt.id ).chk();        
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
    setField = function ( param ) {
        Object.assign( this.opt, param );
    }
    setValue = function( v ) {
        let els;
        switch( this.opt.type ) {
            case "select":
                nj( this.opt.id ).sSV( v );
            break;
            case "img":
                nj( this.opt.id ).atr( "src", v );
            break;
            case "bckg":
                nj( this.opt.id ).sty( "background-image", "url(" + v + ")" );
            break;
            case "radio": 
                // content
                els = nj().els( "input[name=" + this.getOnlyId() + "]" );
                let l = els.length;
                let i = 0;
                while( i < l ) {
                    if( els[ i ].value == v ) {
                        els[ i ].checked = true;
                        //continue;
                    }
                    i += 1;
                }
            break;
            case "stars":
                nj().els( this.opt.id ).children[0].style.clipPath = 'polygon(0px 0px, ' + ( v * 20 ) + '% 0px, ' + ( v * 20 ) + '% 100%, 0% 100%)';
            break;
            default:
                nj( this.opt.id ).v( v );
            break;
        }
    }
    getValue = function() {
        let els;
        switch( this.opt.type ) {
            case "select":
                return nj( this.opt.id ).gSV();
            break;
            case "radio":
                els = nj().els( "input[name=" + this.getOnlyId() + "]" );
                let l = els.length;
                let i = 0;
                while( i < l ) {
                    if( els[ i ].checked ) {
                        return els[ i ].value;
                        //continue;
                    }
                    i += 1;
                }
                break;
            case "stars":
                return parseFloat( nj().els( this.opt.id ).children[0].style.clipPath.split( "," )[1].split( "%" )[0].trim() ) / 20;
            break;
            default:
                return nj( this.opt.id ).v();
            break;
        }
    }
    getField = function( fieldDef ) {
        let tmpHTML = "", el, tmp, els = [], l, i;
        let type = this.opt.type.replace( "input_", "" );
        if( typeof fieldDef !== "undefined" ) {
            Object.assign( this.opt, fieldDef );
        }
        if( this.opt.widthLabel ) {
            tmpHTML += '<label for="' + this.getOnlyId() + '">' + this.opt.label + '</label>';
        }
        switch( type ) {
            case "radio":
                // content
                el = nj().cEl( "div" );
                el.id = this.getOnlyId();
                nj( el ).sDs( "field", this.opt.dVar )
                tmp = nj().cEl( "select" );
                tmp.innerHTML = this.opt.options;
                l = tmp.children.length;
                i = 0;
                tmpHTML = "";
                while( i < l ) {
                    tmpHTML += '<input type="radio" value="' + tmp.children[i].value + '" name="' + this.getOnlyId() + '"> ' + tmp.children[i].innerText;
                    i += 1;
                }
                el.innerHTML = tmpHTML;
                tmpHTML = el.outerHTML;
            break;
            case "checkbox":
                // content
                if( this.opt.value || this.opt.value === "true" ) {
                    tmpHTML += '<input id="' + this.getOnlyId() + '" type="checkbox" data-dvar="' + this.opt.dVar + '" checked">';
                } else {
                    tmpHTML += '<input id="' + this.getOnlyId() + '" type="checkbox" data-dvar="' + this.opt.dVar + '">';
                }
            break;
            case "stars":
                let starHTML = "";
                el = nj().cEl( "div" );
                el.id = this.getOnlyId();
                nj( el ).sDs( "field", this.opt.dVar );
                nj( el ).sty( "width", STARS_WIDTH + "px" );
                l = 5;
                i = 0;
                while( i < l ) {
                    starHTML += '<div name="' + this.getOnlyId() + '_' + i + '"  style="width: 20%; position: relative;height: 20px;top: -23px;display: inline-block; cursor: pointer;"></div>';
                    i += 1;
                }
                tmpHTML += '<div id="' + this.getOnlyId() + '" data-field="' + this.opt.dVar + '" style="height: 20px;width: ' + STARS_WIDTH + 'px; background-image: url(library/css/icons/star_bar.png); background-size: ' + ( STARS_WIDTH + 5 ) + 'px 20px;"><img src="library/css/icons/5stars.png" style="height: 20px; clip-path: polygon(0 0, ' + parseFloat( this.opt.value ) * 20 + '% 0, ' + parseFloat( this.opt.value ) * 20 + '% 100%, 0% 100%);">' + starHTML + '</div>';
            break;
            default:
                // content
                if( typeof this.opt.options === "undefined" ) {
                    tmpHTML += '<input id="' + this.getOnlyId() + '" type="' + type + '" data-dvar="' + this.opt.dVar + '" value="' + this.opt.value + '">';
                } else {
                    tmpHTML += '<input id="' + this.getOnlyId() + '" type="' + type + '" data-dvar="' + this.opt.dVar + '" list="dl_' + this.getOnlyId() + '" value="' + this.opt.value + '">';
                    tmpHTML += '<datalist id="dl_' + this.getOnlyId() + '">' + this.opt.options + '</datalist>'    
                }
            break;
        }
        tmp = nj().cEl( "div" );
        tmp.innerHTML = tmpHTML;
        if( this.opt.widthDiv ) {
            tmp.id = "div" + this.getOnlyId();
            els.push( tmp );
        } else {
            let l = tmp.children.length;
            let i = 0;
            while( i < l ) {
                els.push( tmp.children[ i ] );
                i += 1;
            }
        }
        return els;
    }
    appendField = function ( fieldDef ) {
        // content
        if( typeof fieldDef !== "undefined" ) {
            Object.assign( this.opt, fieldDef );
        }
        if( typeof this.opt.target === "undefined" ) this.opt.target = document.body;
        let field = this.getField();
        let l = field.length;
        let i = 0;
        while( i < l ) {
            nj( this.opt.target ).aCh( field[ i ] );
            i += 1;
        }
        nj( this.opt.id ).on( "click", function ( e ) {
            // content
            switch( nj( this ).Dia( "field" ).opt.type ) {
                case "stars":
                    let val = parseInt( getIdAndName( e.target.getAttribute("name") ).Id ) + 1;
                    e.target.parentNode.children[0].style.clipPath = 'polygon(0px 0px, ' + ( val * 20 ) + '% 0px, ' + ( val * 20 ) + '% 100%, 0% 100%)';
                    nj( this ).Dia( "field" ).opt.value = val;
                break;
                default:
                    // content
            
                break;
            }
        })
    }
}
