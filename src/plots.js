var Plotly = require('plotly.js-dist-min')
//znajdz jak uzyc tego offline
const TIMEOUT = 1000

const params = new URLSearchParams(document.location.search);
const token = params.get("token");

console.log(token)
const statusUrl = 'http://localhost:8080/api/status/'
document.getElementById('animate').style.display = 'none'
const plotDiv = document.getElementById("header")


function plot(plot){



    var a = {

        y: plot,
        mode: 'markers',
        name: "relative cost of epoch",
    };
    
    var b = {
        y: plot,
        name: "smoothened learning curve",
        type: "scatter",
        mode: 'lines',
        line:{
        shape: "spline",
        smoothing: "1.3"
        }
    };
    
    var plotData = [a,b];
    
    var layout = {
        title: 'Learning Curve',
        yaxis: {range: [0, 1.1]},
        yaxis2: { range: [0, 1.1]}
    };

    Plotly.newPlot('plot', plotData, layout);
}


function handleStatusUpdate(response) {
    if (response.status == "running") {
        plotDiv.textContent = 'Running a session...'
        plot(response.plot)
        session(token)
    }
    else if (response.status == "done") {
        plot(response.plot)
        plotDiv.textContent = 'Session finished'
        document.getElementById('animate').style.display = 'block'
    } else {
        plotDiv.textContent = 'Waiting for first epoch to finish...'
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

document.getElementById("animate").addEventListener(
    'click',
    function () {
        window.location.href = 'http://localhost:8080/three?token=' + token+'&world='+params.get('world')
    }
)