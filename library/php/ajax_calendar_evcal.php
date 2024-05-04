<?php
define( "PATH_TO_APPENDIX", "library/cal/" );
// ajax file for calendar.php and calendar_editable.php
session_start();
if( !isset( $_SESSION["user_id"] ) ) $_SESSION["user_id"] = 1;
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
    case "getEventsForView":
                            $return -> pVar = $_POST["pVar"];
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();
                            $return -> data = $ev -> getEventsForView( $db_pdo, $_POST["startDate"], $_POST["endDate"], $_POST["userId"] );
                            $return -> wasFetch = true;
                            $return -> success = true;
                            $return -> message = "Die Termine wurden erfolgreich geladen.";                                
                            print_r( json_encode( $return ));    
    break;
    case "showParticipants":
                            $return -> pVar = $_POST["pVar"];
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> getParticipants( $db_pdo, $_POST["event_id"] );
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            $return -> data = $return -> result -> data;
                            $return -> sum = $return -> result -> sum;
                            $return -> x = $_POST["x"];
                            $return -> y = $_POST["y"];
                            unset( $return -> result );
                            print_r( json_encode( $return ));    
    break;
    case "deleteAppendix":
                            if( $_POST["id"] === "new" ) {
                                $files = glob( "../cal/cal_new*.*");
                            } else {
                                $files = glob( "../cal/cal_" . $_POST["id"] . "*.*");
                            }
                            $l = count( $files );
                            $i = 0;
                            while( $i < $l ) {
                                unlink( "../cal/" . $files[$i] );
                                $i += 1;
                            }
                            $return -> message = "Neue Anhänge wurden erfolgreich gelöscht";
                            print_r( json_encode( $return ));
    break;
    case "saveEvent":
                            require_once( "classes/CalendarEventEvCal.php");
                            require_once( "classes/InformUser.php" );
                            $ev = new \CalendarEvent();
                            // get old data
                            $q = "select * from event where id = " . $_POST["id"];                           
                            $s = $db_pdo -> query( $q );
                            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                            //
                            $result = $ev -> saveEvent( $db_pdo, $_POST["id"], $_POST["group_id"], $_POST["title"], $_POST["fromDate"], $_POST["toDate"], $_POST["fromTime"], $_POST["toTime"], $_POST["url"], $_POST["description"], $_POST["notice"], $_POST["place"], $_POST["format"], $_POST["deadline"], $_POST["innerUrl"], $_POST["innerUrlText"], $_POST["creator"], $_POST["countPart"]  );
                            // if success and count participants greater 0 
                            $parts = $ev -> getParticipants( $db_pdo, $_POST["id"] ) -> Ids;
                            $q = "select name from event_format where id = '" . $_POST["format"] . "'";
                            $s = $db_pdo -> query( $q );
                            $r_cat = $s -> fetchAll( PDO::FETCH_ASSOC );
                            if( $result -> success && count( $parts ) > 0 ) {
                            // build change text if save success, $r is old data
                                $cTxt = "";
                                if( count ( $r ) > 0 ) {                                
                                    if( $r[0]["title"] !== $_POST["title"] ) {
                                        $cTxt .= "Der Titel ist jetzt: “" . $_POST["title"] . "“. ";    
                                    }
                                    if( $r[0]["start_date"] !== $_POST["fromDate"] || substr( $r[0]["start_time"], 0, 5 ) !== $_POST["fromTime"] ) {
                                        $cTxt .= "Das Datum/Zeit wurde auf " . getGermanDateFromMysql( $_POST["fromDate"] ) . " um " . $_POST["fromTime"] . " Uhr gesetzt. ";
                                    }
                                    if( $r[0]["end_date"] !== $_POST["toDate"] || substr( $r[0]["end_time"], 0, 5 ) !== $_POST["toTime"] ) {
                                        $cTxt .= "Der Termin endet jetzt am " . getGermanDateFromMysql( $_POST["toDate"] ) . " " . $_POST["toTime"] . " Uhr. ";
                                    }
                                    if( $r[0]["class"] !== $_POST["format"] ) {
                                        $cTxt .= "Die Terminkategorie ist nun “" . $r_cat[0]["name"] . "“. ";
                                    }
                                    if( $r[0]["place"] != $_POST["place"] ) {
                                        $q = "select place from event_place where id = " . $_POST["place"];
                                        $s = $db_pdo -> query( $q );
                                        $r_place = $s -> fetchAll( PDO::FETCH_ASSOC );
                                        $cTxt .= "Der Ort ist nun “" . $r_place["place"] . "“. ";
                                    }
                                    if( $r[0]["creator"] != $_POST["creator"] ) {
                                        $q = "select concat(salutation.salutation, ' ', firstname, ' ', lastname ) as fullname from salutation, user where user.salutation = salutation.id and user.id = " . $_POST["creator"];
                                        $s = $db_pdo -> query( $q );
                                        $r_creator = $s -> fetchAll( PDO::FETCH_ASSOC );
                                        $cTxt .= "Der/die Terminverantwortliche ist nun " . $r_creator[0]["fullname"] . ". ";
                                    }
                                    if( $r[0]["description"] != $_POST["description"] ) {
                                        $cTxt .= "Die Terminbeschreibung lautet nun “" . $_POST["description"] . "“. ";
                                    }
                                    if( $r[0]["inner_url"] !== $_POST["innerUrl"] ) {
                                        $cTxt .= "Der Anhang wurde geändert. ";                                    
                                    }
                                    if( $r[0]["url"] !== $_POST["url"] ) {
                                        $cTxt .= "Der externe Link wurde geändert. ";                                    
                                    }
                                }
                                $l = count( $parts );
                                $i = 0;
                                // only if participants and not empty change text
                                while( $i < $l && $cTxt != "" ) {
                                    $iu = new \InformUser( $db_pdo, $settings["calendar_editable"]["message_behavior"], 27, 0, 0, $parts[$i], true );
                                    $title = "Der Termin “" . $r[0]["title"] . "” vom " . getGermanDateFromMysql( $r[0]["start_date"] ) . " " . substr( $r[0]["start_time"], 0, 5 ) . " Uhr wurde geändert.";
                                    $res = $iu -> sendUserInfo( $title, $title, $cTxt, $cTxt );
                                    unset( $iu );                        
                                    $i += 1;
                                }
                                
                            //    
                            }
                            // inform participants
                            
                            $iUser = $ev -> buildInformUser( $db_pdo, $_POST["informRole"], $_POST["informUser"], $parts );
                            $l = count( $iUser );
                            $i = 0;
                            if( !isset( $r_cat[0] ) ) {
                                $title = "Neuer Termin - ohne";    
                            } else {
                                $title = "Neuer Termin - " . $r_cat[0]["name"];
                            }
                            $content = "Es wurde für den " . getGermanDateFromMysql( $_POST["fromDate"] ) . " " . $_POST["fromTime"] . " Uhr der Termin “" . $_POST["title"] . "” eingestellt. Bitte prüfe, ob Du teilnehmen kannst und bestätige Deine Teilnahme im Veranstaltungskalender.";
                            while( $i < $l ) {
                                $iu = new \InformUser( $db_pdo, $settings["calendar_editable"]["message_behavior"], 27, 0, 0, $iUser[$i], true );
                                $res = $iu -> sendUserInfo( $title, $title, $content, $content );
                                unset( $iu );                        
                                $i += 1;
                            }
                            
                            
                            
                            // end inform participants
                            $return -> pVar = $_POST["pVar"];                            
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "saveEventByJson":
                            $return -> pVar = $_POST["pVar"];
                            require_once( "classes/CalendarEventEvCal.php" );
                            $ev = new \CalendarEvent();
                            $event = json_decode( $_POST["event"] );
                            if( $event -> extendedProps -> id === "new" ) {
                                $res = $ev -> newEvent( $db_pdo, $event -> extendedProps -> groupId, $event -> title, explode( "T", $event -> start)[0], explode( "T", $event -> end)[0], explode( "T", $event -> start)[1], explode( "T", $event -> end)[0], $event -> extendedProps -> url, $event -> extendedProps -> description, $event -> extendedProps -> notice, $event -> extendedProps -> repeat, $event -> extendedProps -> repeatTo, $event -> extendedProps -> place, str_replace( "fc-", "", $event -> extendedProps -> class ), $event -> extendedProps ->  registration_deadline, $event -> extendedProps -> inner_url, $event -> extendedProps -> inner_url_text, $event -> extendedProps -> creator, $event -> extendedProps -> appendixNames );
                            } else {
                                //$ev ->
                            }
                            print_r( json_encode( $return ));        
    break;                           
    case "showDialogParticipate":
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();
                            $res = $ev -> showDialogParticipate( $db_pdo, $_POST["id"] );
                            $return -> pVar = $_POST["pVar"];              
                            $return -> countPart = $res -> countPart;
                            $return -> participants = $res -> participants;              
                            $return -> title = $res -> title;
                            $return -> success = true;//$result -> success;
                            $return -> message = "Die Teilnehmer wurden erfolgreich geladen.";//$result -> message;
                            print_r( json_encode( $return ));        
    break;
    case "setParticipate":
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();
                            $result = $ev -> setParticipate( $db_pdo, $_POST["id"], $_POST["userId"], $_POST["participate"], $_POST["participateAs"], $_POST["remindMe"], $_POST["countPart"], $_POST["elId"] );
                            $return -> pVar = $_POST["pVar"];
                            $return -> participate = $_POST["participate"];             
                            $return -> remindMe = $_POST["remindMe"];             
                            $return -> elId = $_POST["elId"];             
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));
    break;
    case "sendEvRequest":
                            $return -> success = true;
                            $return -> message = "Der Ansprechpartners wurde über deine Anfrage informiert.";
                            try {
                                $q = "select title, creator, start_date from event where id = " . $_POST["id"];
                                $s = $db_pdo -> query( $q );
                                $r_ev = $s -> fetchAll( PDO::FETCH_ASSOC );
                                $q = "select concat( firstname, ' ', lastname ) as fullname, email from user where id = " . $_SESSION["user_id"];
                                $s = $db_pdo -> query( $q );
                                $r_user = $s -> fetchAll( PDO::FETCH_ASSOC );
                                require_once( "classes/InformUser.php" );
                                $iu = new \InformUser( $db_pdo, "both", 27,0,0,$r_ev[0]["creator"]);
                                $title = "Terminanfrage zu ´" . $r_ev[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_ev[0]["start_date"] );
                                $content_email = "<p>Der Nutzer " . $r_user[0]["fullname"] . " E-Mail: <a href='mailto:" . $r_user[0]["email"] . "'>" . $r_user[0]["email"] . "</a> hat zum Termin ´" . $r_ev[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_ev[0]["start_date"] ) . " folgende Anfrage:<p>";
                                $content_email .= "<p>" . $_POST["request"] . "</p><p>Bitte beantworte die Anfrage.</p>";
                                $content_message = "Der Nutzer " . $r_user[0]["fullname"] . " E-Mail: " . $r_user[0]["email"] . " hat zum Termin ´" . $r_ev[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_ev[0]["start_date"] ) . " folgende Anfrage: " . $_POST["request"] . " Bitte beantworte die Anfrage.";
                                $iu -> sendUserInfo( $title, $title, $content_email, $content_message );
                            } catch ( Exception $e ) {
                                $return -> success = false;    
                                $return -> message = "Beim Informieren des Ansprechpartners ist folgender Fehler aufgetreten:" . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));

                                
    break;
    case "removeEvent":
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();
                            $q = "select title, group_id, start_date, start_time, creator from event where id = " . $_POST["id"];
                            $s = $db_pdo -> query( $q );
                            $r_event = $s -> fetchAll( PDO::FETCH_ASSOC );
                            if( $_POST["deleteSerie"] === "" ) {
                                $res = $ev -> removeSingleEvent( $db_pdo, $_POST["id"], $_POST["informRole"], $_POST["informUser"] );
                            } else {
                                $res = $ev -> removeGroupEvent( $db_pdo, $r_event[0]["group_id"], $_POST["id"], $_POST["informRole"], $_POST["informUser"] );                                
                            }
                            $return -> success = $res -> success;
                            require_once( "classes/InformUser.php" );
                            if( $res -> user == "0,") $res -> user = "";
                            $iu = new InformUser( $db_pdo, "both", 27, 0, 0, $res -> user );
                            $title = "Terminlöschung ´" . $r_event[0]["title"] . "´";
                            $content = "Der Termin ´" . $r_event[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_event[0]["start_date"] ) . " um " . substr( $r_event[0]["start_time"], 0, 5 ) . " Uhr wurde abgesagt.";
                            if( $res -> success && $_POST["deleteSerie"] === "" ) {
                                if( $r_event[0]["group_id"] != 0 ) {
                                    $content .= " Der Termin war ein Serientermin. Die anderen Termine der Serie bleiben bestehen.";
                                }
                                $return -> message = "Der Termin wurde erfolgreich gelöscht.";  
                            } else {
                                if( $res -> success && $_POST["deleteSerie"] === "1" ) {
                                    $content = " Der Termin war ein Serientermin. Alle anderen Termine der Serie sind ebenfalls abgesagt worden. Es finden somit keine Termine dieser Serie statt.";                                    
                                } else {
                                    //$return -> message = "Beim Löschen des Termins sind Fehler entstanden: " .  $e -> getMessage();
                                }
                            }
                            $res = $iu -> sendUserInfo( $title, $title, $content, $content );
                            if( !$res -> mailSuccess ) {
                                sendFailurMessage( $db_pdo, 27, $r_event[0]["creator"], $res -> failurePart, $title );    
                            }
                            $return -> pVar = $_POST["pVar"];              
                            $return -> innerId = $_POST["innerId"];
                            $return -> deleteSerie = $_POST["deleteSerie"];
                            $return -> mailSuccess = $res -> mailSuccess;            
                            print_r( json_encode( $return ));    
    break;
    case "exportEvents":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $dates = new \stdClass();
                            switch( $_POST["zeitraum"] ) {
                                case "all":
                                            $dates -> from_date = date("Y-m-d", time() );     
                                break;
                                case "currWeek":
                                            $dates -> from_date = date("Y-m-d", time()-((date("N")-1)*86400));
                                            $dates -> to_date = date("Y-m-d", time()+((8-date("N"))*86400));    
                                break;
                                case "nextWeek":
                                            $dates -> from_date = date("Y-m-d", time()-((date("N")-1)*86400) );
                                            $dates -> from_date = date("Y-m-d", strtotime($dates -> from_date . '+ 7 days'));

                                            $dates -> to_date = date("Y-m-d", time()+((8-date("N"))*86400));
                                            $dates -> to_date = date("Y-m-d", strtotime($dates -> to_date . '+ 7 days'));    
                                break;
                                case "currMonth":
                                            $dates -> from_date = date("m", time() );
                                            $dates -> from_date = date("Y", time() ) . "-" . $dates -> from_date . "-01";
                                            
                                            $dates -> to_date = date("m", time() );
                                            $tmp = "0" . ( intval( $dates -> to_date ) + 1 );
                                            $tmp = substr( $tmp, strlen( $tmp ) - 2, 2 );
                                            $dates -> to_date = date("Y", time() ) . "-" . $tmp . "-01";
                                            
                                break;
                                case "nextMonth":
                                            $dates -> from_date = date( "m", time() );
                                            $tmp =  "0" . ( intval( $dates -> from_date ) + 1 );
                                            $tmp = substr( $tmp, strlen( $tmp ) - 2, 2 );
                                            $dates -> from_date = date("Y", time() ) . "-" . $tmp . "-01";
                                            
                                            $dates -> to_date = date( "m", time() );
                                            $tmp =  "0" . ( intval( $dates -> to_date ) + 2 );
                                            $tmp = substr( $tmp, strlen( $tmp ) - 2, 2 );
                                            $dates -> to_date = date("Y", time() ) . "-" . $tmp . "-01";
                                break;
                            }
                            $whereStr = "";
                            if( is_string( $_POST["art"] ) ) {
                                $_POST["art"] = explode( ",", $_POST["art"] );    
                            }
                            for( $i = 0; $i < count( $_POST["art"] ); $i++ ) {
                                switch( $_POST["art"][$i] ) {
                                    case "fc-2":
                                            $whereStr .= " OR class = 'fc-2'";
                                    break;
                                    case "fc-3":
                                            $whereStr .= " OR class = 'fc-3'";
                                    break;
                                    case "fc-4":
                                            $whereStr .= " OR class = 'fc-4'";
                                    break;
                                    case "fc-5":
                                            $whereStr .= " OR class = 'fc-5'";
                                    break;
                                    case "fc-6":
                                            $whereStr .= " OR class = 'fc-6'";
                                    break;
                                    case "fc-7":
                                            $whereStr .= " OR class = 'fc-7'";
                                    break;
                                    case "fc-8":
                                            $whereStr .= " OR class = 'fc-8'";
                                    break;
                                }
                            }
                            if( $whereStr != "" ) {
                                $whereStr = substr( $whereStr, 4 );
                                $whereStr = " AND ( " . $whereStr . ")";
                            }
                            if( $_POST["ownEvs"] != "all" ) {
                                $whereStr .= " AND event.id = event_participate.event_id AND user_id = " . $_SESSION["user_id"];
                                if( !isset( $dates  -> to_date ) ) {
                                    $query = "SELECT * FROM event, event_participate WHERE start_date >= '" . $dates -> from_date . "' $whereStr";
                                } else {
                                    $query = "SELECT * FROM event, event_participate WHERE start_date >= '" . $dates -> from_date . "' AND start_date <'" . $dates -> to_date . "' AND end_date <'" . $dates -> to_date . "' $whereStr";
                                }
                            } else {
                                if( !isset( $dates  -> to_date ) ) {
                                    $query = "SELECT * FROM event WHERE start_date >= '" . $dates -> from_date . "' $whereStr";
                                } else {
                                    $query = "SELECT * FROM event WHERE start_date >= '" . $dates -> from_date . "' AND start_date <'" . $dates -> to_date . "' AND end_date <'" . $dates -> to_date . "' $whereStr";
                                }                                
                            }
                            $stm = $db_pdo -> query( $query );
                            $data = $stm -> fetchAll(PDO::FETCH_ASSOC);
                            $result = new \stdClass();
                            $result -> data = $data;
                            $result -> success = true;
                            if( count( $result -> data ) != 0 ) {
                                if( $result -> success ) {
                                    $result = buildExportEventFile( $db_pdo, $result, $_POST["system"], $_POST["type"], $_POST["art"], $_SESSION["user_id"], $_POST["reminder"], $_POST["reminder_intervall"] );
                                } else {
                                    $result -> message = "Beim Lesen der Termine ist ein Fehler aufgetreten.";
                                }
                                $return -> success = $result -> success;
                                $return -> fileName = $result -> fileName;
                                $return -> message = $result -> message;
                            } else {
                                $return -> success = false;
                                $return -> message = "Für die gewählten Kriterien sind keine Termine vorhanden.";                                
                            }
                            print_r( json_encode( $return ));                                   
    break;
    case "sendEventsEmail":
                            require_once( "classes/CalendarEventEvCal.php");
                            $ev = new \CalendarEvent();                            
                            $res = $ev -> exportEvEMail( $db_pdo );
                            $return -> success = $res -> success;
                            $return -> message = $res -> message;
                            //$return -> data = $return -> data;
                            print_r( json_encode( $return ));    
                            
    break;
    case "changeDateTime":
                            require_once( "classes/CalendarEventEvCal.php");
                            $return -> pVar = $_POST["pVar"];
                            $ev = new \CalendarEvent();
                            $res = $ev -> changeDateTime( $db_pdo, $_POST["eventId"], $_POST["startDate"], $_POST["startTime"], $_POST["endDate"], $_POST["endTime"] );               
                            $return -> success = $res -> success;
                            $return -> message = $res -> message;
                            print_r( json_encode( $return ));  
    break;
    case "usePattern":
                            $query = "select * from event_pattern where id = " . $_POST["id"];
                            try {
                                $stm = $db_pdo -> query( $query );            
                                $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
                                $return -> success = true;
                                $return -> message = "Die Vorlage wurde erfolgreich gelesen.";                                
                            } catch ( Exception $e ) {
                                $return -> success = false;
                                $return -> message = "Beim Lesen der Vorlage ist folgender Fehler aufgetreten: " . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));                                                        
    break;
    case "removeUserFromEvent":
                            require_once( "classes/CalendarEventEvCal.php");
                            $return -> pVar = $_POST["pVar"];
                            $ev = new \CalendarEvent();
                            try {
                                $res = $ev -> removeUserFromEvent( $db_pdo, $_POST["eventId"], $_POST["userId"] );           
                                $return -> success = $res -> success;
                                $return -> message = $res -> message;                               
                            } catch ( Exception $e ) {
                                $return -> success = false;
                                $return -> message = "Beim Löschen des Nutzers ist folgender Fehler aufgetreten:" . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));                                                        
    break;
    case "addUserToEvent":
                            require_once( "classes/CalendarEventEvCal.php");
                            $return -> pVar = $_POST["pVar"];
                            $ev = new \CalendarEvent();
                            try {
                                $res = $ev -> addUserToEvent( $db_pdo, $_POST["partId"] );           
                                $return -> success = $res -> success;
                                $return -> message = $res -> message;                               
                            } catch ( Exception $e ) {
                                $return -> success = false;
                                $return -> message = "Beim Löschen des Nutzers ist folgender Fehler aufgetreten:" . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));                                                        
    break;
    /* end events evcal */
/*
    case "updateEventEvCal":
                                require_once( "classes/CalendarEvent.php");
                                $ev = new \CalendarEvent();
                                $event = json_decode( $_POST["event"] );
                                $return -> success = true;
                                $return -> message = "Der Termin wurden erfolgreich aktualisiert.";                                
                                print_r( json_encode( $return ));    
    break;
     case "getPlaces":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> getPlaces( $db_pdo);
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            $return -> data = $return -> result -> data;
                            print_r( json_encode( $return ));    
    break;
    case "requestEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> requestEvent( $db_pdo, $_POST["evId"], $_POST["content"]);
                            print_r( json_encode( $return ));    
    break;
    case "deleteEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $result = $ev -> deleteEvent( $db_pdo, $_POST["id"], $settings["calendar"]["message_behavior"] );
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "deleteSerieEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $result = $ev -> deleteSerieEvent( $db_pdo, $_POST["id"], $_POST["groupId"], $settings["calendar"]["message_behavior"] );
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "saveEvent":
                            require_once( "classes/CalendarEvent.php");
                            require_once( "classes/InformUser.php" );
                            $ev = new \CalendarEvent();
                            // get old data
                            $q = "select * from event where id = " . $_POST["id"];                           
                            $s = $db_pdo -> query( $q );
                            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                            //
                            $result = $ev -> saveEvent( $db_pdo, $_POST["id"], $_POST["group_id"], $_POST["title"], $_POST["fromDate"], $_POST["toDate"], $_POST["fromTime"], $_POST["toTime"], $_POST["url"], $_POST["description"], $_POST["notice"], $_POST["place"], $_POST["format"], $_POST["deadline"], $_POST["innerUrl"], $_POST["innerUrlText"], $_POST["creator"], $_POST["countPart"]  );
                            // if success and count participants greater 0 
                            $parts = $ev -> getParticipants( $db_pdo, $_POST["id"] ) -> Ids;
                            $q = "select name from event_format where id = '" . $_POST["format"] . "'";
                            $s = $db_pdo -> query( $q );
                            $r_cat = $s -> fetchAll( PDO::FETCH_ASSOC );
                            if( $result -> success && count( $parts ) > 0 ) {
                            // build change text if save success, $r is old data
                                $cTxt = "";
                                if( count ( $r ) > 0 ) {                                
                                    if( $r[0]["title"] !== $_POST["title"] ) {
                                        $cTxt .= "Der Titel ist jetzt: “" . $_POST["title"] . "“. ";    
                                    }
                                    if( $r[0]["start_date"] !== $_POST["fromDate"] || substr( $r[0]["start_time"], 0, 5 ) !== $_POST["fromTime"] ) {
                                        $cTxt .= "Das Datum/Zeit wurde auf " . getGermanDateFromMysql( $_POST["fromDate"] ) . " um " . $_POST["fromTime"] . " Uhr gesetzt. ";
                                    }
                                    if( $r[0]["end_date"] !== $_POST["toDate"] || substr( $r[0]["end_time"], 0, 5 ) !== $_POST["toTime"] ) {
                                        $cTxt .= "Der Termin endet jetzt am " . getGermanDateFromMysql( $_POST["toDate"] ) . " " . $_POST["toTime"] . " Uhr. ";
                                    }
                                    if( $r[0]["class"] !== $_POST["format"] ) {
                                        $cTxt .= "Die Terminkategorie ist nun “" . $r_cat[0]["name"] . "“. ";
                                    }
                                    if( $r[0]["place"] != $_POST["place"] ) {
                                        $q = "select place from event_place where id = " . $_POST["place"];
                                        $s = $db_pdo -> query( $q );
                                        $r_place = $s -> fetchAll( PDO::FETCH_ASSOC );
                                        $cTxt .= "Der Ort ist nun “" . $r_place["place"] . "“. ";
                                    }
                                    if( $r[0]["creator"] != $_POST["creator"] ) {
                                        $q = "select concat(salutation.salutation, ' ', firstname, ' ', lastname ) as fullname from salutation, user where user.salutation = salutation.id and user.id = " . $_POST["creator"];
                                        $s = $db_pdo -> query( $q );
                                        $r_creator = $s -> fetchAll( PDO::FETCH_ASSOC );
                                        $cTxt .= "Der/die Terminverantwortliche ist nun " . $r_creator[0]["fullname"] . ". ";
                                    }
                                    if( $r[0]["description"] != $_POST["description"] ) {
                                        $cTxt .= "Die Terminbeschreibung lautet nun “" . $_POST["description"] . "“. ";
                                    }
                                    if( $r[0]["inner_url"] !== $_POST["innerUrl"] ) {
                                        $cTxt .= "Der Anhang wurde geändert. ";                                    
                                    }
                                    if( $r[0]["url"] !== $_POST["url"] ) {
                                        $cTxt .= "Der externe Link wurde geändert. ";                                    
                                    }
                                }
                                $l = count( $parts );
                                $i = 0;
                                // only if participants and not empty change text
                                while( $i < $l && $cTxt != "" ) {
                                    $iu = new \InformUser( $db_pdo, $settings["calendar_editable"]["message_behavior"], 27, 0, 0, $parts[$i], true );
                                    $title = "Der Termin “" . $r[0]["title"] . "” vom " . getGermanDateFromMysql( $r[0]["start_date"] ) . " " . substr( $r[0]["start_time"], 0, 5 ) . " Uhr wurde geändert.";
                                    $res = $iu -> sendUserInfo( $title, $title, $cTxt, $cTxt );
                                    unset( $iu );                        
                                    $i += 1;
                                }
                                
                            //    
                            }
                            // inform participants
                            
                            $iUser = $ev -> buildInformUser( $db_pdo, $_POST["informRole"], $_POST["informUser"], $parts );
                            $l = count( $iUser );
                            $i = 0;
                            if( !isset( $r_cat[0] ) ) {
                                $title = "Neuer Termin - ohne";    
                            } else {
                                $title = "Neuer Termin - " . $r_cat[0]["name"];
                            }
                            $content = "Es wurde für den " . getGermanDateFromMysql( $_POST["fromDate"] ) . " " . $_POST["fromTime"] . " Uhr der Termin “" . $_POST["title"] . "” eingestellt. Bitte prüfe, ob Du teilnehmen kannst und bestätige Deine Teilnahme im Veranstaltungskalender.";
                            while( $i < $l ) {
                                $iu = new \InformUser( $db_pdo, $settings["calendar_editable"]["message_behavior"], 27, 0, 0, $iUser[$i], true );
                                $res = $iu -> sendUserInfo( $title, $title, $content, $content );
                                unset( $iu );                        
                                $i += 1;
                            }
                            
                            
                            
                            // end inform participants
                            $return -> dVar = $_POST["dVar"];                            
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "saveSerieEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $result = $ev -> saveSerieEvent( $db_pdo, $_POST["id"], $_POST["group_id"], $_POST["title"], $_POST["fromDate"], $_POST["toDate"], $_POST["fromTime"], $_POST["toTime"], $_POST["url"], $_POST["description"], $_POST["place"], $_POST["format"], $_POST["deadline"], $_POST["innerUrl"], $_POST["innerUrlText"]  );
                            $return -> success = $result -> success;
                            $return -> message = $result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "newEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> newEvent( $db_pdo, $_POST["group_id"], $_POST["title"], $_POST["fromDate"], $_POST["toDate"], $_POST["fromTime"], $_POST["toTime"], $_POST["url"], $_POST["description"], $_POST["notice"], $_POST["repeat"], $_POST["repeat_to"], $_POST["place"], $_POST["format"], $_POST["deadline"], $_POST["innerUrl"], $_POST["innerUrlText"], $_POST["creator"]  );
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            require_once( "classes/InformUser.php" );
                            $ui = new \InformUser( $db_pdo, $settings["calendar_editable"]["message_behavior"], 27, 0, $_POST["informRole"],$_POST["informUser"], true );
                            $content = "Es wurde für den " . getGermanDateFromMysql( $_POST["fromDate"] ) . " der Termin „" . $_POST["title"] ."” eingestellt. Bitte prüfe, ob Du teilnehmen kannst und bestätige dann deine Teilnahme im Veranstaltungskalender über die „Teilnehmen”-Funktion des Termins.";
                            $q_cat = "select name from event_format where format = '" . $_POST["format"] . "'";
                            $s = $db_pdo -> query( $q_cat );
                            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                            if( count( $r ) > 0 ) {
                                $titleEmail = "Neuer Termin - " . $r[0]["name"];    
                            } else {
                                $titleEmail = "Neuer Termin - ohne Kategorie";
                            }
                            $ui ->sendUserInfo( $titleEmail, $titleEmail, $content, $content );
                            // participate self is clicked
                            if( $_POST["participate"] == "true" ) {
                                $ev -> participate( $db_pdo, $_SESSION["user_id"], $return -> result -> lastEventId, $settings["calendar_editable"]["message_behavior"], $settings["calendar_editable"]["inform_myself"], $_POST["participate"], $_POST["participateAs"], $_POST["countPart"] );
                            }
                            print_r( json_encode( $return ));    
    break;
    case "participateEvent":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> participate( $db_pdo, $_POST["user_id"], $_POST["event_id"], $settings["calendar_editable"]["message_behavior"], $_POST["remindMe"], true, $_POST["participateAs"], $_POST["countPart"] );
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            print_r( json_encode( $return ));    
    break;
    case "setCountParticipants":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> setCountParticipants( $db_pdo, $_POST["userId"], $_POST["eventId"], $_POST["countPart"] );
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            print_r( json_encode( $return ));    
    
    break;
    case "deleteParticipation":
                            require_once( "classes/CalendarEvent.php");
                            $ev = new \CalendarEvent();
                            $return -> result = $ev -> deleteParticipation( $db_pdo, $_POST["user_id"], $_POST["event_id"], $settings["calendar_editable"]["message_behavior"]  );
                            $return -> success = $return -> result -> success;
                            $return -> message = $return -> result -> message;
                            print_r( json_encode( $return ));    
    break; 
    case "checkForFile":
                            if( file_exists( "../../" . $_POST["fileName"] ) ) {
                                $return -> success = true;
                                $return -> message = 'Die Datei "' . $_POST["fileName"] . '" existiert.';
                            } else {
                                $return -> success = false;
                                $return -> message = 'Die Datei "' . $_POST["fileName"] . '" existiert nicht.';                                
                            }
                            $return -> param = $_POST["param"];
                            $return -> filename = $_POST["fileName"];
                            print_r( json_encode( $return ));                               
    break;
    case "deleteEventAppendix":
                            require_once( "functions.php" );
                            $return -> eventType = $_POST["eventType"];
                            $tmpFileName = explode( "/", $_POST["appendix"] );
                            if( $tmpFileName[0] == "http:" || $tmpFileName[0] == "https:" ) {
                                $return -> success = true;
                                $return -> message = "Der Anhang wurde erfolgreich gelöscht.";
                            } else {
                                $l = count( $tmpFileName ) - 1;
                                $fileName = $tmpFileName[ $l ];
                                $tmpExt = explode( ".", $fileName );
                                $ext = $tmpExt[ count( $tmpExt ) - 1 ];
                                $i = 0;
                                $tmpPath = "";
                                while( $i < $l ) {
                                    $tmpPath .= "/" . $tmpFileName[ $i ];
                                    $i += 1;
                                }
                                if( $ext != "php" && $ext != "html" ) {
                                    $tmpPath = "../.." . $tmpPath . "/" . $fileName;
                                    $glob = glob( $tmpPath );
                                    if( count( $glob ) > 0 ) {
                                        unlink( $glob[0] );
                                    }
                                }
                                $return -> success = true;
                                $return -> message = "Der Anhang wurde erfolgreich gelöscht.";
                            }
                            print_r( json_encode( $return ));
    break;
    case "checkLink":
                            require_once( "functions.php" );
                            $return -> param = $_POST["param"];
                            $return -> success = chkLinkExists( $_POST["link"] );
                            print_r( json_encode( $return ));                               
                            
    break;
    case "usePattern":
                            $query = "select * from event_pattern where id = " . $_POST["id"];
                            try {
                                $stm = $db_pdo -> query( $query );            
                                $return -> data = $stm -> fetchAll(PDO::FETCH_ASSOC);
                                $return -> success = true;
                                $return -> message = "Die Vorlage wurde erfolgreich gelesen.";                                
                            } catch ( Exception $e ) {
                                $return -> success = false;
                                $return -> message = "Beim Lesen der Vorlage ist folgender Fehler aufgetreten: " . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));                                                        
    break;
    case "saveAdminEvent":
                            if( $_POST["id"] == "new" ) {
                                $query = "INSERT INTO event (class, title, description, start_date, start_time, end_date, end_time, notice ) VALUES ('" .  $_POST["class"] . "', '" . $_POST["title"] . "', '" . $_POST["description"] . "', '" . $_POST["start_date"] . "', '" . $_POST["start_time"] . "', '" . $_POST["end_date"] . "', '" . $_POST["end_time"] . "', '" . $_POST["notice"] . "')";                                    
                            } else {
                                $query = "UPDATE event SET class = '" . $_POST["class"] . "', title = '" . $_POST["title"] . "', description = '" . $_POST["description"] . "', start_date = '" . $_POST["start_date"] . "', start_time = '" . $_POST["start_time"] . "', end_date = '" . $_POST["end_date"] . "', end_time = '" . $_POST["end_time"] . "', notice = '" . $_POST["notice"] . "' WHERE id = " . $_POST["id"];
                            }                            
                            try {
                                $db_pdo -> query( $query );
                                if( $_POST["id"] == "new" ) {
                                    $return -> Id = $db_pdo -> lastInsertId();
                                } else {
                                    $return -> Id = $_POST["id"];
                                }
                                $return -> success = true;
                                $return -> message = "Der Termin wurde erfolgreich gespeichert.";                                
                            } catch ( Exception $e ) {
                                $return -> success = false;
                                $return -> message = "Beim Speichern des Termins ist folgender Fehler aufgetreten: " . $e -> getMessage();
                            }
                            print_r( json_encode( $return ));                                                        
    break;
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
    case "sendDelUserToEvent":
                            $i = $_POST;
                            print_r( json_encode( $return ));                                                        
    break;
    case "informUserAboutDeletion":
                            $return = informUserAboutDeletion( $db_pdo, $_POST["Id"] );                          
                            print_r( json_encode( $return ));                                                        
    break;
    */
}  
?>
