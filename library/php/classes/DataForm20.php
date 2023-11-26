<?php
define( "COUNT_PAGINATION", 5 );
class DataForm {
    private     $pdo;
    public      $fieldDefs;
    private     $table;
    public function __construct( $pdo, $table, $fieldDefs = null) {
        // content
        $this -> pdo = $pdo;
        $this -> table = $table;
        if ( $fieldDefs === null ) {
            // code...
            $q = "SHOW FULL COLUMNS FROM " .  $this -> table;
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $this -> fieldDefs = $r;
        } else {
            // code...
            $this -> $fieldDefs = $fieldDefs;
        }
        
    }
    private function getFieldDefs() {
        // content
        $q = "SHOW FULL COLUMNS FROM " .  $this -> table;
    }   
}
