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
	$lastModified=filemtime($file);
	$etagFile = md5_file($file);
	$ifModifiedSince=(isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false);
	$etagHeader=(isset($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH']) : false);
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", $lastModified)." GMT");
	header("Etag: $etagFile");
	header('Cache-Control: public');

	//check if page has changed. If not, send 304 and exit
	if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE'])==$lastModified || $etagHeader == $etagFile)
	{
		header("HTTP/1.1 304 Not Modified");
		exit;
	}
	else{
		header('Content-Type: application/json');
		readfile("data/$id.json");
	}
}else{
	header("HTTP/1.0 404 Not Found");
}