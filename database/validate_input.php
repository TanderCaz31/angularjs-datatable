<?php

function validateInput($user, $conn) {
    // Validazione del nome
    if (strlen($user->nome) > 30) {
        return throwErr("Inserisci un nome di massimo 30 caratteri.");
    } else if (strlen($user->nome) < 3) {
        return throwErr("Inserisci un nome di almeno tre caratteri.");
    }

    // Validazione del cognome
    if (strlen($user->cognome) > 30) {
        return throwErr("Inserisci un cognome di massimo 30 caratteri.");
    } else if (strlen($user->cognome) < 3) {
        return throwErr("Inserisci un cognome di almeno tre caratteri.");
    }

    // Validazione della data di nascita
    if (!str_contains($user->data_nascita, "-")) {
        return throwErr("Inserisci una data valida.");
    }

    // Validazione dell'id della città
    if (
        !is_numeric($user->id_citta)
        || $user->id_citta < 0
    ) {
        return throwErr("Inserisci un id città valido.");
    }

    // Validazione dell'email
    if (
        !str_contains($user->email, "@")
        || !str_contains($user->email, ".")
    ) {
        return throwErr("Inserisci una email valida.");
    }

    return $user;
}

function throwErr($message) {
    echo $message;
    return null;
}