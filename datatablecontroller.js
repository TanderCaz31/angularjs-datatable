app.controller("DatatableController", function ($scope) {

    $scope.sorting = " ORDER BY id ASC"; // default

    // Proprietà per la paginazione
    $scope.rows_per_page = 5; // default
    $scope.current_page = 1;

    // Raccoglimento dei nomi delle città
    fetch("database/fetch_citynames.php").then(async (response) => {
        $scope.cityNames = await response.json();
        $scope.$apply();
    });

    $scope.submitSearch = () => {
        $scope.current_page = 1;
        $scope.updateTable();
    }

    // Prende e mostra a schermo la tabella dei nominativi ordinata
    $scope.updateTable = async () => {

        const searchParams = {
            nome: $scope.nome,
            cognome: $scope.cognome,
            data_nascita: $scope.data_nascita,
            id_citta: $scope.id_citta,
            email: $scope.email
        };

        await fetch("database/fetch_nom.php", {
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


        await $scope.handlePagination();

        $scope.$apply();
    }

    $scope.updateTable();

    // Funzioni per la paginazione
    $scope.handlePagination = () => {
        $scope.total_pages = Math.ceil($scope.total_rows / $scope.rows_per_page);

        // Aggiornamento delle classi di ogni bottone nella paginazione
        // Freccie ai lati << >>
        $scope.paginationLeftArrowClass = $scope.current_page === 1 ? 'disabled' : '';
        $scope.paginationRightArrowClass = $scope.current_page >= $scope.total_pages ? 'disabled' : '';

        // Prima e ultima pagina
        $scope.paginationPageOneClass = $scope.current_page === 1 ? 'active' : '';
        $scope.paginationLastPageClass = $scope.total_pages <= 1 ? 'd-none' : ($scope.current_page === $scope.total_pages ? 'active' : '');

        // Precedente e prossima pagina
        $scope.paginationPreviousPageClass = $scope.current_page - 1 < 2 ? 'd-none' : '';
        $scope.paginationNextPageClass = $scope.current_page + 1 >= $scope.total_pages ? 'd-none' : '';

        // I divider grigi (...)
        $scope.paginationLeftDividerClass = $scope.current_page < 4 ? 'd-none' : '';
        $scope.paginationRightDividerClass = $scope.current_page + 2 >= $scope.total_pages ? 'd-none' : '';

        // Pagina attuale
        $scope.paginationCurrentPageClass = [1, $scope.total_pages].includes($scope.current_page) ? 'd-none' : 'active';
    }

    $scope.firstPage = () => {
        $scope.current_page = 1;
        $scope.updateTable();
    }

    $scope.lastPage = () => {
        $scope.current_page = $scope.total_pages;
        $scope.updateTable();
    }

    $scope.prevPage = () => {
        if ($scope.current_page >= 2) {
            $scope.current_page = $scope.current_page - 1;
            $scope.updateTable();
        }
    }

    $scope.nextPage = () => {
        if ($scope.current_page !== $scope.total_pages) {
            $scope.current_page = $scope.current_page + 1;
            $scope.updateTable();
        }
    }

    $scope.updateRowAmount = () => {
        const newAmount = document.getElementById("rows_per_page").value;

        if (newAmount && $scope.rows_per_page !== newAmount) {
            $scope.rows_per_page = newAmount;
            $scope.current_page = 1;
            $scope.updateTable();
        }
    }

    // Quando viene cliccata una colonna, $scope.sorting viene aggiornato per riflettere il cambiamento
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
        if (confirm(`Sei sicuro di voler eliminare il record con id ${id}?`)) {
            $scope.dbDelete(id);
        }
    }

    $scope.dbDelete = async (id) => {
        await fetch("database/delete_user.php", {
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
        const age = moment().diff(moment(data_nascita), "year");
        alert(`Questo utente ha ${age} anni.`);
    }

    // Funzioni della switch CitySwitch
    $scope.updateSwitchSelection = () => {
        $scope.citySwitch = document.getElementById("CitySwitch").checked;
    }

    $scope.findMatchingCityName = (id_citta) => {
        for (let city of $scope.cityNames) {
            if (city.id === id_citta)
                return city.nome;
        }
    }
});