import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import json from './after.json';
import { map_columns, map_rows, frames_amount } from './constants'
import { Car, Vehicle } from './Car'
import { buildMap } from './Terrain'
import { buildLights } from './lights'

// import http from http

// const http = require('http')
const baseUrl = 'http://127.0.0.1:5000/'
document.getElementById("api").addEventListener(
    'click',
    function () {
        console.log("XD")
        fetch(baseUrl+"list-worlds")
        .then(response => response)
        .then(data => console.log(data))
    }
)

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

document.getElementById("part_change_slider").addEventListener(
    'input',
    function () {
        simElapsedTime = (document.getElementById("part_change_slider").value / 100) * frames_amount
    }
)

document.getElementById("default_part_button").addEventListener(
    'click',
    function () {
        // TODO nice to have
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

const test_object1 = Car()
document.getElementById("dev-button").addEventListener(
    'click',
    function () {
        camera.position.x = 2
        camera.position.y = 2
        camera.position.z = 2
        scene.add(new THREE.GridHelper(10, 10));

        // Objects

        scene.add(test_object1)
        // test_car.rotation.x = 0
        test_object1.position.x = 0
        test_object1.rotation.x = Math.PI * 2
        // test_car.position.y = 7.5
        console.log(test_object1.position.x, test_object1.position.y, test_object1.position.z)
    }
)
document.getElementById("uat-button").addEventListener(
    'click',
    function () {
        controls.target = new THREE.Vector3(map_columns / 2, map_rows / 2, 0);
        camera.position.x = map_columns / 2
        camera.position.y = map_rows / 2
        camera.rotation.y = Math.PI / 2
        camera.position.z = 10
        buildMap(scene)
        tick()
        // buildLights(scene)
    }
)
document.getElementById("prod-button").addEventListener(
    'click',
    function () {
        console.log('DEV')
    }
)


// Scene
const scene = new THREE.Scene()
const pointLight = new THREE.DirectionalLight(0xffffff, .9)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
scene.background = new THREE.Color(0x333333)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Debug
const gui = new dat.GUI()
// Canvas
const canvas = document.querySelector('canvas.webgl')


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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()

var vehicles_list = []
var vehicles_ids_list = []

var simElapsedTime = 0
var time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
var prevElapsedTime = 0
var frame_index = 0
var traffic_lights = buildLights(scene)
const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    simElapsedTime += (elapsedTime - prevElapsedTime) * time_speed
    time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
    prevElapsedTime = elapsedTime

    frame_index = Math.floor(simElapsedTime)

    document.getElementById("part_value").textContent = (frame_index / frames_amount * 100).toFixed(1)

    let current_cars = []

    for (let i = 0; i < json.steps[frame_index].cars.length; i++) {
        if (!vehicles_ids_list.includes(json.steps[frame_index].cars[i].id)) {
            vehicles_list.push(new Vehicle(json.steps[frame_index].cars[i].id, Car()))
            // console.log(vehicles_list.at(-1).)
            vehicles_ids_list.push(json.steps[frame_index].cars[i].id)
            scene.add(vehicles_list.at(-1).vehicle_object)
            vehicles_list.at(-1).vehicle_object.position.x = json.steps[frame_index].cars[i].x
            vehicles_list.at(-1).vehicle_object.position.y = json.steps[frame_index].cars[i].y
        }
        current_cars.push(json.steps[frame_index].cars[i].id)
    }

    for (let i = 0; i < vehicles_list.length; i++) {
        if (!current_cars.includes(vehicles_list[i].id)) {
            scene.remove(vehicles_list[i].vehicle_object)

        }
    }

    for (let i = 0; i < traffic_lights.length; i++) {
        if (json.steps[frame_index].lights[i].color == "green") {
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        }
        if (json.steps[frame_index].lights[i].color == "red") {
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0xff0000 })
        }
        if (json.steps[frame_index].lights[i].color == "amber") {
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0xffa500 })
        }
    }


    for (let i = 0; i < vehicles_list.length; i++) {
        for (let j = 0; j < json.steps[frame_index].cars.length; j++) {
            if (vehicles_list[i].id == json.steps[frame_index].cars[j].id) {

                for (let k = 0; k < json.steps[frame_index + 1].cars.length; k++) {
                    if (vehicles_list[i].id == json.steps[frame_index + 1].cars[k].id) {

                        vehicles_list[i].vehicle_object.position.x = json.steps[frame_index].cars[j].x + (json.steps[frame_index + 1].cars[k].x - json.steps[frame_index].cars[j].x) * ((simElapsedTime) % 1)
                        vehicles_list[i].vehicle_object.position.y = (map_rows - json.steps[frame_index].cars[j].y) + ((map_rows - json.steps[frame_index + 1].cars[k].y) - (map_rows - json.steps[frame_index].cars[j].y)) * ((simElapsedTime) % 1)

                        let diff_x = json.steps[frame_index + 1].cars[k].x - json.steps[frame_index].cars[j].x
                        let diff_y = json.steps[frame_index + 1].cars[k].y - json.steps[frame_index].cars[j].y

                        if (diff_x < 0 && diff_y == 0) {
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * (3 / 2)
                        }
                        if (diff_x > 0 && diff_y == 0) {
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * (1 / 2)
                        }
                        if (diff_x == 0 && diff_y < 0) {
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * 0
                        }
                        if (diff_x == 0 && diff_y > 0) {
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * 1
                        }
                    }
                }
            }
        }
    }

    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

