import './css/three.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { buildCarMesh, Vehicle } from './Car'
import { buildWorldMesh } from './Terrain'
import { buildLight, buildLights } from './lights'

const scene = new THREE.Scene()
const params = new URLSearchParams(document.location.search);
const token = params.get("token");
const worldName = params.get("world")
var simElapsedTime = 0

class Car {
    constructor(id, x, y) {
        this.id = id
        this.mesh = buildCarMesh(x, y)
    }
}

class Light {
    constructor(id, x ,y, shift){
        this.id = id
        this.mesh = buildLight()
        this.mesh.position.x = x + shift
        this.mesh.position.y = y
        this.mesh.position.z = 2
    }
}

class World {
    constructor(width, height, map, course, shift) {
        this.shift = shift
        this.width = width
        this.height = height
        this.cars = []
        this.lights = []
        for(let i=0;i<course.steps[0].lights.length;i++){
            let id = course.steps[0].lights[i].id
            console.log(id.split('-'), id.split('-')[0], id.split('-')[1])
            let x = parseFloat(id.split('-')[0]) + .5
            let y = this.height - parseFloat(id.split('-')[1]) - .5
            let light = new Light(id, x, y, this.shift)
            this.lights.push(light)
            scene.add(light.mesh)
            console.log(light.mesh)
        }
        
        this.map = buildWorldMesh(map)
        this.map.position.x += shift
        scene.add(this.map)
    }
    updateWorld(step0, step1) {
        this.updateCars(step0.cars, step1.cars)

    }
    updateLights(lights){
        
    }
    updateCars(cars0, cars1) {
        // removing cars that left the world
        let existingCarsID = cars0.map(a => a.id)
        for (let i = 0; i < this.cars.length; i++) {
            if (!existingCarsID.includes(this.cars[i].id)) {
                this.removeSingleCar(this.cars[i].id)
            }
        }

        // creating and moving cars
        for (let i = 0; i < cars0.length; i++) {
            this.updateSingleCar(cars0[i])
        }

        for (let i = 0; i < this.cars.length; i++) {
            if (cars0.map(a => a.id).includes(this.cars[i].id) && cars1.map(a => a.id).includes(this.cars[i].id)) {
                this.updateCarRotation(cars0, cars1, this.cars[i].id)
            }

        }
    }

    updateSingleCar({ id, x, y }) {
        let car = this.findCar(id)
        // create car if not exists
        if (!car) {
            car = new Car(id, x, y)
            this.cars.push(car)
            scene.add(car.mesh)
        }
        // set car position
        car.mesh.position.x = x + this.shift
        car.mesh.position.y = this.height - y
    }

    updateCarRotation(cars0, cars1, id) {
        let step0 = cars0.find(obj => obj.id == id)
        let step1 = cars1.find(obj => obj.id == id)

        let diff_x = step1.x - step0.x
        let diff_y = step1.y - step0.y

        if (diff_x < 0 && diff_y == 0) {
            this.findCar(id).mesh.rotation.y = Math.PI * (3 / 2)
        }
        else if (diff_x > 0 && diff_y == 0) {
            this.findCar(id).mesh.rotation.y = Math.PI * (1 / 2)
        }
        else if (diff_x == 0 && diff_y < 0) {
            this.findCar(id).mesh.rotation.y = Math.PI * 0
        }
        else if (diff_x == 0 && diff_y > 0) {
            this.findCar(id).mesh.rotation.y = Math.PI * 1
        }
    }

    removeSingleCar(id) {
        // remove mesh
        let car = this.findCar(id)
        scene.remove(car.mesh)
        // remove car object from array
        let index = this.cars.findIndex(obj => obj.id == id)
        this.cars.splice(index, 1)
    }
    findCar(id) {
        return this.cars.find(obj => obj.id == id)
    }
}


function getMap() {
    let apiUrl = 'http://localhost:8080/api/'
    return fetch(apiUrl + 'world/' + worldName)
        .then(response => response.json())

}
function getPlot() {
    let statusUrl = 'http://localhost:8080/api/status/'
    console.log(token)
    return fetch(statusUrl + token)
        .then(response => response.json())

}

function getMapAndPlot() {
    return Promise.all([getMap(), getPlot()])
}

function main(map, plot) {
    console.log(plot)
    const map_rows = map.nodes.length
    const map_columns = map.nodes[0].length

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    const gui = new dat.GUI()
    const canvas = document.querySelector('canvas.webgl')
    const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    scene.add(camera)
    camera.position.x = 2
    camera.position.y = 6
    camera.position.z = 2
    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.target = new THREE.Vector3(map_columns, map_rows / 2, 0);
    camera.position.x = map_columns
    camera.position.y = map_rows / 2
    camera.rotation.y = Math.PI / 2
    camera.position.z = 20


    buildListeners()

    const worldL = new World(map_columns, map_rows, map, plot.before, 0)

    const worldR = new World(map_columns, map_rows, map, plot.after, 16)

    buildTicks(scene, controls, renderer, camera, plot, map_rows, map_columns, worldL, worldR)
}



function buildTicks(scene, controls, renderer, camera, plot, map_rows, map_columns, worldL, worldR) {


    const pointLight = new THREE.DirectionalLight(0xffffff, .9)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)
    scene.background = new THREE.Color(0x444444)

    const clock = new THREE.Clock()


    var time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
    var prevElapsedTime = 0
    var frame_index = 0
    // var traffic_lights = buildLights(scene, map_columns)


    const steps_amount = plot.before.steps.length

    const tick = () => {
        const { before, after } = plot
        const elapsedTime = clock.getElapsedTime()
        simElapsedTime += (elapsedTime - prevElapsedTime) * time_speed
        time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
        prevElapsedTime = elapsedTime

        frame_index = Math.floor(simElapsedTime)

        document.getElementById("part_value").textContent = (frame_index / steps_amount * 100).toFixed(1)

        worldL.updateWorld(before.steps[frame_index], before.steps[frame_index + 1])
        worldR.updateWorld(after.steps[frame_index], after.steps[frame_index + 1])

        controls.update()
        renderer.render(scene, camera)
        window.requestAnimationFrame(tick)
    }

    tick()
}

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

function buildListeners() {
    console.log
    document.getElementById("part_change_slider").addEventListener(
        'input',
        function () {
            simElapsedTime = (document.getElementById("part_change_slider").value / 100) * steps_amount
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
}

document.getElementById("dev-button").addEventListener(
    'click',
    function () {
        camera.position.x = 2
        camera.position.y = 2
        camera.position.z = 2
        scene.add(new THREE.GridHelper(10, 10));

        // Objects

        scene.add(test_object1)
        test_object1.position.x = 0
        test_object1.rotation.x = Math.PI * 2
        console.log(test_object1.position.x, test_object1.position.y, test_object1.position.z)
    }
)
document.getElementById("uat-button").addEventListener(
    'click',
    getMapAndPlot()
        .then(([map, plot]) => main(map, plot))

)

document.getElementById("prod-button").addEventListener(
    'click',
    function () {
        console.log('DEV')
    }
)