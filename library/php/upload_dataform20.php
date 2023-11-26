<?php
$return = new \stdClass();
session_start();
$filename = $_POST["targetFileName"];
if( $_POST["replace"] === "true" && $_POST["oldFileName"] !== "" ) {
$glob = glob( "../documents/cal_ev_appendix_" . $_POST["event_id"] . "*.*" );
    for( $i = 0; $i < count( $glob ); $i++ ) {
        if( file_exists( $glob[$i] ) ) {
            unlink( $glob[$i] );
        }    
    }    
}
$result = move_uploaded_file( $_FILES["file"]['tmp_name'], $_POST["targetPath"] . $_FILES["file"]["name"] );  
//$result = move_uploaded_file( $_FILES["file"]['tmp_name'], "../documents/" . $_FILES["file"]["name"] );  
$result = rename( "../documents/" . $_FILES["file"]["name"], "../documents/$filename" ); 
$return -> filename = $_FILES["file"]["name"];
print_r( json_encode( $return ));       
   
//header("Location: ../../s_and_a.php");
?>
