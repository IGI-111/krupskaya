<?php
session_start();
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
header('Content-Type: application/json');
echo json_encode($collection->distinct("id"));
