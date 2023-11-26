<?php
$return = new \stdClass();
session_start();
$filename = $_POST["filename"];
if( isset ($_POST["event_id"] ) ) {
$glob = glob( "../documents/cal_ev_appendix_" . $_POST["event_id"] . "*.*" );
    for( $i = 0; $i < count( $glob ); $i++ ) {
        if( file_exists( $glob[$i] ) ) {
            unlink( $glob[$i] );
        }    
    }    
}
$result = move_uploaded_file( $_FILES["file"]['tmp_name'], "../documents/" . $_FILES["file"]["name"] );  
$result = rename( "../documents/" . $_FILES["file"]["name"], "../documents/$filename" ); 
$return -> filename = $filename;
print_r( json_encode( $return ));       
   
//header("Location: ../../s_and_a.php");
?>
