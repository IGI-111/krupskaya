<?php
session_start();
// assure that you get only strings
$album = $_GET['r'];
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
$query = array('$query' => array(
        'album' => $album,
        '$or' => array(
            array("username" => (isset($_SESSION['username']) ? $_SESSION['username'] : '')),
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
