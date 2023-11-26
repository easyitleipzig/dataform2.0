<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Expires" content="Fri, Jan 01 1900 00:00:00 GMT">
	<meta http-equiv="Pragma" content="no-cache">
	<meta http-equiv="Cache-Control" content="no-cache">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="Lang" content="en">
	<meta name="author" content="">
	<meta http-equiv="Reply-to" content="@.com">
	<meta name="generator" content="PhpED 8.0">
	<meta name="description" content="">
	<meta name="keywords" content="">
	<meta name="creation-date" content="09/06/2012">
	<meta name="revisit-after" content="15 days">
	<title>DataForm 2.0</title>
</head>
<body>
	<input id="test1" data-df="df">
	<img src="library/css/icons/cPicture.png" id="test2" data-df="df">
	<div style="width: 400px; height: auto; background-color: blue;"  id="test3" data-df="df">&nbsp</div>
	<a href="#" id="test4" data-df="df">Link</a>
<div id="df"></div>
<script>
</script>
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/main.js"></script>

<script src="library/javascript/menu_calendar.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/MessageDR.js"></script>
<script src="library/javascript/Field.js"></script>
<script src="library/javascript/DataForm20.js"></script>
<script>
var df = new DataForm( { dVar: "df" } );
nj("#test1").on( "click", function( args ) {
	nj( this ).Dia("df").opt.tFUTargetElementAttr = "value";
	nj( this ).Dia("df").opt.tFUTargetElementId = "#" + this.id;
	nj( this ).Dia("df").showUploadDiv();	
})
nj("#test2").on( "click", function( args ) {
	nj( this ).Dia("df").opt.tFUTargetElementId = "#" + this.id;
	nj( this ).Dia("df").opt.tFUTargetElementAttr = "src";
	nj( this ).Dia("df").showUploadDiv("image/webp;image/png");	
})
nj("#test3").on( "click", function( args ) {
	nj( this ).Dia("df").opt.tFUTargetElementId = "#" + this.id;
	nj( this ).Dia("df").opt.tFUTargetElementAttr = "bckg";
	nj( this ).Dia("df").showUploadDiv("image/webp;image/png");	
})
nj("#test4").on( "click", function() {
	nj( this ).Dia("df").opt.tFUTargetElementId = "#" + this.id;
	nj( this ).Dia("df").opt.tFUTargetElementAttr = "href";
	nj( this ).Dia("df").opt.tFUTargetElementLinkText = "weiterlesen";
	nj( this ).Dia("df").showUploadDiv("image/webp;image/png");	
})

</script>
</body>
</html>
