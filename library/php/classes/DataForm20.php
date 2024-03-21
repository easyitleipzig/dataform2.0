<?php
define( "COUNT_PAGINATION", 5 );
class DataForm {
    private     $pdo;
    public      $fieldDefs;
    private     $table;
    private     $fields;
    public      $primaryKey;
    public      $countRecords;
    public function __construct( $pdo, $table ) {
        // content
        $this -> pdo = $pdo;
        $this -> table = $table;
    }
    public function getFieldDefs( $fields, $fieldDefs = [] ) {
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
    public function getRecords( $fields, $whereClausel, $orderBy, $pageNumber, $countPerPage, $hasNew, $primaryKey = "" ) {
        if( $fields === "" ) {
            $q = "select * from " . $this -> table;
        } else {
            $q = "select $fields, $primaryKey as primaryKey from " . $this -> table;
        }
        if( $whereClausel !== "" ) {
            $q .= " $whereClausel"; 
        }
        if( $orderBy !== "") {
            $q .= " ORDER BY $orderBy";
        }
        $s = $this -> pdo -> query( $q );
        $r = $s -> fetchAll( PDO::FETCH_CLASS );
        if( $hasNew == "true" ) {
            if( $fields === "" ) {
                $q = "SHOW FULL COLUMNS FROM " .  $this -> table;
            } else {
                
            }
            $s = $this -> pdo -> query( $q );                
        }
        return $r;        
    }   
}
