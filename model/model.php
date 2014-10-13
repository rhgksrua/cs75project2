<?php

//include("../../pw.php");
//
//define('DB_HOST', 'localhost');
//define('DB_USER', $user);
//define('DB_PASSWORD', $pw);
//define('DB_DATABASE', 'project1');

//$dsn = 'mysql:host='.DB_HOST.';dbname='.DB_DATABASE;
//$dbh = new PDO($dsn, DB_USER, DB_PASSWORD);
//
//$dbh->beginTransaction();
//
//$stmt = $dbh->prepare("SELECT * FROM users WHERE id=:userid");
//$stmt->bindValue(':userid', $userid, PDO::PARAM_INT);
//$stmt->execute();
//
//$dbh->commit();  // OR $dbh->rollBack();
//
//$dbh = null;

/**
 *
 * returns array of names and numbers
 * result[0][0] = names
 * result[0][1] = numbers
 *
 *
 */
function get_available_routes($path = "../model/routes.xml") {
    
    $xml = simplexml_load_file($path);
    $names = $xml->xpath("/root/routes/route/name");
    $routeID = $xml->xpath("/root/routes/route/routeID");
    $numbers = $xml->xpath("/root/routes/route/number");
    $count = count($names);
    $result = [];
    for ($i = 0; $i < $count; $i++) {
        $result[] = array($names[$i], $numbers[$i], $routeID[$i]);

    }

    return $result;

}




// END
