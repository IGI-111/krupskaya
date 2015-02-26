<?php
header('Content-Type: application/json');
// assure that you get only numbers
$id = filter_var($_GET['r'], FILTER_VALIDATE_INT);
$song = file_get_contents("data/$id.json");
echo $song;
