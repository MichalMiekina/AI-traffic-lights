import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import json from '../src/after.json';
import map from '../src/world2.json';
import { TrafficLight, Vehicle } from '../src/fun.js'



// class Vehicle{
//     constructor(id, vehicle_object){
//         this.id = id
//         this.vehicle_object = vehicle_object
//     }
// }

// class TrafficLight{
//     constructor(id, traffic_light_object){
//         this.id = id
//         this.traffic_light_object = traffic_light_object
//     }
// }

function getCarFrontTexture(){
    const  canvas = document.createElement("canvas")
    canvas.width=64
    canvas.height=64
    const context = canvas.getContext("2d")

    context.fillStyle = "#dd0000"
    context.fillRect(0,0,64,64)

    context.fillStyle = "#888888"
    context.fillRect(8,8,48,64)

    return new THREE.CanvasTexture(canvas)
}

function getCarSideTexture(){
    const  canvas = document.createElement("canvas")
    canvas.width=128
    canvas.height=64
    const context = canvas.getContext("2d")

    context.fillStyle = "#dd0000"
    context.fillRect(0,0,128,64)

    context.fillStyle = "#888888"
    context.fillRect(8,8,40,64)
    
    context.fillStyle = "#888888"
    context.fillRect(60,8,64,64)

    return new THREE.CanvasTexture(canvas)
}

function getCarFrontLamps(){
    const canvas = document.createElement("canvas")
    canvas.width=128
    canvas.height=64
    const context = canvas.getContext('2d')

    context.fillStyle = '#d00'
    context.fillRect(0,0,128,64)
    
    context.fillStyle = '#FFFF33'
    context.fillRect(4,4,16,16)
    context.fillRect(108,4,16,16)

    return new THREE.CanvasTexture(canvas)
}

function getStreet(){
    const canvas = document.createElement("canvas")
    canvas.width=64
    canvas.height=64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0,0,64,64)

    context.fillStyle = '#333'
    context.fillRect(2,2,60,60)

    return new THREE.CanvasTexture(canvas)
}

function getGrass(){
    const canvas = document.createElement("canvas")
    canvas.width=64
    canvas.height=64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0,0,64,64)

    context.fillStyle = '#0a0'
    context.fillRect(2,2,60,60)

    return new THREE.CanvasTexture(canvas)
}

function Traffic_light(){
    const traffic_light = new THREE.Group()
    const light1 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(.2,.2,.2,4),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    )

    traffic_light.add(light1)

    traffic_light.position.z=1.5

    return traffic_light
}



function Car() {
    var colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00]
    var color_index = Math.floor(Math.random() * colors.length)
    var color_test = colors[color_index]
    const car = new THREE.Group()

    const carFrontTexture = getCarFrontTexture()
    const carSideTexture = getCarSideTexture()
    const carFrontLampsTexture = getCarFrontLamps()

    const backWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    backWheel.position.z = -2
    backWheel.rotation.x = Math.PI * 2
    backWheel.rotation.z = Math.PI / 2

    car.add(backWheel)

    const frontWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    frontWheel.position.z = 2
    frontWheel.rotation.x = Math.PI * 2
    frontWheel.rotation.z = Math.PI / 2

    car.add(frontWheel)

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,8,4),
        [
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ map: carFrontLampsTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),
        ]
        
    )
    main.position.y=0.5
    main.position.z=0
    car.add(main)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,5,4),
        [
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),

        ]
        
    )
    cabin.position.y=2.5
    cabin.position.z=0
    car.add(cabin)
    
    car.position.z=1.1
    car.rotation.x=Math.PI/2
    car.scale.set(.05,.05,.05)

    return car
}
const streetTexture = getStreet()
const grassTexture = getGrass()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Materials

const redMesh = new THREE.MeshBasicMaterial()
redMesh.color = new THREE.Color(0xff0000)

const greenMesh = new THREE.MeshBasicMaterial()
greenMesh.color = new THREE.Color(0x00ff00)

const grayMesh = new THREE.MeshBasicMaterial()
grayMesh.color = new THREE.Color(0xA9A3A3)

// Objects
const test_car = Car()
// scene.add(test_car)
// test_car.rotation.x = 0
test_car.position.x = 0
test_car.rotation.y = Math.PI * 1.5
// test_car.position.y = 7.5
console.log(test_car.position.x, test_car.position.y, test_car.position.z)
scene.remove(test_car)

const test_tl = Traffic_light()
scene.add(test_tl)
test_tl.position.x = 0
test_tl.position.y = 3
// Loading map
console.log(map.nodes.length)
let map_rows = map.nodes.length;
let map_columns = map.nodes[0].length;
let nodesMeshesList = []
console.log(map.nodes[0][1])
// #-#-# building world

for (let i = 0; i < map_rows; i++) {
    for (let j = 0; j < map_columns; j++) {
        // nodesMeshesList.push(new THREE.Mesh(nodeGeometry,))
        if (map.nodes[i][j].type == 'grass') {
            nodesMeshesList.push(new THREE.Mesh(
                new THREE.BoxBufferGeometry(1,1,.1),
                [
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                    new THREE.MeshLambertMaterial({ map: grassTexture }),
                ]
            ))
        }
        else {
            nodesMeshesList.push(new THREE.Mesh(
                new THREE.BoxBufferGeometry(1,1,.1),
                [
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                    new THREE.MeshLambertMaterial({ map: streetTexture }),
                ]
            ))
        }
        scene.add(nodesMeshesList.at(-1))
        nodesMeshesList.at(-1).position.x = j +.5
        nodesMeshesList.at(-1).position.y = map_columns - i -.5
        nodesMeshesList.at(-1).position.z = 1
    }
}
// Lights
const traffic_lights = []
for(let i = 0; i< json.steps[0].lights.length; i++){
    
    traffic_lights.push(new TrafficLight(
        json.steps[0].lights[i].id,
        new THREE.Mesh(
            new THREE.SphereBufferGeometry(.16,16,16),
            new THREE.MeshLambertMaterial({ color: 0xff0000 })
        )
        ))
    
    scene.add(traffic_lights.at(-1).traffic_light_object)
    var tl_x = traffic_lights.at(-1).id.split('-')
    traffic_lights.at(-1).traffic_light_object.position.x = parseFloat(tl_x[1]) +.5
    traffic_lights.at(-1).traffic_light_object.position.y = map_columns - tl_x[0] -.5
    traffic_lights.at(-1).traffic_light_object.position.z = 1.5

    console.log(traffic_lights.at(-1).id, traffic_lights.at(-1).traffic_light_object)
    if(tl_x[2]=='top'){
        traffic_lights.at(-1).traffic_light_object.position.y += .5
    }
    if(tl_x[2]=='bottom'){
        traffic_lights.at(-1).traffic_light_object.position.y -= .5
    }
    if(tl_x[2]=='left'){
        traffic_lights.at(-1).traffic_light_object.position.x -= .5
    }
    if(tl_x[2]=='right'){
        traffic_lights.at(-1).traffic_light_object.position.x += .5
    }
    
}


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

/**
 * Camera
 */
// Base camera
const size = 10;
const divisions = 10;

const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
camera.position.x = map_columns/2
camera.position.y = map_rows/2
camera.position.z = 10
camera.rotation.y= Math.PI / 2
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(map_columns/2,map_rows/2,0);

controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

var vehicles_list = []
var vehicles_ids_list = []

const tick = () => {
    let time_speed = document.getElementById("s1").getElementsByTagName("input")[0].value
    const elapsedTime = clock.getElapsedTime()
    const frame_index = Math.floor(elapsedTime*time_speed)
    
    let current_cars = []

    for(let i=0;i<json.steps[frame_index].cars.length;i++){
        if(!vehicles_ids_list.includes(json.steps[frame_index].cars[i].id)){
            vehicles_list.push(new Vehicle(json.steps[frame_index].cars[i].id,Car()))
            // console.log(vehicles_list.at(-1).)
            vehicles_ids_list.push(json.steps[frame_index].cars[i].id)
            scene.add(vehicles_list.at(-1).vehicle_object)
            vehicles_list.at(-1).vehicle_object.position.x=json.steps[frame_index].cars[i].x
            vehicles_list.at(-1).vehicle_object.position.y=json.steps[frame_index].cars[i].y
        }
        current_cars.push(json.steps[frame_index].cars[i].id)
    }

    for(let i=0; i<vehicles_list.length;i++){
        if(!current_cars.includes(vehicles_list[i].id)){
            scene.remove(vehicles_list[i].vehicle_object)

        }
    }

    for(let i =0; i< traffic_lights.length; i++){
        if(json.steps[frame_index].lights[i].color=="green"){
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
        }
        if(json.steps[frame_index].lights[i].color=="red"){
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0xff0000 })
        }
        if(json.steps[frame_index].lights[i].color=="amber"){
            traffic_lights[i].traffic_light_object.material = new THREE.MeshLambertMaterial({ color: 0xffa500 })
        }
    }


    for(let i=0;i<vehicles_list.length;i++){
        for(let j =0;j<json.steps[frame_index].cars.length;j++){
            if(vehicles_list[i].id==json.steps[frame_index].cars[j].id){
                
                for(let k=0; k<json.steps[frame_index+1].cars.length;k++){
                    if(vehicles_list[i].id==json.steps[frame_index+1].cars[k].id){

                        vehicles_list[i].vehicle_object.position.x = json.steps[frame_index].cars[j].x + (json.steps[frame_index+1].cars[k].x - json.steps[frame_index].cars[j].x)*((elapsedTime*time_speed)%1)
                        vehicles_list[i].vehicle_object.position.y = (map_rows - json.steps[frame_index].cars[j].y) + ((map_rows - json.steps[frame_index+1].cars[k].y) - (map_rows - json.steps[frame_index].cars[j].y))*((elapsedTime*time_speed)%1)

                        let diff_x = json.steps[frame_index+1].cars[k].x - json.steps[frame_index].cars[j].x
                        let diff_y = json.steps[frame_index+1].cars[k].y - json.steps[frame_index].cars[j].y
                        
                        if(diff_x<0 && diff_y==0){
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * (3/2)
                        }
                        if(diff_x>0 && diff_y==0){
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * (1/2)
                        }
                        if(diff_x==0 && diff_y<0){
                            vehicles_list[i].vehicle_object.rotation.y = Math.PI * 0
                        }
                        if(diff_x==0 && diff_y>0){
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
tick()