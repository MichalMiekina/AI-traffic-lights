import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildMap } from './Terrain'



const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('canvas.gallery')

const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

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
var map
document.getElementById("api-get").addEventListener(
    'click',
    function () {
        console.log("GET")
        fetch(apiUrl + "list-worlds")
            .then(response => response.json())
            // .then(data => console.log(data))
            // .then(data => map)
            .then(data =>map = data[0])
            .then(data => buildMap(scene))


        console.log(map)
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