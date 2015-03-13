<?php

function process($originalFilename, $uploadDirectory, $id)
{
	system('sox '.escapeshellarg("/tmp/$originalFilename").' '.$uploadDirectory.$id.'.ogg');
	//the file has just been copied into data
	$document->_id = $id;
	//convert it to wav and process wav2json
	system("sox data/$id.ogg -c 2 -t wav /tmp/$id.wav");
	system("wav2json /tmp/$id.wav -o /tmp/$id.json 2> /dev/null");
	$document->wave = json_decode(file_get_contents("/tmp/$id.json"));
	unlink("/tmp/$id.json");
	unlink("/tmp/$id.wav");

	//get ogg metadata
	require_once('getid3/getid3.php');
	$getID3 = new getID3;
	$getid3->encoding = 'UTF-8';
	// Analyze file and store returned data in $ThisFileInfo
	$fileInfo = $getID3->analyze("/tmp/$originalFilename");
	getid3_lib::CopyTagsToComments($fileInfo);

	var_dump($fileInfo);
	if(array_key_exists('title', $fileInfo['comments_html']))
		$document->title = $fileInfo['comments_html']['title'][0];
	if(array_key_exists('artist', $fileInfo['comments_html']))
		$document->artist = $fileInfo['comments_html']['artist'][0];
	if(array_key_exists('album', $fileInfo['comments_html']))
		$document->album = $fileInfo['comments_html']['album'][0];
	if(array_key_exists('year', $fileInfo['comments_html']))
		$document->year = $fileInfo['comments_html']['year'][0];
	if(array_key_exists('track_number', $fileInfo['comments_html']))
		$document->track = $fileInfo['comments_html']['track_number'][0];
	unlink("/tmp/$originalFilename");

	//add it to the MongoDB
	$m = new MongoClient();
	$db = $m->krupskaya;
	$collection = $db->songs;
	$collection->insert((array)$document);
}

