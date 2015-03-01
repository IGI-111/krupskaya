<?php
session_start();
if(!(isset($_SESSION['connected']) && $_SESSION['connected']))
{
	header('HTTP/1.0 403 Forbidden');
	die;
}
// assure that you get only numbers
$id = filter_var($_GET['r'], FILTER_SANITIZE_NUMBER_INT);
$extension = "mp3";
$mime_type = "audio/mpeg";
$filename = "$id.$extension";
$file = "data/$filename";


if(file_exists($file)){
	header("Pragma: public");
	header("Expires: 0");
	header("Content-Type: {$mime_type}");
	header('Content-Length: ' . filesize($file));
	header('Content-Disposition: inline; filename="'.$filename);
	header( 'Content-Range: bytes 0-'.(filesize($file)-1).'/'.filesize($file));
	header( 'Accept-Ranges: bytes');
	header('X-Pad: avoid browser bug');
	header('Cache-Control: public, must-revalidate, proxy-revalidate');
	header("Content-Transfer-Encoding: chunked");
	readfile($file);
}else{
	header("HTTP/1.0 404 Not Found");
}
