<?php
// ajax file for calendar.php and calendar_editable.php
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
define( "ROOT", "../../"); 
//var_dump( $_POST );
foreach($_POST  as $key => $val ){
  
    // Accessing individual elements
    $i =  $key;
    $j = json_decode( $i );
    if( !is_null( $j ) ) {
        foreach( $j as  $key => $val ) {
            //if( is_numeric( $val ) ) continue;
            $_POST[$key] = $val;
        }        
    }
}

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
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once("functions.php"); 
foreach ( $_POST as &$str) {
    //var_dump($str);
    $str = replaceUnwantetChars($str);
}
switch( $_POST["command"]) {
    case "sendAddUserToEvent":
                            $i = $_POST;
                            $query = "SELECT concat( firstname, ' ', lastname) as name, email, event_participate.event_id, event_participate.role_id, role.role FROM user, event_participate, role, WHERE event_participate.user_id = user.id AND event_participate.role_id = role.id AND event_participate.id = " . $_POST["Id"];
                            
                            $stm = $db_pdo -> query( $query );
                            $result_user = $stm -> fetchAll( PDO::FETCH_ASSOC );
                            
                            $query = "SELECT * FROM event WHERE id = " . $result_user[0]["event_id"];
                            $stm = $db_pdo -> query( $query );
                            $result_event = $stm -> fetchAll( PDO::FETCH_ASSOC );
                            
                            
                            print_r( json_encode( $return ));                                                        
    break;
    case "informUserAboutDeletion":
                            print_r( json_encode( $return ));                                                        
    break;
}  
?>
