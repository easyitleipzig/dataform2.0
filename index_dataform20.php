<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>Dataform-Test</title>

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
</head>

<body>
<div id="target">
    <div id="targetBasis">&nbsp;</div>

</div>
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/main.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/Field.js"></script>
<script src="library/javascript/RecordSet20.js"></script>
<script src="library/javascript/Dataform20.js"></script>
<script>
var additionalFieldDefs = [
    {
        id: "test",
    },
    {

    }
];

var additionalFields = [
    {
        position: 3,
        fieldDef: {
            id: "neu",
            default: "neu",
            field: undefined,
            default: function(){},
        }

    }
];

var Df;
Df.init();
(function() {
    Df = new DataForm( { dVar: "Df", table: "test_table", /*additionalFields: additionalFields*/ } );
    console.log( Df.opt );
    //Df.opt.recordsets[0].opt.fields[0].opt.dVar = "Df.opt.recordsets.0.opt.fields.0";
})();
</script>
</body>
</html>
