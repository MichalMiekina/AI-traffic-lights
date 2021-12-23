const TIMEOUT = 2000

const params = new URLSearchParams(document.location.search);
const token = params.get("token");

console.log(token)
const statusUrl = 'http://localhost:8080/api/status/'


function handleStatusUpdate(response) {
    if (response.status == "running") {
        console.log(response, "ZAMIEN TEN CONSOLE LOG NA AKTUALIZACJE WYKRESU")
        session(token)
    }
    if (response.status == "done") {
        console.log(response, "ZAMIEN TEN CONSOLELOG NA PRZEKIEROWANIE DO SYMULACJI ALBO WYŚWIETLENIE GUZIKA")
    } else {
        session(token)
    }
}


function session(token) {
    setTimeout(() => {
        fetch(statusUrl + token)
            .then(response => response.json())
            .then(handleStatusUpdate)
    }, TIMEOUT)
}
session(token)