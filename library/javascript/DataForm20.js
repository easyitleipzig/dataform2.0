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
            dVar:                               undefined, // necessary - var of field object
            divUpload:                          new DialogDR( { dVar: param.dVar + ".opt.divUpload", title: "Datei laden", innerHTML: DIV_UPLOAD_HTML.replaceAll( "[dVar]", param.dVar ) } ),
            rootPath:                           "library",
            recordsets:                         [],
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
        nj( "#" + this.opt.dVar + "_tFUFile" ).on( "change", function( args ) {
            console.log( nj( this ).gRO() );
            nj( this ).gRO().uploadFile();    
        }  );
    }
    evaluateDF = function ( args ) {
        // content
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
    }
    init = function () {
        // content
    }
}
