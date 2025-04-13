<?php

error_reporting(0); // Per escludere gli errori dall'echo

if (!isset($_POST)) {
    echo "Il database non ha ricevuto bene la risposta";
    return;
}

$user = file_get_contents("php://input");
$user = json_decode($user);

include("dbconn.php");
include("validate_input.php");

$user = validateInput($user, $conn);

$stmt = $conn->prepare("INSERT INTO nominativi (nome, cognome, data_nascita, id_citta, email) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $user->nome, $user->cognome, $user->data_nascita, $user->id_citta, $user->email);

$stmt->execute();

echo 1;
