<?php
session_start();
// assure that you get only strings
$album = filter_var($_GET['r'], FILTER_SANITIZE_STRING);
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
$query = array('$query' => array(
        'album' => $album,
        '$or' => array(
            array("username" => $_SESSION['username']),
            array("public" => true)
            )
        ),
    '$orderby' => array('track' => 1));

$cursor = $collection->find($query);

if($cursor == NULL){
    header("HTTP/1.0 404 Not Found");
    exit;
}
header('Content-Type: application/json');

$result = [];
foreach($cursor as $row)
    $result[] = $row;

echo json_encode($result);
