import '../css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildWorldMesh } from './Terrain'

const apiUrl = `http://localhost:80/api/`

const spawnRateOnesSlider = document.getElementById('spawnRateOnesSlider')
const numWorldsSlider = document.getElementById('numWorlds')
const numPersistingWorldsSlider = document.getElementById('numPersistingWorlds')

const ones = document.getElementById('ones')

var token = ''

// hide canvas generating gallery images
document.getElementById('c').style.display = 'none'


const scene = new THREE.Scene()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(90, 1, 1, 100)
scene.add(camera)


const canvas = document.querySelector('canvas.gallery')
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    preserveDrawingBuffer: true,
    alpha: true
})
renderer.setClearColor(0xffffff, 1)
renderer.setSize(sizes.width / 3.5, sizes.width / 3.5)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const tick = () => {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}


updateSpawnRate()
updateNumPersistingWorlds()

function updateSpawnRate() {
    ones.getElementsByTagName('output')[0].textContent = spawnRateOnesSlider.value
}


function updateNumPersistingWorlds(){
    numPersistingWorldsSlider.max = Math.floor(numWorldsSlider.value/2)
    document.getElementById('persisting-worlds').getElementsByTagName('output')[0].textContent = numPersistingWorldsSlider.value
}

spawnRateOnesSlider.addEventListener('input',updateSpawnRate)

numWorldsSlider.addEventListener('input', updateNumPersistingWorlds)
document.getElementById("api-post").addEventListener(
    'click',
    function () {
        const input = buildInput()
        fetch(apiUrl + "learn", {
            method: 'POST',
            body: JSON.stringify(input),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => token = data.token)
            .then(token => window.location.href = `http://localhost:80/plots?token=${token}&world=${input.worldName}`)
    }
)

function drawMaps(data) {
    for (let i = 0; i < data.worlds.length; i++) {
        // removing previous map before building new one
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
        drawSingleMap(data.worlds[i], i)

        const img = document.createElement('img')
        img.src = renderer.domElement.toDataURL("image/png");
        img.id = data.worlds[i].name
        img.className = 'world-map'
        document.getElementById('gallery-container').appendChild(img)
    }
    const galleryMaps = document.getElementsByClassName('world-map')
    galleryMaps[1].classList.add('selected-map')

    for (let i = 0; i < galleryMaps.length; i++) {
        galleryMaps[i].addEventListener(
            'click',
            function () {
                for(let j = 0; j < galleryMaps.length;j++){
                    galleryMaps[j].classList.remove('selected-map')   
                }
                galleryMaps[i].classList.add('selected-map')
            }
        )
    }
}

function buildInput() {
    let input = {
        "worldName": document.getElementsByClassName('selected-map')[0].id,
        "minInitGreenlightLen": Number(document.getElementById('greenlightRange').value.split(" - ")[0]),
        "maxInitGreenlightLen": Number(document.getElementById('greenlightRange').value.split(" - ")[1]),
        "singleLightBias": Number(document.getElementById('singleLightBias').value),
        "allLightsBias": Number(document.getElementById('allLightsBias').value),
        "numWorlds": Number(document.getElementById('numWorlds').value),
        "numPersistingWorlds": Number(document.getElementById('numPersistingWorlds').value),
        "numEpochs": Number(document.getElementById('numEpochs').value),
        "spawnRate": Number(document.getElementById('spawnRate').value)
    }

    return input
}


function drawSingleMap(map) {
    const sideSize = map.nodes.length
    const pointLight = new THREE.DirectionalLight(0xffffff, .9)
    pointLight.position.x = sideSize/2
    pointLight.position.y = -1 * sideSize/2 
    pointLight.position.z = 20
    scene.add(pointLight)

    scene.add(buildWorldMesh(map))
    controls.target = new THREE.Vector3(map.nodes.length / 2, map.nodes[0].length / 2, 0);
    camera.position.x = map.nodes[0].length / 2
    camera.position.y = map.nodes.length / 2
    camera.rotation.y = Math.PI / 2
    camera.position.z = sideSize/2 +1

    tick()
}

fetch(apiUrl + "list-worlds")
    .then(response => response.json())
    .then(data => drawMaps(data))