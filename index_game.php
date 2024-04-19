<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>Spieleverwaltung</title>

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="stylesheet prefetch" href="library/css/DataForm20.css">

</head>

<body>
    <input type="button" name="" id="showDF" data-dvar="Df">
<div id="target">
    <div id="targetBasis">&nbsp;</div>

</div>
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/main.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/Field20.js"></script>
<script src="library/javascript/RecordSet20.js"></script>
<script src="library/javascript/Dataform20.js"></script>
<script src="library/javascript/MessageDR.js"></script>
<script>
    <?php
    $settings = parse_ini_file('ini/settings.ini', TRUE);
    $dns = $settings['database']['type'] . 
                ':host=' . $settings['database']['host'] . 
                ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') . 
                ';dbname=' . $settings['database']['schema'];
    try {
        $db_pdo = new \PDO( $dns, $settings['database']['username'], $settings['database']['password'], array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8') );
        $db_pdo -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db_pdo -> setAttribute( PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false );
    }
    catch( \PDOException $e ) {
        $return -> command = "connect_error";
        $return -> message = $e->getMessage();
        print_r( json_encode( $return ));
        die;
    }
   ?>
let fields = [
        {
            type: "recordPointer",
            value: "&nbsp;",
            field: "recordPointer",
            baseClass: "cButtonMiddle",
        },
        {
            field: "id",
            label: "Id",
            type: "input_text",

        },
/*
        {
            field: "dummy",
            label: "dummy",
            value: new Date().addHours(1).toISOString().replace("T", " ").replace("Z", "").split(" ")[0], // current date without hours
            baseClass: "cDummy",
            type: "input_date",

        },
        {
            field: "val_dec",
            label: "Dec",
            type: "input_text",
            addClasses: "cDec",
        },
        {
            field: "val_varchar",
            label: "val_varchar",
            type: "input_text",
            addClasses: "cVal_varchar",
            valid: ["not empty", "is email"],
        },

        {
            field: "val_int",
            label: "val_int",
            type: "input_number",
            addClasses: "cVal_val_int",
            minValue: 1,
        },
        {
            field: "val_select",
            label: "val_select",
            type: "select",
            addClasses: "cVal_val_select",
            options: optRole,
        },
        {
            field: "val_select_multi",
            label: "val_select_multi",
            type: "select",
            addClasses: "cVal_val_select_multi",
            addAttr: "multiple",
            options: optRole,
        },
        {
            field: "val_img",
            label: "val_img",
            type: "img",
            addClasses: "cVal_img",
            widthDiv: true,
        },
        {
            field: "val_checkbox",
            label: "val_checkbox",
            type: "checkbox",
            addClasses: "cVal_checkbox",
        },
        {
            field: "val_stars",
            label: "val_stars",
            type: "stars",
            addClasses: "cVal_stars",
            onClick: function( event ) {
                console.log( nj().els(this).children[1] );
              var rect = nj().els(this).getBoundingClientRect(); 
              var x = event.clientX - rect.left; 
              var y = event.clientY - rect.top; 
               
              console.log(parseInt(x/20) + 1);
              nj().els(this).children[1].setAttribute("width", (parseInt(x/20) + 1)*20 ) 
            }
        },
        {
            field: "button_addKey",
            type: "button",
            baseClass: "cAddButton",
            addClasses: "cButtonAddKey",
            value: "&nbsp;",
            maxLength: "0",
            onClick: function () {
                // content
                console.log( nj( this ).Dia("dvar", 5 ) );
            }
        },
        {
            field: "button_setValue",
            type: "input_but",
            baseClass: "cAddButton cButtonMiddle",
            addClasses: "cButtonSetValuey",
            value: "&nbsp;",
            maxLength: "0",
            onClick: function () {
                // content
                console.log( nj( this ).Dia().tmpEl );
            }
        },
*/
    ];
// Df;
var Df = new DataForm( { 
    dVar: "Df", 
    id: "#Df", 
    table: "game", 
    fields: "id,room_id,name,type,player,current_player,current_move,is_ready,is_started",
    addPraefix: "df1_",
    formType: "html", 
    validOnSave: true, 
    classButtonSize: "cButtonMiddle",
    fieldDefinitions: fields,
    countPerPage: 2,
    currentPage: 0,
    hasPagination: true,
    countRecords: undefined,
    //filter: "id = '1'",
    orderArray: ["val_varchar", "val_int"],
    searchArray: [
/*
            {
                field: "val_varchar",
                type: "input_text",
                value: "",
                sel: "value",
            },
            {
                field: "val_select",
                type: "select",
                options: "<option value='>-1'>alle</option>" + optRole,
                value: ">-1",
                sel: "value",
            },
            {
                field: "val_select_multi",
                type: "select",
                options: "<option value='>-1'>alle</option>" + optRole,
                addAttr: "multiple",
                value: ">-1",
                sel: "value",
            },
            {
                field: "val_checkbox",
                type: "select",
                options: "<option value='>-1'>alle</option><option value=0>aus</option><option value='1'>an</option>",
                value: ">-1",
                sel: "value",
            },
/*            {
                field: "val_test",
                type: "select",
                options: optDate.replaceAll( "[field]", "val_test" ),
                value: ">-1",
                sel: "area",
            },
*/
        ]
    /*additionalFields: additionalFields, */
} );
(function() {
    Df.init();
})();
</script>
</body>
</html>
