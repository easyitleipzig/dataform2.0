<?php
class CalendarEvent {
    private function getAppendixForEvent( $id ) {
        $fText = "";
        $files = glob( "../cal/cal_ev_$id*.*" );
        $fText = implode( "|", $files );
        $fText = str_replace( "..", "library", $fText);
        return $fText;
    }    
    private function getInformUser( $pdo, $id, $informRole, $informUser, $groupId ) {
        $return = new \stdClass();
        $q = "select concat( '', user_id) as user_id from account where role_id = $informRole";
        $s = $pdo -> query( $q );
        $r_role = $s -> fetchAll( PDO::FETCH_ASSOC );
        $userForRole = assocArrToFlat( $r_role, "user_id", ",", false );
        if( $userForRole = ["0"]) $userForRole = [];
        $userForRole = array_merge( $userForRole, $informUser );
        $userForRole = array_unique( $userForRole );
        if( $groupId == "0" ) {
            $q = "select user_id from event_participate where event_id = $id";
        } else {
            $q = "select DISTINCT(user_id) from event_participate, event where event.id = event_participate.event_id and group_id = $groupId";            
        }
        $s = $pdo -> query( $q );
        $r_partUser = $s -> fetchAll( PDO::FETCH_ASSOC );
        $r_partUser = assocArrToFlat( $r_partUser, "user_id", ",", false );
        $userForRole = array_diff( $userForRole, $r_partUser );
        $return -> userForRole = implode( ",", $userForRole );
        $return -> userForPart = implode( ",", $r_partUser );
        $return -> userAll = implode( ",", $userForRole ) . "," . $return -> userForPart;
        if( $return -> userAll = "," ) $return -> userAll = "";       
        return $return;
    }    
    public function getEventForId( $pdo, $id ) {
        $query = "SELECT * FROM event where id = $id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $i = 0;
        $ev = new \stdClass();
        $ev -> title = $result[$i]["title"];
        $ev -> start = $result[$i]["start_date"] . "T" . $result[$i]["start_time"];
        $ev -> end = $result[$i]["end_date"] . "T" . $result[$i]["end_time"];
        $ev -> display = "auto";
        $exPro = new \stdClass();
        $exPro -> id = $result[$i]["id"];
        $exPro -> groupId = $result[$i]["group_id"];
        $exPro -> place = $result[$i]["place"];
        $exPro -> registration_deadline = $result[$i]["registration_deadline"];
        $exPro -> url = $result[$i]["url"];
        $exPro -> inner_url = $result[$i]["inner_url"];
        $exPro -> inner_url_text = $result[$i]["inner_url_text"];
        $exPro -> description = $result[$i]["description"];
        $exPro -> notice = $result[$i]["notice"];
        $exPro -> class = $result[$i]["class"];
        $exPro -> creator = $result[$i]["creator"];
        $q = "select * from event_participate where event_id = " . $result[$i]["id"] . " and user_id = $userId";
        $s = $pdo -> query( $q );
        $result_part = $s -> fetchAll(PDO::FETCH_ASSOC);
        if( count( $result_part ) > 0 ) {
            if( $result_part[0]["user_id"] > 0 ) $exPro -> participate = true;
            $exPro -> remindMe = $result_part[0]["remind_me"];
            $exPro -> countPart = $result_part[0]["count_part"];
            $exPro -> participateAs = $result_part[0]["count_part"];
        } else {
            $exPro -> participate = null;
            $exPro -> remindMe = null;
            $exPro -> countPart = null;
            $exPro -> participateAs = null;            
        }
        $exPro -> appendix = $this -> getAppendixForEvent( $id );
        $ev -> extendedProps = $exPro;
        return $ev;        

    }
    public function getEventsForView( $pdo, $startDate, $endDate, $userId ) {
        $query = "SELECT * FROM event where start_date >= '$startDate' and end_date < '$endDate'";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $events = [];
        $l = count( $result );
        $i = 0;
        while( $i < $l ) {
            $ev = new \stdClass();
            $ev -> title = $result[$i]["title"];
            $ev -> start = $result[$i]["start_date"] . "T" . $result[$i]["start_time"];
            $ev -> end = $result[$i]["end_date"] . "T" . $result[$i]["end_time"];
            if( $result[$i]["start_time"] === "00:00:00" ) {
                $ev -> allDay = true;
            } else {
                $ev -> allDay = false;
            }
            $ev -> display = "auto";
            $exPro = new \stdClass();
            $exPro -> id = $result[$i]["id"];
            $exPro -> groupId = $result[$i]["group_id"];
            $exPro -> place = $result[$i]["place"];
            $exPro -> registration_deadline = $result[$i]["registration_deadline"];
            $exPro -> url = $result[$i]["url"];
            $exPro -> inner_url = $result[$i]["inner_url"];
            $exPro -> inner_url_text = $result[$i]["inner_url_text"];
            $exPro -> description = $result[$i]["description"];
            $exPro -> notice = $result[$i]["notice"];
            $exPro -> class = "fc-" . $result[$i]["category"];
            $exPro -> creator = $result[$i]["creator"];
            $q = "select * from event_participate where event_id = " . $result[$i]["id"] . " and user_id = $userId";
            $s = $pdo -> query( $q );
            $result_part = $s -> fetchAll(PDO::FETCH_ASSOC);
            if( count( $result_part ) > 0 ) {
                if( $result_part[0]["user_id"] > 0 ) $exPro -> participate = true;
                if( $result_part[0]["remind_me"] == 1 ) {
                    $exPro -> remindMe = true;
                } else {
                    $exPro -> remindMe = false;    
                }
                
                $exPro -> countPart = $result_part[0]["count_part"];
                $exPro -> participateAs = $result_part[0]["role_id"];
            } else {
                $exPro -> participate = false;
                $exPro -> remindMe = false;
                $exPro -> countPart = 1;
                $exPro -> participateAs = 0;
                
            }
            $exPro -> appendix = $this -> getAppendixForEvent( $exPro -> id );
            $ev -> extendedProps = $exPro;
            $events[] = $ev;
            $i += 1;
        }
        
        return $events;        
    }
    public function saveEvent( $pdo, $id, $group_id, $title, $start_date, $end_date, $start_time, 
                    $end_time, $url, $description, $notice, $place, $format, $deadline, $inner_url = "", $inner_url_text = "", $creator = 0, $count_part = 1 ){
        $return = new \stdClass();
        if( $group_id == "") {
            $group_id = 0;
        }
        $query = "UPDATE event SET group_id = $group_id, title = '$title', start_date = '$start_date', end_date = '$end_date', 
                    start_time = '$start_time', end_time = '$end_time', url = '$url', description = '$description', notice = '$notice', 
                    place = '$place', class = '$format', registration_deadline = '$deadline', inner_url = '$inner_url', 
                    inner_url_text = '$inner_url_text', creator = $creator  WHERE id = $id ";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            if( $inner_url != "" ) {
                $tmp = explode( "/", $inner_url );
                $fname = $tmp[ count( $tmp ) - 1 ];
                if( file_exists( "../documents/$fname") ) {
                    $tmpExt = explode( ".", $fname );
                    $ext = $tmpExt[ count( $tmpExt) - 1 ];
                    $newFileName = "cal_ev_appendix_edit_" . $id . "_" . time() . "." . $ext;
                    rename( "../documents/$fname", "../documents/$newFileName" );
                    $query = "UPDATE event set inner_url = 'library/documents/$newFileName' WHERE id = " . $id;
                    $pdo->query( $query );
                }                
            } else {
                $query = "UPDATE event set inner_url = '', inner_url_text = '' WHERE id = " . $id;
                $pdo->query( $query );                
            }
            $return -> message = "Der Termin wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    
    
    }
    public function saveEventByJson( $pdo, $ev ) {
        
    }
    
    
    public function showDialogParticipate( $pdo, $id ) {
        $result = new \stdClass();
        $q = "select sum(count_part) as count_part from event_participate where event_id = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        if( count( $r ) > 0 ) {
            $result -> countPart = $r[0]["count_part"];
        } else {
            $result -> countPart = "";
        }
        $q = "select concat( lastname, ', ', firstname) as fullname, count_part from user, event_participate where user.id = event_participate.user_id and event_id = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $result -> participants = $r;
        $q = "select title from event where id = $id";
        $s = $pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_ASSOC );
        $result -> title = $r[0]["title"];
        return $result;
    }  
    public function setParticipate( $pdo, $id, $userId, $participate, $participateAs, $remindMe, $countPart ) {
        $return = new \stdClass();
        $return -> success = true;
        try {
            $q = "select title, creator, start_date, start_time from event where id = $id";
            $s = $pdo -> query( $q );
            $r_event = $s -> fetchAll( PDO::FETCH_ASSOC );
            $q = "select concat( firstname, ' ', lastname ) as fullname from user where id = $userId";
            $s = $pdo -> query( $q );
            $r_user = $s -> fetchAll( PDO::FETCH_ASSOC );
            require_once( "InformUser.php" );
            $iu = new \InformUser( $pdo, "both", 27, 0, 0, $r_event[0]["creator"] );
            if( $participate === "1" ) {
            // participate
            // check for existing record
                $q = "select id from event_participate where event_id = $id and user_id = $userId";
                $s = $pdo -> query( $q );
                $r = $s -> fetchAll( PDO::FETCH_ASSOC );
                if( count( $r ) > 0 ) {
                    // update record
                    $q = "UPDATE `event_participate` SET `remind_me` = '$remindMe', `role_id` = '$participateAs', `count_part` = '$countPart', current_datetime=Now() WHERE `event_participate`.`event_id` = $id and `event_participate`.`user_id` = $userId";
                    $return -> message = "Die Teilnahme wurde erfolgreich gespeichert.";
                } else {
                    // create new record
                    $q ="INSERT INTO `event_participate` (`event_id`, `user_id`, `remind_me`, `role_id`, `current_datetime`, `count_part`) VALUES ('$id', '$userId', '$remindMe', '$participateAs', current_timestamp(), '$countPart')";
                    // prepare message about participation
                    $title = "Teilnahmeinformation ´" . $r_event[0]["title"] . "´";
                    $content = "Der Nutzer " . $r_user[0]["fullname"] . " hat dem Termin ´" . $r_event[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_event[0]["start_date"], false ) . " um " . $r_event[0]["start_time"] . " Uhr zugesagt.";
                    $return -> message = "Die Teilnahme wurde erfolgreich angelegt.";
                }
            } else {
                // delete part record
                $q = "delete from event_participate  WHERE `event_participate`.`event_id` = $id and `event_participate`.`user_id` = $userId";
                $return -> message = "Die Teilnahme wurde erfolgreich gelöscht.";
                // send message about participation delete
                $title = "Teilnahmelöschung ´" . $r_event[0]["title"] . "´";
                $content = "Der Nutzer " . $r_user[0]["fullname"] . " hat für Termin ´" . $r_event[0]["title"] . "´ vom " . getGermanDateFromMysql( $r_event[0]["start_date"], false ) . " um " . $r_event[0]["start_time"] . " Uhr abgesagt.";
            }
            $pdo -> query( $q );
            $iu -> sendUserInfo( $title, $title, $content, $content );
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen der Teilnahme ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }   
    public function removeSingleEvent( $pdo, $id, $informRole, $informUser ) {
        $return = new \stdClass();
        $return -> success = true;
        try {
            $q = "select title, group_id from event where id = $id";
            $s = $pdo -> query( $q );
            $r_event = $s -> fetchAll( PDO::FETCH_ASSOC );
            $return -> user = $this -> getInformUser( $pdo, $id, $informRole, $informUser, "0" ) -> userAll;
            // 1. delete appendix
            $files = glob( "../cal/cal_ev_$id*.*");
            $l = count( $files );
            $i = 0;
            while( $i < $l ) {
                unlink( $files[$i] );
                $i += 1;
            }
            // 2. delete participants
            $q = "delete from event_participate where event_id = $id";
            $pdo -> query( $q );
            // 3. delete event
            $q = "delete from event where id = $id";
            $pdo -> query( $q );
        } catch ( Exception $e ) {
                $return -> success = false;    
        }
        return $return;    
    }
    public function removeGroupEvent( $pdo, $group_id, $eventId, $informRole, $informUser ) {
        $return = new \stdClass();
        $return -> success = true;
        try {
            
            // 1. delete appendix
            $q = "select id from event where group_id = $group_id and id >= $eventId";
            $s = $pdo -> query( $q );
            $r_events = $s -> fetchAll( PDO::FETCH_ASSOC );
            $l = count( $r_events );
            $i = 0;
            while( $i < $l ) {
                $files = glob( "../cal/cal_ev_" . $r_events[$i]["id"] . "*.*");
                $m = count( $files );
                $j = 0;
                while( $j < $m ) {
                    unlink( $files[$j] );
                    $j += 1;
                }
                $i += 1;
            }
            // 2. delete participants
            $return -> user = $this -> getInformUser( $pdo, "", $informRole, $informUser, $group_id ) -> userAll;
            $ids = assocArrToFlat( $r_events, "id" );
            $q = "delete from event_participate where event_id in($ids)";
            $pdo -> query( $q );
            // 3. delete events
            $q = "delete from event where id in ($ids)";
            $pdo -> query( $q );            
         } catch ( Exception $e ) {
                $return -> success = false;    
        }
        return $return;    
    }
    public function exportEvEMail( $pdo ) {
        $return = new \stdClass();
        try{
            require_once( "classes/InformUser.php" );
            $iu = new \InformUser( $pdo, "email", 27, 0, 0, $_SESSION["user_id"], true, [ "tmp/export_events_" . $_SESSION["user_id"] . ".ics, DeineTerminDatei.ics" ] );
            $content ="Als Anhang zu dieser E-Mail erhälst die die von dir exportierten Termine. Öffne deine Termin-App und lade diese Datei, damit du diese Termine übernehmen kannst.";
            $title = "Deine Termine im Anhang";
            $iu -> sendUserInfo( $title, $title, $content, $content );
            $return -> success = true;    
            $return -> message = "Die E-Mail wurde erfolgreich versand.";
            
        } catch (Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Versenden der E-Mail ist folgender Fehler aufgetreten: " . $e -> getMessage();            
        }
        return $return;
    }
    /* end CalEv */
    public function getMaxGroupId( $pdo ) {
        $query = "SELECT MAX(group_id) AS max_group_id FROM event";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        return intval( $result[0]["max_group_id"] );        
    }
    public function getCountEvents( $pdo, $start, $end ) {
    
    }
    public function requestEvent( $pdo, $evId, $content ) {
        $return = new \stdClass();
        $return -> success = true;
        try {
            $q = "select title, start_date, creator from event where id = $evId";
            $s = $pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $title = $_SESSION["firstname"] . " " . $_SESSION["lastname"] . " hat eine Anfrage zum Termin „" . $r[0]["title"] . "” am " . getGermanDateFromMysql( $r[0]["start_date"] );
            require_once( "classes/InformUser.php" );
            $iu = new \InformUser( $pdo, "email", 27, 0, 0, $r[0]["creator"]);
            $message = $_SESSION["firstname"] . " " . $_SESSION["lastname"] . " <a href='mailto:" . $_SESSION["email"] . "'>" . $_SESSION["email"] . "</a> hat eine Anfrage zum Termin „" . $r[0]["title"] . "” " . getGermanDateFromMysql( $r[0]["start_date"] ) . " <a href='" . $_SESSION["email"] . "'>" . $_SESSION["email"] . "</a><br>";
            $content = $message . $content;
            $iu -> sendUserInfo( $title, $title, $content, $content );
            $return -> success = true;  
            $return -> message = "Die Teminanfrage wurde erfolglreich übemittelt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    
    }
    public function deleteEvent( $pdo, $event_id, $message_behavior ) {
        require_once( "functions.php" );
        $return = new \stdClass();
        $return -> success = true;
        try {
            $query = "SELECT * FROM event WHERE id = " . $event_id;
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $evTitle = "„" . $result[0]["title"] . "”";
            $dateTime = $result[0]["start_date"] . " " . $result[0]["start_time"];
            $innerUrl = $result[0]["inner_url"];
            if( $result[0]["inner_url"] != "" && file_exists( "../../" . $innerUrl ) ) {
                unlink( "../../" . $innerUrl );
            }
            $query = "SELECT * FROM event_participate WHERE event_id = " . $event_id;
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result ); $i++ ) {
                $query_user = "SELECT firstname, lastname, email, opt_in FROM user WHERE id = " . $result[$i]["user_id"];
                $stm = $pdo -> query( $query_user );
                $result_user = $stm -> fetchAll(PDO::FETCH_ASSOC);
                informUserDeleteEvent( $pdo, $evTitle,  $dateTime, $result[0]["user_id"], $result_user[0]["firstname"], $result_user[0]["lastname"], $result_user[0]["email"], $result_user[0]["opt_in"], $message_behavior );
            }
            $query = "DELETE FROM event WHERE id = $event_id";
            $pdo -> query( $query );
            $return -> message = "Der Termin wurde erfolgreich gelöscht. ";
            $query = "DELETE FROM event_participate WHERE event_id = $event_id";
            $pdo -> query( $query );
            $return -> message .= "Die Teilnehmer des Termins wurden erfolgreich benachrichtigt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function deleteSerieEvent( $pdo, $event_id, $group_id, $message_behavior ) {
        $return = new \stdClass();
        $return -> success = true;
        try {
            $query_event = "SELECT * FROM event WHERE group_id = $group_id and id >=$event_id";
            $stm = $pdo -> query( $query_event );
            $result_event = $stm -> fetchAll(PDO::FETCH_ASSOC);
            for( $i = 0; $i < count( $result_event ) ; $i++ ) {
                $evTitle = "„" . $result_event[$i]["title"] . "”";
                $dateTime = $result_event[$i]["start_date"] . " " . $result_event[$i]["start_time"]; 
                $query_user = "SELECT user.id, firstname, lastname, email, opt_in FROM user, event_participate WHERE event_participate.user_id = user.id AND  event_participate.event_id = " . $result_event[$i]["id"];
                $stm = $pdo -> query( $query_user );
                $result_user = $stm -> fetchAll(PDO::FETCH_ASSOC);
                for( $j = 0; $j < count( $result_user ); $j++ ) {
                    require_once( "functions.php" );
                    informUserDeleteEvent( $pdo, $evTitle,  $dateTime, $result_user[$j]["id"], $result_user[$j]["firstname"], $result_user[$j]["lastname"], $result_user[$j]["email"], $result_user[$j]["opt_in"], $message_behavior );                    
                }
            }
            $query = "DELETE FROM event WHERE group_id = $group_id";
            $pdo -> query( $query );
            $return -> message = "Der Termins wurde erfolgreich gelöscht. ";
            $query = "DELETE FROM event_participate WHERE event_id = $event_id";
            $pdo -> query( $query );
            $return -> message .= "Die Teilnehmer des Termins wurden erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    
    public function getStartEnd( $pdo, $date, $initialView = "" ) {
        $return = new \stdClass();
        $tmpDate = explode( "-", $date );
        switch( $initialView ) {
            case "timeGridWeek":
                $query_from = "SELECT DATE_ADD('" . $date . "', INTERVAL - 7 DAY) as from_date";
                $query_to = "SELECT DATE_ADD('" . $date . "', INTERVAL + 7 DAY) as to_date";
            break;
            case "timeGridDay":
                $query_from = "SELECT DATE_ADD('" . $date . "', INTERVAL - 1 DAY) as from_date";
                $query_to = "SELECT DATE_ADD('" . $date . "', INTERVAL + 1 DAY) as to_date";
            break;
            default:
                $query_from = "SELECT DATE_ADD('" . $date . "', INTERVAL - 50 DAY) as from_date";
                $query_to = "SELECT DATE_ADD('" . $date . "', INTERVAL + 50 DAY) as to_date";            
            break;
        }
        $stm = $pdo -> query( $query_from );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> from_date = $result[0]["from_date"];    
        $stm = $pdo -> query( $query_to );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> to_date = $result[0]["to_date"];
        return $return;
    }
    public function saveFormat( $pdo, $id, $name, $background, $font ){
        $return = new \stdClass();
        $query = "UPDATE `event_format` SET `name` = '$name',`bckg_color` = '$background', 
                    `font` = '$font' WHERE `event_format`.`id` = $id";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Format wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Formates ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function newFormat( $pdo, $name, $background, $font ){
        $return = new \stdClass();
        $query = "INSERT INTO `event_format` (`name`, `bckg_color`, `font`) VALUES ('$name', '$background', '$font')";
        try {
            $pdo->query( $query );      
            $return -> newId = $pdo->lastInsertId();    
            $return -> success = true;    
            $return -> message = "Das Format wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Anlegen des Formates ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function deleteFormat( $pdo, $id ){
        $return = new \stdClass();
        $query = "DELETE FROM `event_format` WHERE id = $id";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Das Format wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Formates ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function getPlaces( $pdo ) {
        $return = new \stdClass();
        try {
            $query = "SELECT * FROM `event_place`";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $return -> success = true;    
            $return -> message = "Die Orte wurden erfolgreich gelesen.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Lesen der Orte ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function savePlace( $pdo, $id, $place ){
        $return = new \stdClass();
        $query = "UPDATE event_place SET place = '$place' WHERE id = $id ";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Der Ort wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Ortes ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function newPlace( $pdo, $place ){
        $return = new \stdClass();
        $query = "INSERT INTO `event_place` (`place`) VALUES ('$place')";
        try {
            $pdo->query( $query );      
            $return -> success = true;
            $return -> newId = $pdo->lastInsertId();    
            $return -> message = "Der Ort wurde erfolgreich angelegt.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Anlegen des Ortes ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function deletePlace( $pdo, $id ){
        $return = new \stdClass();
        $query = "DELETE FROM `event_place` WHERE id = $id";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Der Ort wurde erfolgreich gelöscht.";
        } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Löschen des Ortes ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;    
    }
    public function getEvents( $pdo, $dates, $whereClausel = "" ) {
        $return = new \stdClass();
        try {
            if( !isset( $dates  -> to_date ) ) {
                $query = "SELECT * FROM event WHERE start_date >= '" . $dates -> from_date . "' $whereClausel";
            } else {
                $query = "SELECT * FROM event WHERE start_date >= '" . $dates -> from_date . "' AND start_date <'" . $dates -> to_date . "' AND end_date <'" . $dates -> to_date . "' $whereClausel";
            }
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $return -> success = true;    
            $return -> message = "Die Termine wurden erfolgreich gelesen.";
        } catch ( Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Lesen der Termine ist folgender Fehler aufgetreten:" . $e -> getMessage();
        }
        return $return;
    }
    public function buildEvent( $dbo, $data ) {
        $return = new \stdClass();
        $query = "SELECT remind_me, role_id, count_part FROM event_participate WHERE event_id = " . $data["id"] . " AND user_id = " . $_SESSION["user_id"];
        $stm = $dbo -> query( $query );
        $result_participate = $stm -> fetchAll(PDO::FETCH_ASSOC);
        if( count( $result_participate ) == 0 ) {
            $participate = 0;
            $remind_me = 0;
            $participateAs = 0;
            $count_part = 1;
        } else {
            $participate = 1;
            $remind_me = $result_participate[0]["remind_me"];
            $participateAs = $result_participate[0]["role_id"];
            $count_part = $result_participate[0]["count_part"];
        }
        $return -> string = "{\n";
        $return -> string .= "id: " . $data["id"] . ",\n";
        $return -> string .= "eventId: " . $data["id"] . ",\n";
        if( $data["group_id"] != 0 ) {
            $return -> string .= "group_id: " . $data["group_id"] . ",\n";
        }
        if( $data["group_id"] != 0 ) {
            $return -> string .= "groupId: " . $data["group_id"] . ",\n";
        }
        $return -> string .= "title: '" . $data["title"] . "',\n";
        $return -> string .= "start: '" . $data["start_date"];
        if( $data["start_time"] != "00:00:00" ) {
            $return -> string .= "T" . $data["start_time"] . "',\n"; 
        } else {
            $return -> string .= "',\n"; 
        }
        if( $data["end_date"] != "0000-00-00" ) {
            $return -> string .= "end: '"  .   $data["end_date"];
        } else {
            $return -> string .= "end: '"  .   $data["start_date"];
        }
        if( $data["end_time"] != "00:00:00" ) {
            $return -> string .= "T" . $data["end_time"] . "',\n"; 
        } else {
            $return -> string .= "',\n"; 
        }           
        //}
        if( $data["url"] != "" ) {
            $return -> string .=  "url: '" . $data["url"] . "',\n";
        }
        if( $data["inner_url"] != "" ) {
            $return -> string .=  "innerUrl: '" . $data["inner_url"] . "',\n";
        }
        if( $data["inner_url_text"] != "" ) {
            $return -> string .=  "innerUrlText: '" . $data["inner_url_text"] . "',\n";
        }
        if( $data["description"] != "" ) {
            $return -> string .=  "description: '" . $data["description"] . "',\n";
        }
        if( $data["notice"] != "" ) {
            $return -> string .=  "notice: '" . $data["notice"] . "',\n";
        } else {
            $return -> string .=  "notice: '',\n";
        }
        if( $data["place"] != "" ) {
            $return -> string .=  "place: '" . $data["place"] . "',\n";
        }
        /*
        if( $data["format"] != "" ) {
            $return -> string .=  "format: '" . $data["format"] . "',\n";
        }
        */
        if( $data["class"] != "" ) {
            $return -> string .=  "className: '" . $data["class"] . "',\n";
        }
        if( $data["creator"] != "" ) {
            $return -> string .=  "creator: '" . $data["creator"] . "',\n";
        }
        $return -> string .=  "deadline: '" . $data["registration_deadline"] . "',\n";
        $return -> string .=  "participate: '$participate',\n"; 
        $return -> string .=  "participateAs: '$participateAs',\n"; 
        $return -> string .=  "remindMe: '$remind_me',\n"; 
        $return -> string .=  "durationEditable: true,\n";
        $query = "SELECT CONCAT( lastname, ', ', firstname, '<br>' ) AS part FROM event_participate, user WHERE event_id = " . $data["id"] . " and event_participate.user_id = user.id ORDER BY lastname";
        $stm = $dbo -> query( $query );
        $result_participants = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $l = count( $result_participants );
        $i = 0;
        $part = "";
        while ( $i < $l ){
            $part .= $result_participants[$i]["part"];
            $i += 1;
        }
        $part = substr( $part, 0, -4 );
        $return -> string .=  "participants: '$part',\n";
        $return -> string .=  "countPart: '$count_part',\n";
        
        $return -> string = substr( $return -> string, 0, -2 );
        $return -> string .= "},\n";
        $return -> string = substr( $return -> string, 0, -1 );
        
        return $return;
    }
    public function saveSerieEvent( $pdo, $id, $group_id, $title, $start_date, $end_date, $start_time, 
                    $end_time, $url, $description, $notice, $place, $format, $deadline, $inner_url = "", $inner_url_text = "" ){
        $return = new \stdClass();
        // get old event dates and times for inform participants if event changed
        $query = "SELECT title, start_date, end_date, start_time, end_time, registration_deadline, description FROM event WHERE id = $id";
        $stm = $pdo -> query( $query );
        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $return -> diffStartDate = ( strtotime( $start_date ) - strtotime( $result[0]["start_date"] ) ) / (24*3600);
        $return -> diffEndDate = ( strtotime( $end_date ) - strtotime( $result[0]["end_date"] ) ) / (24*3600);
        $return -> diffDeadlineDate = ( strtotime( $deadline ) - strtotime( $result[0]["start_date"] ) ) / (24*3600);
        $tmp = strtotime( $result[0]["start_time"] );
        $tmpOldHS = explode( ":", $result[0]["start_time"] );
        $tmpOldHS = intval( $tmpOldHS[0] );
        $tmpNewHS = explode( ":", $start_time );
        $tmpNewHS = intval( $tmpNewHS[0] );
        $return -> diffStartTimeHours = $tmpOldHS - $tmpNewHS;
        $tmpOldHS = explode( ":", $result[0]["start_time"] );
        $tmpOldHS = intval( $tmpOldHS[1] );
        $tmpNewHS = explode( ":", $start_time );
        $tmpNewHS = intval( $tmpNewHS[1] );
        $return -> diffStartTimeMinutes = $tmpOldHS - $tmpNewHS;
        $tmpOldHS = explode( ":", $result[0]["end_time"] );
        $tmpOldHS = intval( $tmpOldHS[0] );
        $tmpNewHS = explode( ":", $end_time );
        $tmpNewHS = intval( $tmpNewHS[0] );
        $return -> diffEndTimeHours = $tmpOldHS - $tmpNewHS;
        $tmpOldHS = explode( ":", $result[0]["end_time"] );
        $tmpOldHS = intval( $tmpOldHS[1] );
        $tmpNewHS = explode( ":", $end_time );
        $tmpNewHS = intval( $tmpNewHS[1] );
        $return -> diffEndTimeMinutes = $tmpOldHS - $tmpNewHS;
        $oldTitle = $result[0]["title"];
        $oldDescription = $result[0]["description"];
        $this -> saveEvent( $pdo, $id, $group_id, $title, $start_date, $end_date, $start_time, 
                    $end_time, $url, $description, $place, $format, $deadline, $inner_url = "", $inner_url_text = "" );
        $query = "SELECT * FROM event WHERE start_date > now() and start_date > '$start_date' and group_id = $group_id and id <> $id";
        $stm = $pdo -> query( $query );
        $result_serie = $stm -> fetchAll(PDO::FETCH_ASSOC);
        $l = count( $result_serie );
        $i = 0;
        while ( $i < $l ){
            $date = new DateTime($result_serie[$i]["start_date"]);
            if( $return -> diffStartDate < 0 ) {
                $date->modify( "-" . ( $return -> diffStartDate * -1 ) . " day");    
            } else {
                $date->modify( "+" . $return -> diffStartDate . " day");    
            }
            $result_serie[$i]["start_date"] = $date->format('Y-m-d');
            $date = new DateTime($result_serie[$i]["end_date"]);
            if( $return -> diffEndDate < 0 ) {
                $date->modify( "-" . ( $return -> diffEndDate * -1 ) . " day");    
            } else {
                $date->modify( "+" . $return -> diffEndDate . " day");    
            }
            $result_serie[$i]["end_date"] = $date->format('Y-m-d');
            $date = new DateTime($result_serie[$i]["start_date"]);
            if( $deadline != "" ) {
                if( $return -> diffDeadlineDate < 0 ) {
                    $date->modify( "-" . ( $return -> diffDeadlineDate * -1 ) . " day");    
                } else {
                    $date->modify( "+" . $return -> diffDeadlineDate . " day");    
                }
                $result_serie[$i]["registration_deadline"] = $date->format('Y-m-d');                
            } else {
                $result_serie[$i]["registration_deadline"] = "";
            }
            try {
                $this -> saveEvent( $pdo, $result_serie[$i]["id"], $group_id, $title, $result_serie[$i]["start_date"], $result_serie[$i]["end_date"], $start_time, $end_time, $url, $description, $notice, $place, $format, $result_serie[$i]["registration_deadline"], $inner_url = "", $inner_url_text = "" );
            } catch ( Exception $e ) {
                $return -> success = false;    
                $return -> message = "Beim Speichern des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();
                return $return;
            }
            $i += 1;
        } 
        $return -> success = true;    
        $return -> message = "Das Speichern der Terminserie war erfolgreich. Die Teilnehmer wurden erfolgreich informiert.";       
        return $return; 
    }    
    public function newEvent( $pdo, $group_id, $title, $start_date, $end_date, $start_time, $end_time, $url, $description, $notice, $repeat, $repeat_to, $place, $format, $deadline, $inner_url = "", $inner_url_text = "", $creator = 0 ){
        $return = new \stdClass();
        if( $repeat != "" && $repeat != "0" ) {
            $group_id = $this -> getMaxGroupId( $pdo ) + 1;
        }
        $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
        `end_date`, `end_time`, `url`, `description`, `notice`, `place`, `class`, `registration_deadline`, `inner_url`, `inner_url_text`, `creator` ) VALUES ($group_id, '$title', 
        '$start_date', '$start_time', '$end_date', '$end_time', '$url', '$description', '$notice', '$place', '$format', '$deadline', '$inner_url', '$inner_url_text', $creator );";
        try {
            $pdo->query( $query );
            $return -> lastEventId = $pdo -> lastInsertId();
            if( $inner_url != "" ) {
                $tmp = explode( "/", $inner_url );
                $fname = $tmp[ count( $tmp ) - 1 ];
                if( file_exists( "../documents/$fname") ) {
                    $tmpExt = explode( ".", $fname );
                    $ext = $tmpExt[ count( $tmpExt) - 1 ];
                    $newFileName = "cal_ev_appendix_edit_" . $return -> lastEventId . "_" . time() . "." . $ext;
                    rename( "../documents/$fname", "../documents/$newFileName" );
                    $query = "UPDATE event set inner_url = 'library/documents/$newFileName' WHERE id = " . $return -> lastEventId;
                    $pdo->query( $query );
                }                
            }
            $return -> success = true;    
            $return -> message = "Der Termin wurde erfolgreich gespeichert.";
        } catch ( Exception $e ) {
                $return -> success = false;
                if( $e -> getCode() == "23000" ) {
                    $return -> message = "Dieser Termin existiert bereits und kann so nicht gespeichert werden.";    
                } else {
                    $return -> message = "Beim Speichern des Termins ist folgender Fehler aufgetreten:" . $e -> getMessage();                    
                }  
        }
        $repeat_to = Date( "Y-m-d", strtotime( $repeat_to ) - 24 * 3600 );
        
        switch( $repeat ) {
            case "":
            break;
            case "1":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"]);
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                            $query = "SELECT DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " DAY ) AS repeat_date";
                            $stm = $pdo -> query( $query );
                            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                            $repeat_date = $result[0]["repeat_date"];
                            $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                            `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title',
                            DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " DAY ), '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . $i . " DAY ), '$end_time', '$url', '$description', 
                            '$place', '$format');";
                            $pdo->query( $query );
                        }
            break;
            case "5":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"]);
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                            $query = "SELECT WEEKDAY( DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " DAY ) ) AS week_day";
                            $stm = $pdo -> query( $query );
                            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                            if( $result[0]["week_day"] == "5" || $result[0]["week_day"] == "6" ) {
                            } else {
                            $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                            `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title',
                            DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " DAY ), '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . $i . " DAY ), '$end_time', '$url', '$description', 
                            '$place', '$format');";
                                $pdo->query( $query );                                
                            }
                            
                        }                    
            break;
            case "7":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"] ) / 7;                        
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                                $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, 
                                '$title', DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " WEEK ), 
                                '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . $i . " WEEK ), 
                                '$end_time', '$url', '$description', '$place', '$format');";
                                $pdo->query( $query );
                        }                                
            break;
            case "14":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"] ) / 14;                        
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                                $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title',
                                DATE_ADD( '" . $start_date . "', INTERVAL " . ( $i * 2 ) . " WEEK ), '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . ( $i * 2 ) . " WEEK ), '$end_time', '$url', '$description', '$place', '$format');";
                                $pdo->query( $query );
                        }                                
            break;
            case "28":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"] ) / 28;                        
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                                $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title',
                                DATE_ADD( '" . $start_date . "', INTERVAL " . ( $i * 4 ) . " WEEK ), '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . ( $i * 4 ) . " WEEK ), '$end_time', '$url', '$description', '$place', '$format');";
                                $pdo->query( $query );
                        }                                
            break;
            case "31":
                        $query = "SELECT DATEDIFF('" . $repeat_to . "', '" . $start_date . "') as ddiff;";
                        $stm = $pdo -> query( $query );
                        $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
                        $date_diff = intval( $result[0]["ddiff"] ) / 31;                        
                        $date_diff++;
                        for( $i = 1; $i < $date_diff; $i++ ) {
                                $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title',
                                DATE_ADD( '" . $start_date . "', INTERVAL " . $i . " MONTH ), '$start_time', DATE_ADD( '" . $end_date . "', INTERVAL " . $i . " MONTH ), '$end_time', '$url', '$description', '$place', '$format');";
                                $pdo->query( $query );
                        }                                
            break;
            case "2":   // 1./3./5. Wochentag des Monats
                        $date_array_1 = getNthOfMonth( $start_date, $repeat_to, intval( date("w", strtotime( $start_date ) ) ), 1 );
                        $date_array_2 = getNthOfMonth( $start_date, $repeat_to, intval( date("w", strtotime( $start_date ) ) ), 3 );
                        $date_array_3 = getNthOfMonth( $start_date, $repeat_to, intval( date("w", strtotime( $start_date ) ) ), 5 );
                        $dA = array_merge( $date_array_1, $date_array_2, $date_array_3 );
                        $dataDiff = strtotime( $end_date ) - strtotime( $start_date );
                        $l = count( $dA );
                        $i = 0;
                        while( $i - $l ) {
                            $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title', '" . $dA[$i] . "'
                                , '$start_time', '" . date("Y-m-d", strtotime( $dA[$i] ) + $dataDiff ) . "', '$end_time', '$url', '$description', 
                                '$place', '$format');";
                            $pdo->query( $query );
                            $i++;
                        }
            break;
            case "3":   // 1./3./5. Wochentag des Monats
                        $date_array_1 = getNthOfMonth( $start_date, $repeat_to, intval( date("w", strtotime( $start_date ) ) ), 2 );
                        $date_array_2 = getNthOfMonth( $start_date, $repeat_to, intval( date("w", strtotime( $start_date ) ) ), 4 );
                        $dA = array_merge( $date_array_1, $date_array_2 );
                        $dataDiff = strtotime( $end_date ) - strtotime( $start_date );
                        $l = count( $dA );
                        $i = 0;
                        while( $i - $l ) {
                            $query = "INSERT INTO `event` (`group_id`, `title`, `start_date`, `start_time`,
                                `end_date`, `end_time`, `url`, `description`, `place`, `class`) VALUES ($group_id, '$title', '" . $dA[$i] . "'
                                , '$start_time', '" . date("Y-m-d", strtotime( $dA[$i] ) + $dataDiff ) . "', '$end_time', '$url', '$description', 
                                '$place', '$format');";
                            $pdo->query( $query );
                            $i++;
                        }
            break;
    }
        return $return;
    }
    public function participate( $pdo, $user_id, $event_id, $message_behavior, $remindMe = "true", $informSelf = true, $participateAs = 0, $count_part = 1 ) {
        $return = new \stdClass();
        $settings = parse_ini_file('../../ini/settings.ini', TRUE);
        $query = "INSERT INTO `event_participate` (`user_id`, `event_id`, `remind_me`, `role_id`, count_part) VALUES ( $user_id, $event_id, $remindMe, $participateAs, $count_part );";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Teilnahme wurde erfolgreich gespeichert.";
    $q = "select * from event WHERE id = $event_id";
    $stm = $pdo -> query( $q );
    $result_event = $stm -> fetchAll(PDO::FETCH_ASSOC);
            require_once( "classes/InformUser.php" );
            $iu = new \InformUser( $pdo, $settings["calendar"]["message_behavior"], 27, 0, 0, $result_event[0]["creator"], true );
    $q = "SELECT CONCAT( firstname, ' ', lastname ) AS name FROM user WHERE id = " . $_SESSION["user_id"];
    $stm = $pdo -> query( $q );
    $result_participator = $stm -> fetchAll(PDO::FETCH_ASSOC);
    $query = "SELECT CONCAT( firstname, ' ', lastname ) AS name FROM user, event_participate WHERE user.id = event_participate.user_id AND event_id = $event_id";
    $stm = $pdo -> query( $query );
    $result_otherParticipators = $stm -> fetchAll(PDO::FETCH_ASSOC);
    if( $result_event[0]["start_time"] === "00:00:00" ) {
        $tmpTime = strtotime( $result_event[0]["start_date"] );
        $tmpTime = date( "d.m.Y", strtotime( $result_event[0]["start_date"] ) );
    } else {
        $tmpTime = strtotime( $result_event[0]["start_date"] . " " . $result_event[0]["start_time"] );
        $tmpTime = date( "d.m.Y G:i", $tmpTime ) . " Uhr";
    }
    $content = "<p>Der Nutzer „" . $result_participator[0]["name"] . "” hat dem Termin „" . $result_event[0]["title"] . "” für den $tmpTime am " . date( "d.m.Y", time() ) . " zugesagt.</p>";
    $content .= "<p>Es nehmen nun teil:</p>";
    $content .= "<ul>";
    for( $i = 0; $i < count( $result_otherParticipators ); $i++ ) {
        $content .= "<li>" . $result_otherParticipators[$i]["name"] . "</li>";                        
    }
    $content .= "</ul>";
    $iu -> sendUserInfo( "Terminteilnahme", "Terminteilnahme", $content, $content );
    /*
            if( $informSelf ) {
                $result = informEventCreatorParticipate( $pdo, $result_creator[0]["id"], $event_id, $result_creator[0]["firstname"], $result_creator[0]["lastname"], $result_creator[0]["email"], $result_creator[0]["opt_in"], $message_behavior, $informSelf);    
            }
    */
        } catch ( Exception $e ) {
                $return -> success = false;
                $return -> errorCode = $e -> getCode();
                if( $e -> getCode() == "23000" ) {
                    $return -> message = "Sie können nur einmal an einem Termin teilnehmen";
                } else {
                    $return -> message = "Beim Speichern der Teilnahme ist folgender Fehler aufgetreten:" . $e -> getMessage();                    
                }   
        }
        return $return;
    }
    public function deleteParticipation( $pdo, $user_id, $event_id, $message_behavior ) {
        $return = new \stdClass();
        $settings = parse_ini_file('../../ini/settings.ini', TRUE);
        $query = "DELETE FROM `event_participate` WHERE user_id = $user_id AND event_id = $event_id";
        try {
            $pdo->query( $query );      
            $return -> success = true;    
            $return -> message = "Die Teilnahme wurde erfolgreich gelöscht.";
            require_once( "classes/InformUser.php" );
    $q = "select * from event WHERE id = $event_id";
    $stm = $pdo -> query( $q );
    $result_event = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $iu = new \InformUser( $pdo, $settings["calendar"]["message_behavior"], 27, 0, 0, $result_event[0]["creator"], true );
    $query = "SELECT CONCAT( firstname, ' ', lastname ) AS name FROM user WHERE id = " . $_SESSION["user_id"];
    $stm = $pdo -> query( $query );
    $result_participator = $stm -> fetchAll(PDO::FETCH_ASSOC);
    if( $result_event[0]["start_time"] === "00:00:00" ) {
        $tmpTime = strtotime( $result_event[0]["start_date"] );
        $tmpTime = date( "d.m.Y", strtotime( $result_event[0]["start_date"] ) );
    } else {
        $tmpTime = strtotime( $result_event[0]["start_date"] . " " . $result_event[0]["start_time"] );
        $tmpTime = date( "d.m.Y G:i", $tmpTime ) . " Uhr";
    }
    $content = "<p>Der Nutzer „" . $result_participator[0]["name"] . "” hat dem Termin „" . $result_event[0]["title"] . "” für den $tmpTime am " . date( "d.m.Y", time() ) . " abgesagt.</p>";
    $content .= "<p>Es nehmen nun teil:</p>";
    $iu -> sendUserInfo( "Terminabsage", "Terminabsage", $content, $content );
/*
            require_once( "functions.php" );
            $result = informEventCreatorDeteteParticipate( $pdo, $result_creator[0]["id"], $event_id, $result_creator[0]["firstname"], $result_creator[0]["lastname"], $result_creator[0]["email"], $result_creator[0]["opt_in"], $message_behavior);
*/
        } catch ( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Löschen der Teilnahme ist folgender Fehler aufgetreten:" . $e -> getMessage();                    
                   
        }
        return $return;
    }
    public function getParticipants( $pdo, $event_id ) {
        $return = new \stdClass();
        $query = "SELECT user.id as participant_id, CONCAT( `user`.`firstname`, ' ', `user`.`lastname`) AS participant, count_part FROM `event_participate`, `user` WHERE user_id = `user`.`id` AND event_id = $event_id";
        try {
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> data = $result;
            $l = count( $result );
            $i = 0;
            $return -> Ids = [];
            while( $i < $l ) {
                array_push( $return -> Ids, $result[$i]["participant_id"] );
                $i += 1;
            }
            $query = "SELECT SUM( count_part ) as sum FROM `event_participate` WHERE event_id = $event_id";
            $stm = $pdo -> query( $query );
            $result = $stm -> fetchAll(PDO::FETCH_ASSOC);
            $return -> sum = $result[0]["sum"];
            
            $return -> success = true;
            $return -> message = "Die Teilnehmer wurden erfolgreich gelesen";
        } catch ( Exception $e ) {
                $return -> success = false;
                $return -> message = "Beim Lesen der Teilnehmer ist folgender Fehler aufgetreten:" . $e -> getMessage();                    
                   
        }
        return $return;
    }
    public function buildInformUser( $pdo, $toRole, $toUser, $participants ) {
        if( $toRole == "" ) $toRole = 0;
        $q = "SELECT user.id FROM user, account WHERE user.id = account.user_id AND account.role_id = " . $toRole;
        $s = $pdo -> query( $q );
        $tmpUserForRole = $s -> fetchAll( PDO::FETCH_ASSOC );
        $userForRole = [];
        $l = count( $tmpUserForRole );
        $i = 0;
        while( $i < $l ) {
            array_push( $userForRole, $tmpUserForRole[ $i ]["id"] );
            $i += 1;
        }
        $tmpUser = explode( ",", $toUser );
        $userForRole = array_unique( array_merge( $userForRole, $tmpUser ) );
        $informUsers = array_values( array_diff( $userForRole, $participants ) );
        $a = 0;
        return $informUsers;
    }
    public function setCountParticipants( $pdo, $user_id, $event_id, $count ) {
        $return = new \stdClass();
        try{
            $query = "UPDATE `event_participate` SET `count_part` = $count WHERE event_id = $event_id AND user_id = $user_id";
            $pdo -> query( $query );
            $return -> success = true;    
            $return -> message = "Die Anzahl der Teilnahmer wurden erfolgreich gespeichert.";
            
        } catch (Exception $e ) {
            $return -> success = false;    
            $return -> message = "Beim Löschen der Anzahl der Teilnahmer ist folgender Fehler aufgetreten: " . $e -> getMessage();            
        }
        return $return;
    }
}  
?>
