<?php
require_once 'process.php';

session_start();
if(!(isset($_SESSION['connected']) && $_SESSION['connected']))
{
	header('HTTP/1.1 401 Unauthorized');
	exit;
}
if(!isset($_FILES['f']))
{
	header('HTTP/1.1 500 Internal Server Error');
	die('Something wrong with upload! Is "upload_max_filesize" set correctly?');
}
foreach ($_FILES['f']['name'] as $f => $name){
	if($_FILES["f"]["error"][$f] == UPLOAD_ERR_OK)
	{
		$uploadDirectory    = 'data/'; //specify upload directory ends with / (slash)

		//Is file size is less than allowed size.
		if ($_FILES["f"]["size"][$f] > 52428800)
		{
			header('HTTP/1.1 422 Unprocessable Entity');
			die("File size is too big!");
		}

		//allowed file type Server side check
		$finfo = finfo_open(FILEINFO_MIME_TYPE);
		if(strtolower($_FILES['f']['type'][$f]) != 'audio/mpeg' ||
			finfo_file($finfo, $_FILES['f']['tmp_name'][$f]) != 'audio/mpeg')
		{
			header('HTTP/1.1 400 Bad Request');
			die('Unsupported File!'); //output error
		}

		$extension = 'mp3';
		$id        = uniqid();
		$filename  = "$id.$extension"; //new file name

		if(move_uploaded_file($_FILES['f']['tmp_name'][$f], $uploadDirectory.$filename ))
		{
			process($id);
		}else{
			header('HTTP/1.1 500 Internal Server Error');
			die('error uploading File!');
		}

	}
	else
	{
		header('HTTP/1.1 500 Internal Server Error');
		die('Something wrong with upload! Is "upload_max_filesize" set correctly?');
	}
}
