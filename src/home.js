import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildMap } from './Terrain'
import * as dat from 'dat.gui'


// hide canvas generating gallery images
document.getElementById('c').style.display = 'none'

function buildInput() {
    let input = {
        "worldName": document.getElementsByClassName('selected-map')[0].id,
        "minInitGreenlightLen": Number(document.getElementById('minInitGreenlightLen').value),
        "maxInitGreenlightLen": Number(document.getElementById('maxInitGreenlightLen').value),
        "singleLightBias": Number(document.getElementById('singleLightBias').value),
        "allLightsBias": Number(document.getElementById('allLightsBias').value),
        "numWorlds": Number(document.getElementById('numWorlds').value),
        "numPersistingWorlds": Number(document.getElementById('numPersistingWorlds').value),
        "numEpochs": Number(document.getElementById('numEpochs').value)
        
    }
    
    // input.worldName = document.getElementsByClassName('selected-map')[0].id
    // input.minInitGreenlightLen = Number(document.getElementById('minInitGreenlightLen').value)
    // input.maxInitGreenlightLen = Number(document.getElementById('maxInitGreenlightLen').value)
    // input.singleLightBias = Number(document.getElementById('singleLightBias').value)
    // input.allLightsBias = Number(document.getElementById('allLightsBias').value)
    // input.numWorlds = Number(document.getElementById('numWorlds').value)
    // input.numPersistingWorlds = Number(document.getElementById('numPersistingWorlds').value)
    // input.numEpochs = Number(document.getElementById('numEpochs').value)

    return input
}



function drawSingleMap(map, mapNumber) {
    const pointLight = new THREE.DirectionalLight(0xffffff, .9)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)
    scene.background = new THREE.Color(0xaaaaaa)

    buildMap(scene, map)
    controls.target = new THREE.Vector3(map.nodes.length / 2, map.nodes[0].length / 2, 0);
    camera.position.x = map.nodes[0].length / 2
    camera.position.y = map.nodes.length / 2
    camera.rotation.y = Math.PI / 2
    camera.position.z = 10

    tick()
}

function drawMaps(data) {
    for (let i = 0; i < data.worlds.length; i++) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        drawSingleMap(data.worlds[i], i)

        var img = document.createElement('img')
        img.src = renderer.domElement.toDataURL("image/jpeg");
        img.id = data.worlds[i].name
        img.className = 'world-map'
        document.getElementById('gallery-container').appendChild(img)
    }
    const galleryMaps = document.getElementsByClassName('world-map')

    for (let i = 0; i < galleryMaps.length; i++) {
        galleryMaps[i].addEventListener(
            'click',
            function () {
                for (let j = 0; j < galleryMaps.length; j++) {
                    galleryMaps[j].classList.remove('selected-map')
                }
                console.log(galleryMaps)
                galleryMaps[i].classList.add('selected-map')
            }
        )
    }
}
const gui = new dat.GUI()
const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
scene.add(camera)


const canvas = document.querySelector('canvas.gallery')
const controls = new OrbitControls(camera, canvas)

controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true
})
renderer.setSize(sizes.width / 4, sizes.height / 4)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

const apiUrl = 'http://localhost:8080/api/'

var token = ''
document.getElementById("api-get").addEventListener(
    'click',
    function () {
        fetch(apiUrl + "list-worlds")
            .then(response => response.json())
            .then(data => drawMaps(data))
    }
)

document.getElementById("api-post").addEventListener(
    'click',
    function () {
        let input = buildInput()
        console.log("POST: ")
        console.log(input)
        fetch(apiUrl + "learn", {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => token = data.token)
            .then(token => window.location.href = 'http://localhost:8080/plots?token=' + token+'&world='+input.worldName)
    }
)