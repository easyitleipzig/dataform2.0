//javascript
nj( "input" ).on( "blur", function( e ) {   
    nj( this ).v( nj().els( this ).value.replaceAll( '"', "“" ) );
});
