import '../css/plots.css'

var Plotly = require('plotly.js-dist-min')
//znajdz jak uzyc tego offline
const TIMEOUT = 1500
const UPPER_PLOT_RANGE = 1.5

const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const statusUrl = 'http://localhost:8080/api/status/'
document.getElementById('animate').style.display = 'none'
const plotDiv = document.getElementById("header")



function plot(plot){



    var a = {

        y: plot,
        mode: 'markers',
        name: "Względny koszt epoki",
    };
    
    var b = {
        y: plot,
        name: "Wygładzona krzywa uczenia",
        type: "scatter",
        mode: 'lines',
        line:{
        shape: "spline",
        smoothing: "1.3"
        }
    };


    var c = {
        y: [plot.at(0),plot.at(-1)],
        x: [0, plot.length -1],
        mode: 'scatter',
        name: "Ogólna tendecja",
        }
    
    var plotData = [a,b,c];
    
    let delta = ((plot.at(0)-plot.at(-1))*100).toFixed(1)

    var layout = {
        title: 'Krzywa uczenia ( ' + delta + "% spadek kosztu )",
        yaxis: {range: [0, UPPER_PLOT_RANGE]},
        yaxis2: { range: [0, UPPER_PLOT_RANGE]},
        yaxis3: { range: [0, UPPER_PLOT_RANGE]}
    };

    Plotly.newPlot('plot', plotData, layout);
}


function handleStatusUpdate(response) {
    if (response.status == "running") {
        plotDiv.textContent = 'Sesja w toku...'
        plot(response.plot)
        session(token)
    }
    else if (response.status == "done") {
        plot(response.plot)
        plotDiv.textContent = 'Sesja zakończona'
        document.getElementById('animate').style.display = 'block'
        document.getElementById('header').style.display = 'none'
    } else {
        plotDiv.textContent = 'Oczekiwanie na wyniki pierwszej epoki...'
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