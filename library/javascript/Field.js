//javascript
class Field {                    // class for DataForm2.0
      constructor( param ) {
        this.opt = {
            id:                 undefined, // necessary - id of field; fieldname in databasetable
            index:              undefined,
            value:              undefined, // value of field
            label:               "", // label of field
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
            addClass:          "", // classes for field; e.g. "cUsusal cLabel ..."
            addAttr:            "", // additional attributes for html e.g.: 'target = "_blank" placeholder="[placeholder]"; ...' / combinitions are possible
            valid:              [], // validity ["not empty", "not null", "not undifined", "is email", "is postalcode", "is unique"]; combinitions are possible
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

        }
        let showOnInit = true,
            boxId = "",
            tmpClasses = "",
            tmpEl = {}, 
            tmpEls;
        Object.assign( this.opt, param );
    }
    getField = function() {
        let fieldHTML = "", tmpValueArry = [], i, l;
        if( this.opt.type.substring( 0, 6 ) === "input" ) {
            this.opt.type = this.opt.type.split( "_" )[1]
        }
        switch ( this.opt.type) {
            case "select":
                if( this.opt.widthLabel ) {
                    fieldHTML += "<label>" + this.opt.label + "</label>";
                }
                if( typeof this.opt.index !== "undefined" ) {
                    fieldHTML += '<select id="' + this.opt.id + '_' + this.opt.index + '" ';
                } else {
                    fieldHTML += '<select id="' + this.opt.id + '" ';
                }
                fieldHTML += ' class="cSelect ' + this.opt.addClass +'" ';
                fieldHTML += this.opt.attributes + '>' + this.opt.options + '</select>';
                this.tmpEl = htmlToElement( fieldHTML );
                if( typeof this.opt.value !== "undefined" ) {
                    this.tmpValueArry = this.opt.value.split( "," );
                    l = this.tmpEl.children.length;
                    i = 0;
                    while (i < l) {
                         if( this.tmpValueArry.includes(  this.tmpEl.children[i].value ) ) {
                            console.log( this.tmpEl.children[i].value );
                            nj( this.tmpEl.children[i] ).atr( "selected", "" );
                        } 
                        i += 1;
                    }
                }
                return this.tmpEl;
                // statements_1
                break;
            case "text":

                break;
            default:
                // statements_def
                break;
        }
        
    }
}
