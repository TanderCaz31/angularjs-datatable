<?php
error_reporting(0); // Per escludere gli errori dall'echo

// Prendiamo i dati mandati dal fetch
if (isset($_POST)) {
    $post_input = file_get_contents("php://input");

    $in = json_decode($post_input);

    $user = $in->user;
} else {
    echo "PHP non ha ricevuto una POST!";
    return;
}

include("properties.php"); // Connessione al database
include("sanitize_user.php");

$query = "SELECT * FROM nominativi";
$user = sanitizeInput($user);
$query = addCondition($user, $query);

// Calcolo delle righe nella query base, per la paginazione
$sql = $conn->prepare($query);
$sql->execute();
$num_rows = $sql->get_result()->num_rows;

// Aggiunta del sorting indicato dall'utente
$query .= $in->sorting;

// Aggiunta della paginazione
$offset = ($in->pageoffset - 1) * $in->pagelimit;
$query .= " LIMIT $in->pagelimit OFFSET $offset";

$sql = $conn->prepare($query);
$sql->execute();
$result = $sql->get_result();

if ($result) {
    $outp = [
        $result->fetch_all(MYSQLI_ASSOC),
        $num_rows
    ];

    echo json_encode($outp);
} else {
    echo json_encode([]);
}

function addCondition($user, $query)
{
    if ($user->nome && strlen($user->nome) >= 1) {
        return $query . " WHERE nome LIKE '%$user->nome%'";
    } else if ($user->cognome && strlen($user->cognome) >= 1) {
        return $query . " WHERE cognome LIKE '%$user->cognome%'";
    } else if ($user->email && strlen($user->email) >= 1) {
        return $query . " WHERE email LIKE '%$user->email%'";
    } else if ($user->data_nascita && strlen($user->data_nascita) >= 1) {
        return $query . " WHERE data_nascita = '$user->data_nascita'";
    } else if ($user->id_citta && $user->id_citta >= 1) {
        return $query . " WHERE id_citta = $user->id_citta";
    } else {
        return $query;
    }
}
