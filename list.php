<?php
session_start();
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->songs;
$format = array('_id' => 0, 'id' => 1);
$cursor = $collection->find(array(),$format);
$result = array();
foreach ($cursor as $row)
	$result[] = $row['id'];

header('Content-Type: application/json');
echo json_encode($result);
