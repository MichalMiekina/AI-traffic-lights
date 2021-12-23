import './css/index.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildMap } from './Terrain'
import * as dat from 'dat.gui'
// hide canvas generating gallery images
document.getElementById('c').style.display = 'none'

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
        // document.body.appendChild(img)
        document.getElementById('gallery-container').appendChild(img)
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
    // for (let i = 0; i < controls.length; i++) {
    //     controls[i].update()
    //     renderers[i].render(scene, camera)
    // }
    controls.update()
    renderer.render(scene, camera)
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

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
        fetch(apiUrl + "list-worlds")
            .then(response => response.json())
            .then(data => drawMaps(data))
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
            .then(data => token = data.token)
            // .then(_ => console.log(token))
            .then(token => window.location.replace('http://localhost:8080/plots?token='+token))
    }
)