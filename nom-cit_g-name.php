<?php
include("properties.php"); // Connessione al database

// Fetch e ritorno dei nominativi che iniziano con G, integrando anche i dati della tabella città
$sql = $conn->prepare("
        SELECT nom.id AS id, nom.nome AS nome, nom.cognome AS cognome, nom.data_nascita AS data_nascita, cit.nome AS id_citta, nom.email AS email
        FROM nominativi nom INNER JOIN citta cit ON nom.id_citta = cit.id
        WHERE nom.nome LIKE 'G%'");

$sql->execute();
$result = $sql->get_result();

if ($result) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($outp);
} else {
    echo json_encode([]);
}
