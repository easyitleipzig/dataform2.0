/* register resize/scroll */
var registerFunctionsResize = [];
var registerFunctionsScroll = [];
window.addEventListener( "resize", function(){
    let l = registerFunctionsResize.length;
    let i = 0;
    while( i < l ) {
        if( typeof registerFunctionsResize[i] !== "undefined" ) registerFunctionsResize[i]();
        i += 1;    
    }
});
window.addEventListener( "scroll", function(){
    let l = registerFunctionsScroll.length;
    let i = 0;
    while( i < l ) {
        registerFunctionsScroll[i]();
        i += 1;    
    }
});
var registerOnResize = function( args ) {
    registerFunctionsResize.push( args );
}
var registerOnScroll = function( args ) {
    registerFunctionsScroll.push( args );
}
window.addEventListener("load", function() {
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
})
/* end register resize/scroll */
/* init registerOnResize */
var dummy = function( args ) {
    let posBody = document.getElementsByTagName("body");
}
registerOnResize( dummy );
registerOnScroll( dummy );
/* end registerOnResize */
