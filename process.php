<?php
function process($id)
{
	//the file has just been moved into data
	$document->_id = $id;
	//convert it to wav and process wav2json
	system("sox data/$id.mp3 -c 2 -t wav /tmp/$id.wav");
	system("wav2json /tmp/$id.wav -o /tmp/$id.json 2> /dev/null");
	$document->wave = json_decode(file_get_contents("/tmp/$id.json"));
	unlink("/tmp/$id.json");
	unlink("/tmp/$id.wav");

	//get mp3 metadata
	require_once('getid3/getid3.php');
	$getID3 = new getID3;
	$getid3->encoding = 'UTF-8';
	// Analyze file and store returned data in $ThisFileInfo
	$fileInfo = $getID3->analyze("data/$id.mp3");
	getid3_lib::CopyTagsToComments($fileInfo);
	$document->album = $fileInfo['comments_html']['album'][0];
	$document->artist = $fileInfo['comments_html']['artist'][0];
	$document->title = $fileInfo['comments_html']['title'][0];

	//add it to the MongoDB
	$m = new MongoClient();
	$db = $m->krupskaya;
	$collection = $db->songs;
	$collection->insert((array)$document);
}

