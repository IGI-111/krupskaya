<?php
session_start();
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
header('Content-Type: application/json');
echo json_encode($collection->distinct("album",
    array('$or' => array(
        array("username" => $_SESSION['username']),
        array("public" => true)))));
