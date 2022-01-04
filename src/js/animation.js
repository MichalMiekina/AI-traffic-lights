import '../css/three.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import World from './Terrain'

const scene = new THREE.Scene()
const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const worldName = params.get("world")

const apiUrl = 'http://localhost:8080/api/'
function getMap() {
    return fetch(`${apiUrl}world/${worldName}`)
        .then(response => response.json())

}
function getPlot() {
    return fetch(`${apiUrl}status/${token}`)
        .then(response => response.json())
}

function getMapAndPlot() {
    return Promise.all([getMap(), getPlot()])
}

function main(map, plot) {
    console.log(map)
    console.log(plot)
    const map_rows = map.nodes.length
    const map_columns = map.nodes[0].length

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const canvas = document.querySelector('canvas.webgl')
    const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    scene.add(camera)
    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enabled = false
    controls.target = new THREE.Vector3(map_columns, map_rows / 2, 0);
    camera.position.x = map_columns
    camera.position.y = map_rows / 2
    camera.rotation.y = Math.PI / 2
    camera.position.z = map_columns

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    const worldL = new World(scene, map_columns, map_rows, map, plot.before, 0)
    const worldR = new World(scene, map_columns, map_rows, map, plot.after, map_columns + 1)

    buildTicks(scene, controls, renderer, camera, plot, worldL, worldR)
}



function buildTicks(scene, controls, renderer, camera, plot, worldL, worldR) {

    let simElapsedTime = 0
    const pointLight = new THREE.DirectionalLight(0xffffff, .8)
    pointLight.position.x = 0
    pointLight.position.y = 0
    pointLight.position.z = 10
    scene.add(pointLight)
    scene.background = new THREE.Color(0x555555)

    const clock = new THREE.Clock()


    let time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
    let prevElapsedTime = 0
    let frame_index = 0

    const steps_amount = plot.before.steps.length

    document.getElementById("part_change_slider").addEventListener(
        'input',
        function () {
            simElapsedTime = (document.getElementById("part_change_slider").value / 100) * steps_amount
        }
    )

    document.getElementById("speed_change_slider").addEventListener(
        'input',
        function () {
            document.getElementById("speed_value").textContent = document.getElementById("speed_change_slider").value
        }
    )

    document.getElementById("default_speed_button").addEventListener(
        'click',
        function () {
            document.getElementById("speed_change_slider").value = 1
            document.getElementById("speed_value").textContent = document.getElementById("speed_change_slider").value
        }
    )

    const tick = () => {
        const { before, after } = plot
        const elapsedTime = clock.getElapsedTime()
        simElapsedTime += (elapsedTime - prevElapsedTime) * time_speed
        time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
        prevElapsedTime = elapsedTime

        frame_index = Math.floor(simElapsedTime)
        const previousStep = frame_index > 0 ? frame_index - 1 : 0
        const partPercentage = (frame_index / steps_amount * 100).toFixed(1)

        document.getElementById("part_value").textContent = partPercentage
        document.getElementById("part_change_slider").value = (frame_index / steps_amount * 100).toFixed(1)

    
        if(frame_index<steps_amount){
            worldL.updateWorld(before.steps[previousStep], before.steps[frame_index], before.steps[frame_index + 1], simElapsedTime)
            worldR.updateWorld(after.steps[previousStep], after.steps[frame_index], after.steps[frame_index + 1], simElapsedTime)
        }
        else{
            document.getElementById("s1").getElementsByTagName("input")[0].value = 0
            document.getElementById("part_value").textContent = 100
            document.getElementById("speed_value").textContent = document.getElementById("speed_change_slider").value
        }
        

        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }
    tick()
}

getMapAndPlot()
    .then(([map, plot]) => main(map, plot))