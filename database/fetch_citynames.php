<?php

include("dbconn.php");

$sql = $conn->prepare("SELECT nome, id FROM citta");

$sql->execute();
$result = $sql->get_result();

if ($result) {
    $outp = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($outp);
} else {
    echo json_encode([]);
}
