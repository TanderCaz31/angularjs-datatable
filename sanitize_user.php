<?php

function validateInput($user) {
    // validazione del nome
    if (strlen($user->nome) > 30) {
        return throwErr("Inserisci un nome di massimo 30 caratteri.");
    } else if (strlen($user->nome) < 3) {
        return throwErr("Inserisci un nome di almeno tre caratteri.");
    }

    // validazione del cognome
    if (strlen($user->cognome) > 30) {
        return throwErr("Inserisci un cognome di massimo 30 caratteri.");
    } else if (strlen($user->cognome) < 3) {
        return throwErr("Inserisci un cognome di almeno tre caratteri.");
    }

    // validazione della data di nascita
    if (!str_contains($user->data_nascita, "-")) {
        return throwErr("Inserisci una data valida.");
    }

    // validazione dell'id della città
    if (
        !is_numeric($user->id_citta)
        || $user->id_citta < 0
    ) {
        return throwErr("Inserisci un id città valido.");
    }

    // validazione dell'email
    if (
        !str_contains($user->email, "@")
        || !str_contains($user->email, ".")
    ) {
        return throwErr("Inserisci una email valida.");
    }

    return sanitizeInput($user);
}


function throwErr($message) {
    echo $message;
    return null;
}

function sanitizeInput($user) {
    $user->nome = htmlspecialchars($user->nome);
    $user->cognome = htmlspecialchars($user->cognome);
    $user->data_nascita = htmlspecialchars($user->data_nascita);
    $user->id_citta = htmlspecialchars($user->id_citta);
    $user->email = htmlspecialchars($user->email);

    return $user;
}