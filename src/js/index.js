import '../css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildWorldMesh } from './Terrain'
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
        "numEpochs": Number(document.getElementById('numEpochs').value),
        "spawnRate": Number(document.getElementById('spawn-rate-sum').value)
    }

    return input
}


function drawSingleMap(map) {
    const pointLight = new THREE.DirectionalLight(0xffffff, .9)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)
    // scene.background = new THREE.Color(0xaaaaaa)
    // scene.background = new THREE.Color(0xffe4c4)

    scene.add(buildWorldMesh(map))
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
        img.src = renderer.domElement.toDataURL("image/png");
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
    preserveDrawingBuffer: true,
    alpha: true
})
renderer.setClearColor(0xffffff, 0)
renderer.setSize(sizes.width / 3.5, sizes.height / 3.5)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

const apiUrl = 'http://localhost:8080/api/'

var token = ''

document.getElementById("api-post").addEventListener(
    'click',
    function () {
        let input = buildInput()
        fetch(apiUrl + "learn", {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => token = data.token)
            .then(token => window.location.href = 'http://localhost:8080/plots?token=' + token + '&world=' + input.worldName)
    }
)
const spawnRateOnesSlider = document.getElementById('spawnRateOnesSlider')
const spawnRateFractionsSlider = document.getElementById('spawnRateFractionsSlider')
const numWorldsSlider = document.getElementById('numWorlds')
const numPersistingWorldsSlider = document.getElementById('numPersistingWorlds')

const ones = document.getElementById('ones')
const fractions = document.getElementById('fractions')

updateSpawnRate()
updateNumPersistingWorlds()

function updateSpawnRate() {
    ones.getElementsByTagName('output')[0].textContent = spawnRateOnesSlider.value
    fractions.getElementsByTagName('output')[0].textContent = spawnRateFractionsSlider.value
    document.getElementById('spawn-rate-sum').textContent = parseFloat(spawnRateOnesSlider.value) + parseFloat(spawnRateFractionsSlider.value)
}


function updateNumPersistingWorlds(){
    numPersistingWorldsSlider.max = Math.floor(numWorldsSlider.value/2)
    document.getElementById('persisting-worlds').getElementsByTagName('output')[0].textContent = numPersistingWorldsSlider.value
}

spawnRateOnesSlider.addEventListener('input',updateSpawnRate)
spawnRateFractionsSlider.addEventListener('input',updateSpawnRate)
numWorldsSlider.addEventListener('input', updateNumPersistingWorlds)

fetch(apiUrl + "list-worlds")
    .then(response => response.json())
    .then(data => drawMaps(data))