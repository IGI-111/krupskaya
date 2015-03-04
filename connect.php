<?php
session_start();
if($_POST['login'] == 'root' && $_POST['password'] == 'toor')
	$_SESSION['connected'] = true;
else
	header('HTTP/1.0 403 Forbidden');
