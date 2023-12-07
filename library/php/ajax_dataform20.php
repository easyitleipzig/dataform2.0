<?php
session_start();
error_reporting( E_ALL ^E_NOTICE );
date_default_timezone_set('Europe/Berlin');
// fetch call to $_POST variables
$json = file_get_contents("php://input");
if (!empty($json)) {
    $data = json_decode($json, true);
    foreach ($data as $key => $value) {
        $_POST[$key] = $value;
    }
}
// end fetch
$return = new \stdClass();

$return -> command = $_POST["command"];
if( isset( $_POST["param"] ) ) {
    $return -> param = $_POST["param"];
}
$settings = parse_ini_file('../../ini/settings.ini', TRUE);

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
require_once("functions.php");
if( isset( $_POST["data"] ) ) $_POST["data"] = json_decode( $_POST["data"] ); 
foreach ( $_POST as &$str) {
    //var_dump($str);
    $str = replaceUnwantetChars($str);
}
require_once( "classes/DataForm20.php" );
$df = new \DataForm( $db_pdo, $_POST["table"], $_POST['fields'], $_POST["fieldDefinitions"] );

switch( $_POST["command"]) {
    case "getFieldDefinitions":
        $return -> dVar = $_POST["dVar"];
        $return -> fieldDefs = $df -> fieldDefs;
        $return -> primaryKey = $df -> primaryKey;
        print(json_encode( $return ));
    break;
    case "getRecords":
        $return -> dVar = $_POST["dVar"];    
        if( !isset( $_POST['countPerPage'] ) ) $_POST['countPerPage'] = null;
        $return -> records = $df -> getRecords( $_POST['fields'], $_POST['orderBy'],  $_POST['whereClausel'],  $_POST['pageNumber'], $_POST['countPerPage'],  $_POST['hasNew'] );
        print(json_encode( $return ));
    break;

}
