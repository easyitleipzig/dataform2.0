evaluateAdminEvent = function ( data ) {
    // content
    let jsonobject, l, i, m, j, tmp, decVal, strVal;
    if( typeof data === "string" ) {
        jsonobject = JSON.parse( data );
    } else {
        jsonobject = data;
    }
    if( !nj().isJ( jsonobject ) ) {
        throw "kein JSON-Objekt übergeben";
    }
    console.log( jsonobject );
    var df = window[ jsonobject.dVar ];
    switch( jsonobject.command ) {
        case "removeUserFromEvent":
        	break;

    }
}
const informUserAfterDeleteFromEvent = function( df, oldData ) {
	console.log( oldData.oldData[0] );
	data = {}
	data.command = "removeUserFromEvent";
	data.pVar = df.opt.dVar;
	data.eventId = oldData.oldData[0].event_id;
	data.userId = oldData.oldData[0].user_id;
	console.log( data );
	nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, evaluateAdminEvent);	
}
const informUserAfterAddToEvent = function( df, oldData ) {
	console.log( oldData.newId );
	data = {}
	data.command = "addUserToEvent";
	data.pVar = df.opt.dVar;
	data.partId = oldData.newId;
	console.log( data );
	nj().fetchPostNew("library/php/ajax_calendar_evcal.php", data, evaluateAdminEvent);	

}
