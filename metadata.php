<?php
session_start();
if(!(isset($_SESSION['connected']) && $_SESSION['connected']))
{
	header('HTTP/1.0 403 Forbidden');
	die;
}
// assure that you get only numbers
$id = filter_var($_GET['r'], FILTER_SANITIZE_NUMBER_INT);
$file = "data/$id.json";

if(file_exists($file)){
	header('Content-Type: application/json');
	readfile("data/$id.json");
}else{
	header("HTTP/1.0 404 Not Found");
}
