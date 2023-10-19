//javascript
nj( "input" ).on( "blur", function( e ) {   
    nj().els( this ).value = nj().els( this ).value.replaceAll( '"', "“" );
});
