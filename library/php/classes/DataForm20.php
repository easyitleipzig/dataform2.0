<?php
define( "COUNT_PAGINATION", 5 );
class DataForm {
    private     $pdo;
    public      $fieldDefs;
    private     $table;
    private     $fields;
    public      $primaryKey;
    public function __construct( $pdo, $table, $fields = "", $fieldDefs = [] ) {
        // content
        $this -> pdo = $pdo;
        $this -> table = $table;
        if ( count( $fieldDefs ) === 0 ) {
            if( $fields === "" ) {
                $q = "SHOW FULL COLUMNS FROM " .  $this -> table;
                
            } else {
                $tmp = explode( ",", $fields );
                $i = 0;
                $l = count( $tmp );
                while( $i < $l ) {
                    $tmp[$i] = "'" . $tmp[$i] . "'";
                    $i += 1;
                }
                $fields = implode(",", $tmp );
                $q = "SHOW FULL COLUMNS FROM " .  $this -> table . " where Field in (" . $fields . ")"; 
            }
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $this -> fieldDefs = $r;
            $q = "SHOW KEYS FROM " . $this -> table . " WHERE Key_name = 'PRIMARY'";
            $s = $this -> pdo -> query( $q );
            $r = $s -> fetchAll( PDO::FETCH_ASSOC );
            $this -> primaryKey = $r[0]["Column_name"];
        } else {
            // code...
            $this -> $fieldDefs = $fieldDefs;
        }
        
    }
    private function getFieldDefs() {
        // content
        $q = "SHOW FULL COLUMNS FROM " .  $this -> table;
        $s = $this -> pdo -> query( $q );
        return $s -> fetchAll( PDO::FETCH_ASSOC );
    }
    public function getRecords( $fields, $whereClausel, $orderBy, $pageNumber, $countPerPage, $hasNew ) {
        if( $fields === "" ) {
            $q = "select * from " . $this -> table;
        } else {
            $q = "select $fields from " . $this -> table;
        }
        $s = $this -> pdo -> query( $q );
        return $s -> fetchAll( PDO::FETCH_CLASS );
        
        if( $hasNew === "true" ) {
            
        }
    }   
}
