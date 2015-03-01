<?php
session_start();
header('Content-Type: application/json');
echo json_encode(isset($_SESSION['connected']) && $_SESSION['connected']);

