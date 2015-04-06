<?php
session_start();
$m = new MongoClient();
$db = $m->krupskaya;
$collection = $db->users;
$user = $collection->findOne(array('username' => $_POST['login']));
if($user != null && hash('whirlpool', $_POST['password']) == $user['hash'])
{
    $_SESSION['connected'] = true;
    $_SESSION['username'] = $user['username'];
}
else
    header('HTTP/1.0 403 Forbidden');
