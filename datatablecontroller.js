app.controller("DatatableController", async ($scope) => {

    $scope.sorting = " ORDER BY id ASC"; // default

    // Proprietà per la paginazione
    $scope.rows_per_page = 5; // default
    $scope.current_page = 1;
    //total_rows;
    //total_pages;

    // Raccoglimento dei nomi delle città
    await fetch("fetch_citynames.php").then(async (response) => {
        $scope.cityNames = await response.json();
    })

    // Prende e mostra a schermo la tabella dei nominativi ordinata
    $scope.updateTable = async () => {
        const searchParams = {
            nome: $scope.nome,
            cognome: $scope.cognome,
            data_nascita: $scope.data_nascita,
            id_citta: $scope.id_citta,
            email: $scope.email
        };

        await fetch("fetch_nom.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify({ user: searchParams, sorting: $scope.sorting, pagelimit: $scope.rows_per_page, pageoffset: $scope.current_page })
        })
            .then(async (response) => {
                const data = await response.json();

                $scope.tableRows = data[0];
                $scope.total_rows = data[1];
            })
        $scope.handlePagination();

        $scope.$apply();
    }

    $scope.updateTable();

    // Funzioni per la paginazione
    $scope.handlePagination = () => {
        $scope.total_pages = Math.ceil($scope.total_rows / $scope.rows_per_page);
    }

    $scope.updateRowAmount = () => {
        const newAmount = (document.getElementById("rows_per_page")).value;

        if (newAmount && $scope.rows_per_page !== newAmount) {
            $scope.rows_per_page = newAmount;
            $scope.current_page = 1;
            $scope.updateTable();
        }
    }

    // Quando viene cliccata una colonna, this.sorting viene aggiornato per riflettere il cambiamento
    $scope.sort = (column) => {
        if ($scope.sorting.includes(` ${column}`)) {

            $scope.sorting = $scope.sorting.slice(-3) == "ASC"
                ? ` ORDER BY ${column} DESC`
                : ` ORDER BY ${column} ASC`
        } else {
            $scope.sorting = ` ORDER BY ${column} ASC`;
        }

        $scope.updateTable();
    }

    // Domanda di conferma e cancellazione record
    $scope.promptDelete = (id) => {
        if (confirm(`Sei sicuro di voler eliminare il record con id ${id}?`))
            $scope.dbDelete(id);
    }

    $scope.dbDelete = async (id) => {
        await fetch("delete_user.php", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json;"
            },
            "body": JSON.stringify(id)
        });

        $scope.updateTable();
    }

    // Mostra età dell'utente quando si clicca una colonna
    $scope.showAge = (data_nascita) => {
        data_nascita = moment(data_nascita);
        const now = moment();

        const age = now.diff(data_nascita, "year");
        alert(`Questo utente ha ${age} anni.`);
    }

    // Funzioni della switch CitySwitch
    $scope.updateSwitchSelection = () => {
        const elem = document.getElementById("CitySwitch");
        $scope.citySwitch = elem.checked;
    }

    $scope.findMatchingCityName = (id_citta) => {
        for (let city of $scope.cityNames) {
            if (city.id === id_citta)
                return city.nome;
        }
    }
});

//ng-repeat="person in people"
//ng-class="{red: isRed == true}" (gives red class if $scope.isRed is true)