<?php
session_start();
if( !isset( $_SESSION["user_id"] ) ) $_SESSION["user_id"] = 1;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>Dataform-Test</title>

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
<!--
<script src="library/javascript/init_video.js"></script>
-->
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

    $q = "SELECT id as value, salutation as text from salutation order by id asc";
    $s = $db_pdo -> query( $q );
    $r = $s -> fetchAll( PDO::FETCH_CLASS );
    $l = count( $r );
    $i = 0;
    $option = "";
    while ($i < $l ) {
        // code...
        $option .= '<option value="' . $r[$i]->value . '">' . $r[$i]->text . '</option>';
        $i += 1;
    }
    print_r( "var list_salutation = '" . $option . "';\n" );
    echo "let optRole = '";                        
    $query = "SELECT * FROM role";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["role"] . "</option>";
        $i += 1;
    }
    echo "'\n";
    echo "let optUser = '";                        
    $query = "SELECT id, concat( lastname, ', ', firstname ) as name FROM user ORDER BY lastname";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo '<option value="' . $result[$i]["id"] . '">' . str_replace("'", "\'", $result[$i]["name"]) . '</option>';
        $i += 1;
    }
    echo "'\n";
    echo "const currentUser = " . $_SESSION['user_id'] . "\n";
    //var_dump($option);
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
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "curr_date",
            label: "aktuelles Datum",
            type: "input_date",
            default: new Date().addHours(1).toISOString().replace("T", " ").replace("Z", "").split(" ")[0], // current date without hours
            addClasses: "cDate",
            widthLabel: true,
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "user_id",
            label: "Name",
            type: "select",
            addClasses: "cVal_val_select",
            options: optUser,
            default: currentUser, // current user
        },
        {
            field: "link",
            label: "Link",
            type: "input_text",
            addAttr: "placeholder='Link einfügen'",
            widthLabel: true,
        },
        {
            field: "title",
            label: "Titel",
            type: "input_text",
            widthLabel: true,
        },
        {
            field: "description",
            label: "Beschreibung",
            type: "textarea",
            widthLabel: true,
        },
/*

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
    table: "video_recommended", 
    fields: "id,curr_date,user_id,link,title,description",
    addPraefix: "df1_",
    formType: "list", 
    validOnSave: true, 
    classButtonSize: "cButtonMiddle",
    fieldDefinitions: fields,
    countPerPage: 2,
    currentPage: 0,
    hasPagination: false,
    countRecords: undefined,
    filter: "id = '0'",
    autoOpen: false,
/*
    orderArray: ["val_varchar", "val_int"],
    searchArray: [
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
            {
                field: "val_date",
                type: "select",
                options: optDate.replaceAll( "[field]", "val_date" ),
                value: ">-1",
                sel: "area",
            },

        ]
*/
    /*additionalFields: additionalFields, */

} );

(function() {
    Df.init();
})();
</script>
</body>
</html>
