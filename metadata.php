<?php
session_start();
// assure that you get only numbers
$id = filter_var($_GET['r'], FILTER_SANITIZE_STRING);
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
$query = array('_id' => $id,
    '$or' => array(
        array("username" => (isset($_SESSION['username']) ? $_SESSION['username'] : '')),
        array("public" => true))
    );
$result = $collection->findOne($query);

if($result == NULL){
    header("HTTP/1.0 404 Not Found");
    exit;
}
header('Content-Type: application/json');
echo json_encode($result);
