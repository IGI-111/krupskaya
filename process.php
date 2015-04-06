<?php
require_once('getid3/getid3.php');

function process($originalFilename, $uploadDirectory, $id)
{
    system('sox '.escapeshellarg("/tmp/$originalFilename").' '.$uploadDirectory.$id.'.ogg', $returnVar);
    system('sox '.escapeshellarg("/tmp/$originalFilename").' '.$uploadDirectory.$id.'.mp3', $returnVar);
    if($returnVar)
        die;
    //the file has just been copied into data
    $document['_id'] = $id;
    $document['username'] = $_SESSION['username'];
    $document['public'] = "on" == $_POST['public'];
    //convert it to wav and process wav2json
    system("sox data/$id.ogg -c 2 -t wav /tmp/$id.wav");
    system("wav2json /tmp/$id.wav -o /tmp/$id.json 2> /dev/null");
    $document['wave'] = json_decode(file_get_contents("/tmp/$id.json"));
    unlink("/tmp/$id.json");
    unlink("/tmp/$id.wav");

    //get ogg metadata
    $getID3 = new getID3;
    $getid3['encoding'] = 'UTF-8';
    // Analyze file and store returned data in $ThisFileInfo
    $fileInfo = $getID3->analyze("/tmp/$originalFilename");
    getid3_lib::CopyTagsToComments($fileInfo);

    $addTagIfExists = function(&$fileInfo, &$document, $tagName, $nameInDocument = null)
    {
        if($nameInDocument == null)
            $nameInDocument = $tagName;
        if(array_key_exists($tagName, $fileInfo['comments_html']))
            $document[$nameInDocument] = (string)$fileInfo['comments_html'][$tagName][0];
    };

    $addTagIfExists($fileInfo, $document, 'title');
    $addTagIfExists($fileInfo, $document, 'artist');
    $addTagIfExists($fileInfo, $document, 'album');
    $addTagIfExists($fileInfo, $document, 'year');
    $addTagIfExists($fileInfo, $document, 'track_number', 'track');
    unlink("/tmp/$originalFilename");

    //add it to the MongoDB
    $m = new MongoClient();
    $db = $m->krupskaya;
    $collection = $db->songs;
    $collection->insert($document);
}
