<?php

error_reporting(0); // Per escludere gli errori dall'echo

if (isset($_POST)) {
    $user = file_get_contents("php://input");

    $user = json_decode($user);
} else {
    echo "Il database non ha ricevuto bene la risposta";
    return;
}

include("properties.php");
include("sanitize_user.php");

$user = validateInput($user);

$stmt = $conn->prepare("INSERT INTO nominativi (nome, cognome, data_nascita, id_citta, email) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $user->nome, $user->cognome, $user->data_nascita, $user->id_citta, $user->email);

$stmt->execute();

echo 1;