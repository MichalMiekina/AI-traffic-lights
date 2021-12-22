const params = new URLSearchParams(document.location.search);
const token = params.get("token");

console.log(token)
const apiUrl = 'http://localhost:8080/api/'
fetch(apiUrl + "status/"+token)
    .then(response => response.json())
    .then(data => console.log(data))