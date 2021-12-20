// import './style.css'



const apiUrl = 'http://localhost:8080/api/'
const data = {
    "minInitGreenlightLen": 0,
    "maxInitGreenlightLen": 70,
    "singleLightBias": 6,
    "allLightsBias": 3,
    "numWorlds": 10,
    "numPersistingWorlds": 4,
    "numEpochs": 15,
    "worldName": "miejskie, duze skrzyzowanie"
}
var token = ''

document.getElementById("api-get").addEventListener(
    'click',
    function () {
        console.log("GET")
        fetch(apiUrl + "list-worlds")
            .then(response => response.json())
            .then(data => console.log(data))
    }
)

document.getElementById("api-post").addEventListener(
    'click',
    function () {
        console.log("POST")
        fetch(apiUrl + "learn", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
              },
        })
            .then(response => response.json())
            .then(data =>token = data.token)
            .then(_ => console.log(token))
    }
)