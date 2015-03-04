<?php
session_start();
if(!(isset($_SESSION['connected']) && $_SESSION['connected']))
{
	header('HTTP/1.0 403 Forbidden');
	exit;
}
var_dump($_FILES);
if(isset($_FILES["f"]) && $_FILES["f"]["error"]== UPLOAD_ERR_OK)
{
	$uploadDirectory    = 'data/'; //specify upload directory ends with / (slash)

	//Is file size is less than allowed size.
	if ($_FILES["f"]["size"] > 51200)
		die("File size is too big!");

	//allowed file type Server side check
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	if(strtolower($_FILES['f']['type']) != 'audio/mpeg' ||
		finfo_open(finfo_file($finfo, $_FILES['f']['tmp_name']) != 'audio/mpeg'))
		die('Unsupported File!'); //output error

	$extension = 'mp3';
	$id        = uniqid();
	$filename  = $id.$extension; //new file name

	if(move_uploaded_file($_FILES['f']['tmp_name'], $uploadDirectory.$filename ))
	{
		exit;
	}else{
		die('error uploading File!');
	}

}
else
	die('Something wrong with upload! Is "upload_max_filesize" set correctly?');
