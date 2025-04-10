<?php

if (isset($_POST)) {
    $user_id = file_get_contents("php://input");

    $user_id = json_decode($user_id);
} else {
    echo "PHP non ha ricevuto una POST!";
    return;
}

include("properties.php");

$sql = $conn->prepare("DELETE FROM nominativi WHERE id = {$user_id}");

$sql->execute();
