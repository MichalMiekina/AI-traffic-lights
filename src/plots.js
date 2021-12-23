const plotly = require("plotly")
//znajdz jak uzyc tego offline
const TIMEOUT = 2000

const params = new URLSearchParams(document.location.search);
const token = params.get("token");

console.log(token)
const statusUrl = 'http://localhost:8080/api/status/'


function handleStatusUpdate(response) {
    if (response.status == "running") {
        var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
var layout = {fileopt : "overwrite", filename : "simple-node-example"};

/*plotly.plot(data, layout, function (err, msg) {
	if (err) return console.log(err);
	console.log(msg);
});*/
        console.log(response, "ZAMIEN TEN CONSOLE LOG NA AKTUALIZACJE WYKRESU")
        session(token)
    }
    else if (response.status == "done") {
        console.log(response, "ZAMIEN TEN CONSOLELOG NA PRZEKIEROWANIE DO SYMULACJI ALBO WYŚWIETLENIE GUZIKA")
    } else {
        console.log(response, "czekaj")
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