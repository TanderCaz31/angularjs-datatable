<?php

if (!isset($_POST)) {
    echo "PHP non ha ricevuto una POST!";
    return;
}

$user_id = file_get_contents("php://input");
$user_id = json_decode($user_id);

include("dbconn.php");

$sql = $conn->prepare("DELETE FROM nominativi WHERE id = ?");
$sql->bind_param("i", $user_id);

$sql->execute();
