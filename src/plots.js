const TIMEOUT = 2000

const params = new URLSearchParams(document.location.search);
const token = params.get("token");

console.log(token)
const statusUrl = 'http://localhost:8080/api/status/'


function session(token) {
    console.log('session()')
    setTimeout(() => {
        let responseData = {}
        fetch(statusUrl + token)
            .then(response => response.json())
            .then(data => responseData = data)

        if (responseData.status == "done") {
            console.log(responseData, "ZAMIEN TEN CONSOLELOG NA PRZEKIEROWANIE DO SYMULACJI ALBO WYŚWIETLENIE GUZIKA")
        } else {
            console.log(responseData, "ZAMIEN TEN CONSOLE LOG NA AKTUALIZACJE WYKRESU")
            session(token)
        }

    }, TIMEOUT)
}
session(token)