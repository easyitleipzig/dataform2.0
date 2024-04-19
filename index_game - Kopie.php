<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>Game -Admin</title>

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
    echo "let optUser = '";                        
    $query = "SELECT id, concat( REPLACE(lastname, '\'', '´'), ', ', firstname  ) as userName FROM user where id > 0 order by lastname";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["userName"] . "</option>";
        $i += 1;
    }
    echo "'\n";
    echo "let optGameType = '";                        
    $query = "SELECT * FROM game_type";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo '<option value="' . $result[$i]["id"] . '">' . $result[$i]["name"] . "</option>";
        $i += 1;
    }
    echo "'\n";
    //var_dump($option);
   ?>
let additionalFieldDefs = [
    {
        label: "test",
    },
    {

    }
];

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
            field: "room_id",
            label: "Raum",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "type",
            label: "Spieltyp",
            type: "select",
            addClasses: "cVal_val_select",
            options: optGameType,
        },
        {
            field: "player",
            label: "Spieler",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "current_player",
            label: "akt. Spieler",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "is_ready",
            label: "bereit",
            type: "checkbox",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "is_started",
            label: "gestartet",
            type: "checkbox",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "current_move",
            label: "akt. Zug",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
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
    ];
// Df;
var Df = new DataForm( { 
    dVar: "Df", 
    id: "#Df", 
    table: "game", 
    fields: "id,room_id,name,type,player,current_player,is_ready,is_started,current_move",
    addPraefix: "df1_",
    formType: "list",
    autoOpen: true, 
    validOnSave: true, 
    additionalFieldDefs: additionalFieldDefs,
    classButtonSize: "cButtonMiddle",
    fieldDefinitions: fields,
    countPerPage: 2,
    currentPage: 0,
    hasPagination: true,
    countRecords: undefined,
    //filter: "id = '1'",
    boundForm: ["Df_player"],
    boundFields: [ { from: "id", to: "game_id" } ],
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
        ],
    onShow:     function( args ) {
        console.log( nj().bDV(this.dVar) );   
    }
    /*additionalFields: additionalFields, */
} );
var Df_player = new DataForm( { 
    dVar: "Df_player", 
    id: "#Df_player", 
    table: "game_player", 
    fields: "id,game_id,player_number,player_id",
    addPraefix: "df1_",
    formType: "html", 
    validOnSave: true, 
    additionalFieldDefs: additionalFieldDefs,
    classButtonSize: "cButtonMiddle",
    fieldDefinitions: [
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
            field: "game_id",
            label: "Spielnummer",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "player_number",
            label: "Spielernummer",
            type: "input_text",
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        {
            field: "player_id",
            label: "Spieler",
            type: "select",
            options: optUser,
            /*onFocus:             function( args ) {
                console.log( this );
            },*/
        },
        ],
/*    countPerPage: 2,
    currentPage: 0,
    hasPagination: true,
*/    countRecords: undefined,
    //filter: "id = '1'",
    boundForm: ["Df_player"],
    boundFields: [ { from: "id", to: "game_id" } ],
    //orderArray: ["val_varchar", "val_int"],
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
    Df_player.init();

})();
            
</script>
</body>
</html>
