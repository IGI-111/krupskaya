<?php
function process($id)
{
	//the file has just been moved into data
	$document->id = $id;
	//convert it to wav and process wav2json
	system("sox data/$id.mp3 -c 2 -t wav /tmp/$id.wav");
	system("wav2json /tmp/$id.wav -o /tmp/$id.json 2> /dev/null");
	$document->wave = json_decode(file_get_contents("/tmp/$id.json"));
	unlink("/tmp/$id.json");
	unlink("/tmp/$id.wav");
	//get mp3 metadata
	$document->tag = (object) id3_get_tag("data/$id.mp3");
	//add it to the MongoDB
	$m = new MongoClient();
	$db = $m->krupskaya;
	$collection = $db->songs;
	$collection->insert((array)$document);
}

