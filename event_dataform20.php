<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <title>Event-Test</title>

    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="stylesheet prefetch" href="library/css/DataForm20.css">

</head>

<body>
<article>
    <div><h1>Allgemeines</h1></div>
    <div>&nbsp;</div>
    <p>Über dieses Formular kannst du die Einstellungen für den Kalender des Onlineangebots verwalten</p>
    <p>Über dieser <a href="#" id="showPattern">Link</a> verwaltest du die Terminvorlagen.
    </p><div id="divPattern"></div><p> Hier kannst Du die <a href="#" id="showFormat">Terminformate</a> verwalten.</p><div id="divFormat"></div>
    <p>Über dieser <a href="#" id="showPlace">Link</a> verwaltest du die Terminorte. <a href="#" id="showRoles">Hier</a> können die Gruppen und Ihre Nutzer bearbeitet werden.</p><div id="divPlace"></div><div id="divRoles"> 
    
    </div>
</article>
<article>
    <div><h1>Termine</h1></div>
    <div>&nbsp;</div>
    <div id="Df">
    </div>
</article>
<article>
    <div><h1>Teilnehmer</h1></div>
    <div>&nbsp;</div>
    <div id="Df_part">
    </div>
</article>
    
</article>
<script src="library/javascript/no_jquery.js"></script>
<script src="library/javascript/easyit_helper_neu.js"></script>
<script src="library/javascript/main.js"></script>
<script src="library/javascript/DropResize.js"></script>
<script src="library/javascript/DialogDR.js"></script>
<script src="library/javascript/Field20.js"></script>
<script src="library/javascript/RecordSet20.js"></script>
<script src="library/javascript/Dataform20.js"></script>
<script src="library/javascript/MessageDR.js"></script>
<script src="library/javascript/init_admin_event.js"></script>
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

    echo "let optCategory = '";                        
    $query = "SELECT id, name FROM event_format";
    $stm = $db_pdo -> query( $query );
    $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $l = count( $result );
    $i = 0;
    while( $i < $l ) {
        echo '<option value="' . $result[$i]["id"] . '">' . str_replace("'", "\'", $result[$i]["name"]) . '</option>';
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
    //var_dump($option);
   ?>
/*
let additionalFieldDefs = [
    {
        label: "test",
    },
    {

    }
];
let listOptions = [
        {
            field: "val_varchar",
            options: list_salutation,
        }
    ]
*/
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
        {
            field: "category",
            label: "Kategorie",
            type: "select",
            options: optCategory,

        },
        {
            field: "title",
            label: "Titel",
            type: "input_text",

        },
        {
            field: "start_date",
            label: "Startd.",
            type: "input_date",

        },
        {
            field: "start_time",
            label: "Startz.",
            type: "input_time",

        },
        {
            field: "end_date",
            label: "Endd.",
            type: "input_date",

        },
        {
            field: "end_time",
            label: "Endz.",
            type: "input_time",

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
        },
        {
            field: "val_int",
            label: "val_int",
            type: "input_number",
            addClasses: "cVal_val_int",
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
    table: "event", 
    fields: "id,category,title,start_date,start_time,end_date,end_time",
    addPraefix: "df1_", 
    formType: "html", 
    validOnSave: true, 
    //additionalFieldDefs: additionalFieldDefs,
    classButtonSize: "cButtonMiddle",
    fieldDefinitions: fields,
    //optionLists: listOptions,
    countPerPage: 5,
    currentPage: 0,
    countRecords: undefined,
    hasPagination: true,
    filter: "",
    boundForm: ["Df_part"],
    boundFields: [ { from: "id", to: "event_id" } ],
    orderArray: ["title", "start_date"],
/*
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
                field: "val_test",
                type: "select",
                options: optDate.replaceAll( "[field]", "val_test" ),
                value: ">-1",
                sel: "area",
            },

        ]
    /*additionalFields: additionalFields, */
} );
var Df_part = new DataForm( { 
    dVar: "Df_part", 
    id: "#Df_part", 
    table: "event_participate", 
    fields: "id,event_id,user_id,remind_me,count_part",
    formType: "html", 
    addPraefix: "df2_", 
    validOnSave: true, 
    //additionalFieldDefs: additionalFieldDefs,
    classButtonSize: "cButtonMiddle",
    fieldDefinitions:  [
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
        {
            field: "event_id",
            label: "EventId",
            type: "input_text",

        },
        {
            field: "user_id",
            label: "Nutzer",
            type: "select",
            options: optUser,

        },
        {
            field: "remind_me",
            label: "r",
            type: "checkbox",
        },
        {
            field: "count_part",
            label: "TN",
            type: "input_number",
        },
        ],
    //optionLists: listOptions,
    countPerPage: 0,
    currentPage: 0,
    countRecords: undefined,
    hasPagination: false,
    filter: undefined,
    afterDelete: afterDelete,
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
                field: "val_test",
                type: "select",
                options: optDate.replaceAll( "[field]", "val_test" ),
                value: ">-1",
                sel: "area",
            },

        ]
    /*additionalFields: additionalFields, */
} );
(function() {
    Df.init();
    Df_part.init();
})();
</script>
</body>
</html>
