app.controller("RegisterController", async ($scope) => {
    const resultText = document.getElementById("result-text");

    // Raccoglimento dei nomi delle città
    fetch("fetch_citynames.php").then(async (response) => {
      $scope.cityNames = await response.json();
    })

    
    $scope.submitHandler = () => {
        // Se ci sono campi vuoti dai errore
        if (!($scope.nome?.trim() && $scope.cognome?.trim() && $scope.data_nascita && $scope.id_citta?.trim() && $scope.email?.trim())) {
            $scope.showAlert({ text: "Non hai inserito tutte le informazioni.", type: "danger" });
            return;
        }

        // Validazione email
        if (!$scope.email?.includes("@") || !$scope.email?.includes(".")) {
            $scope.showAlert({ text: "Inserisci una email valida.", type: "danger" });
            return;
        }

        const inputUser = {
            nome: $scope.nome,
            cognome: $scope.cognome,
            data_nascita: $scope.data_nascita,
            id_citta: $scope.id_citta,
            email: $scope.email
        }

        // Richiesta POST per aggiungere l'utente al database
        fetch("add-user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(inputUser)
        })
            .then(async (response) => {
                const text = await response.text();

                if (Number(text) === 1) { // php ritorna solo "1" se è andato bene, altrimenti ritorna un messaggio di errore
                    $scope.showAlert({ text: "Utente aggiunto con successo!", type: "success" });
                } else {
                    $scope.showAlert({ text: text, type: "danger" });
                }
            })
    }

    // Visualizzazione messaggi
    $scope.delay = async (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    $scope.showAlert = async (message) => {
        const messageClass = (() => {
            switch (message.type) {
                case "success":
                    return "text-success";
                case "danger":
                    return "text-danger";
                default:
                    return "";
            }
        })();

        resultText.classList.add(messageClass);
        resultText.innerText = message.text;

        await $scope.delay(5000);
        // Resetta le classi
        resultText.classList.remove(messageClass);
        resultText.innerText = "";
    }
});

//ng-repeat="person in people"
//ng-class="{red: isRed == true}" (gives red class if $scope.isRed is true)