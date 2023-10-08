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
/*
if( isset( $_POST["additionalButtons"] ) && $_POST["additionalButtons"]  != "" ){
    require_once( "../inc/" . $_POST["additionalButtons"] );    
} else {
    $additionalButtons = [];
}
if( isset( $_POST["additionalButtonsNewRecord"] ) ){
    require_once( "../inc/" . $_POST["additionalButtonsNewRecord"] );    
} else {
    $additionalButtonsNewRecord = [];
}
*/
switch( $_POST["command"]) {
    case "initForm":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( $db_pdo, $_POST["pageSource"], $_POST["fields"] );
                            $return -> firstRecord = $df -> firstRecord;
                            $return -> dVar = $_POST["dVar"];
                            $return -> divId = $_POST["divId"];
                            print_r( json_encode( $return ));   
    break;
    case "showRecordList":
    case "showRecordHtml":
                            require_once( "classes/DataFormNew.php");
                            if( is_null( json_decode( stripslashes( $_POST["additionalButtons"] )  ) ) ) {
                                require_once( "../inc/" . $_POST["additionalButtons"] );    
                            } else {
                                if( $_POST["additionalButtons"] !== "\"\"" ) {
                                    $additionalButtons = json_decode( $_POST["additionalButtons"] );
                                    
                                } else {
                                    $additionalButtons = [];
                                }
                            }
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"], 
                                $_POST["fieldPraefix"], 
                                $_POST["classPraefix"], 
                                $_POST["fields"],
                                $_POST["currentPage"], 
                                $_POST["countPerPage"],
                                $_POST["isNew"] 
                            );
                            $df -> setFieldAddAttr( $_POST["fieldAddAttr"] );
                            $return -> data = $df -> getDataList( $_POST["searchString"], $_POST["orderString"] );
                            $return -> html = $df -> getHTMLDataList( 
                                $_POST["searchString"], 
                                $_POST["orderString"], 
                                $_POST["fieldDefs"], 
                                $_POST["recPraefix"],
                                $_POST["labels"],
                                $_POST["widthSave"], 
                                $_POST["widthDel"], 
                                $_POST["fieldsWidthDiv"],
                                $_POST["fieldsWidthLabel"],
                                $additionalButtons
                            );
                            $return -> newRecordHtml = $df -> getHTMLineListNewRecord(
                                $_POST["fieldDefs"], 
                                $_POST["recPraefix"],
                                $_POST["labels"],
                                $_POST["widthSave"], 
                                $_POST["fieldsWidthLabel"],
                                $_POST["fieldsWidthDiv"],
                                $additionalButtons                                                        
                            );
                            if( $df -> isNew === "true" && intval( $_POST["currentPage"] ) + 1 === $df -> countPages ) {
                                $return -> html -> html .= $return -> newRecordHtml;    
                            }
                            $return -> dVar = $_POST["dVar"];
                            $return -> divId = $_POST["divId"];
                            $return -> hasPag = $_POST["hasPag"];
                            $return -> divPag = $_POST["divPag"];
                            $return -> currentPage = $_POST["currentPage"];
                            $return -> currentRecord = $_POST["currentRecord"];
                            //$return -> boundForm = $_POST["boundForm"];
                            $return -> countPages = $df -> countPages;
                            $return -> countRecords =$df -> countRecords;
                            $return -> success = $return -> data -> success;
                            $return -> message = $return -> data -> message;
                            //$return -> labelLine = $return -> data -> labelLine;                
                            $return -> labelLine = $return -> html -> labelLine -> html;
                                         
                                $return -> data = $return -> data -> data;                
                                $return -> html = $return -> html -> html;
                            
                            print_r( json_encode( $return ));   
    break;
//    case "showRecordHtml":
/*
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"], 
                                $_POST["fieldPraefix"], 
                                $_POST["classPraefix"], 
                                $_POST["fields"] 
                            );
                            $return -> html = $df -> getHTMLDataHtml( 
                                $_POST["searchString"], 
                                $_POST["orderString"], 
                                $_POST["fieldDefs"], 
                                $_POST["recPraefix"], 
                                $_POST["fieldPraefix"],
                                $_POST["widthLabels"],
                                $_POST["fieldsWidthLabel"],
                                $_POST["labels"]
                            );             
                            $return -> dVar = $_POST["dVar"];                              
                            $return -> divId = $_POST["divId"];  
                            $return -> success = $return -> html -> success;
                            $return -> message = $return -> html -> message;                
                            print_r( json_encode( $return ));
*/   
//    break;
    case "saveRecordList":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"] 
                            );
                            $return -> result = $df -> saveRecord( $_POST["data"], $_POST["currentRecord"] );
                            $return -> dVar = $_POST["dVar"];                              
                            $return -> divId = $_POST["divId"];  
                            $return -> currentRecord = $_POST["currentRecord"];  
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;                
                            print_r( json_encode( $return ));   
    break;
    case "newRecordList":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"] 
                            );
                            $return -> result = $df -> newRecord( $_POST["data"] );
                            $return -> dVar = $_POST["dVar"];                              
                            $return -> divId = $_POST["divId"];
                            $return -> newId = $return -> result -> newId;  
                            $return -> currentRecord = $_POST["currentRecord"];  
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            if( $return -> success ) {
                                
                            }                
                            print_r( json_encode( $return ));   
    break;
    /*
    case "deleteRecordList":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"] 
                            );
                            $return -> result = $df -> deleteRecord( $_POST["currentRecord"] );
                            $return -> dVar = $_POST["dVar"];                              
                            $return -> divId = $_POST["divId"];  
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;                
                            print_r( json_encode( $return ));   
    break;
    */
    case "setCurrentRecordId":
                            require_once( "classes/DataFormNew.php");
                            $return -> dVar = $_POST["dVar"];
                            $df = new \DataFormNew( 
                                $db_pdo, 
                                $_POST["pageSource"], 
                                $_POST["currentRecord"] 
                            );
                            $return -> result = $df -> setCurrentRecordId( $_POST["praefix"], $_POST[ "id" ] );
                            $return -> Id = $_POST[ "id" ];
                            $return -> elementId = $_POST[ "elementId" ];
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;                
                            print_r( json_encode( $return ));                             
    break;
    case "deleteRecord":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( $db_pdo, $_POST["pageSource"], $_POST["currentRecord"] );
                            $result = $df -> deleteRecord( $_POST["currentRecord"] );
                            $return -> oldData = $result -> oldData;
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            $return -> dVar = $_POST["dVar"];
                            $return -> id = $_POST["currentRecord"];
                            //$return -> oldData = $result -> oldData;
                            $return -> pageSource = $_POST["pageSource"];
                            print_r( json_encode( $return ));    
    break;
    case "sendMailAfterDelete":
                            $return -> dVar = $_POST["dVar"];
                            $q = "select * from event where id = " . $_POST["eventId"];
                            $s = $db_pdo -> query( $q );
                            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                            require_once( "classes/InformUser.php");
                            $iu = new \InformUser( $db_pdo, "both", 27, 0, 0, $_POST["userId"] );
                            $conEMail = "Du wurdest vom Termin „" . $r[0]["title"] . "” am " . getGermanDateFromMysql( $r[0]["start_date"] ) . " um " . $r[0]["start_time"] . "Uhr
                            von " . $_SESSION["firstname"] . " "   . $_SESSION["lastname"] . " gelöscht. Bitte aktualisiere die Termine in deiner Termin-App.";
                            $tEMail = "Teilnahmelöschung aus Termin";
                            $tMess = $tEMail;
                            $iu -> sendUserInfo( $tEMail, $tEMail, $conEMail, $conEMail);
                            print_r( json_encode( $return ));    
    break;
    case "sendMailAfterNewParticipate":
                            $return -> dVar = $_POST["dVar"];
                            $q = "select event.*, event_participate.user_id from event_participate, event where event.id = event_participate.event_id AND event_participate.id = " . $_POST["eventParticipateId"];
                            $s = $db_pdo -> query( $q );
                            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                            require_once( "classes/InformUser.php");
                            $iu = new \InformUser( $db_pdo, "both", 27, 0, 0, $r[0]["user_id"] );
                            $conEMail = "Du wurdest zum Termin „" . $r[0]["title"] . "” am " . getGermanDateFromMysql( $r[0]["start_date"] ) . " um " . $r[0]["start_time"] . "Uhr
                            von " . $_SESSION["firstname"] . " "   . $_SESSION["lastname"] . " hinzugefügt. Bitte aktualisiere die Termine in deiner Termin-App.";
                            $tEMail = "Teilnahmehinzufügung zu Termin";
                            $tMess = $tEMail;
                            $iu -> sendUserInfo( $tEMail, $tEMail, $conEMail, $conEMail);
                            print_r( json_encode( $return ));    
    break;
    case "getList":
                            require_once( "classes/DataFormNew.php");
                            $df = new \DataFormNew( $db_pdo, $_POST["pageSource"], $_POST["currentRecord"] );
                            $r = $df -> getList( $_POST["sql"], $_POST["widthNull"] );
                            print_r( json_encode( $r ));
    
    break;
    default:
                            print_r( json_encode( $return ));
    break;
}
?>
