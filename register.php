<?php
session_start();
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->users;

if(!(isset($_POST['username']) && isset($_POST['password'])))
{
	header('HTTP/1.1 500 Internal Server Error');
	die;
}
// check that username isn't already taken
if($collection->findOne(array('username' => $_POST['username'])) != NULL)
{
	header('HTTP/1.1 422 Unprocessable Entity');
	exit;
}

$document = array(
	'username' => (string)$_POST['username'],
	'hash' => hash('whirlpool', $_POST['password'])
);

$collection->insert($document);
