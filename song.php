<?php
header('Content-Type: application/json');
// assure that you get only numbers
$id = preg_replace('/[^0-9]/', '', $_GET['r']);
$song = file_get_contents("data/$id.json");
echo $song;
