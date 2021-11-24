import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import json from '../src/data3.json';
import map from '../src/world2.json';

class Vehicle{
    constructor(id, vehicle_object){
        this.id = id
        this.vehicle_object = vehicle_object
    }
}

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
    context.fillRect(4,4,56,56)

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
    context.fillRect(4,4,56,56)

    return new THREE.CanvasTexture(canvas)
}

function Car() {
    const car = new THREE.Group()

    const carFrontTexture = getCarFrontTexture()
    const carSideTexture = getCarSideTexture()
    const carFrontLampsTexture = getCarFrontLamps()

    const backWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    backWheel.rotation.x = Math.PI * 2
    backWheel.rotation.z = Math.PI / 2

    car.add(backWheel)

    const frontWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    frontWheel.position.z = -5
    frontWheel.rotation.x = Math.PI * 2
    frontWheel.rotation.z = Math.PI / 2

    car.add(frontWheel)

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,10,4),
        [
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ map: carFrontLampsTexture }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
        ]
        
    )
    main.position.y=0.5
    main.position.z=-2
    car.add(main)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,8,4),
        [
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),
            new THREE.MeshLambertMaterial({ color: 0xdd0000 }),

        ]
        
    )
    cabin.position.y=2.5
    cabin.position.z=-3
    car.add(cabin)
    
    car.position.z=1
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
let carsMeshesList = []
const tmpGeometry = new THREE.CircleGeometry(.1, 1)
const nodeGeometry = new THREE.PlaneGeometry(1, 1)

const nodeMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1,1,1),
    [
        new THREE.MeshLambertMaterial({ map: streetTexture }),
        new THREE.MeshLambertMaterial({ map: streetTexture }),
        new THREE.MeshLambertMaterial({ map: streetTexture }),
        new THREE.MeshLambertMaterial({ map: streetTexture }),
        new THREE.MeshLambertMaterial({ map: streetTexture }),
        new THREE.MeshLambertMaterial({ map: streetTexture }),
    ]
)

// Loading map
console.log(map.nodes.length)
let map_rows = map.nodes.length;
let map_columns = map.nodes[0].length;
let nodesMeshesList = []
console.log(map.nodes[0][1])
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
        nodesMeshesList.at(-1).position.x = j
        nodesMeshesList.at(-1).position.y = map_columns - i
        nodesMeshesList.at(-1).position.z = 1

    }
}
const roadPlane = new THREE.Mesh(nodeGeometry, grayMesh)
const grassPlane = new THREE.Mesh(nodeGeometry, greenMesh)
// scene.add(roadPlane)
// scene.add(grassPlane)
roadPlane.position.z = 1
grassPlane.position.z = 1
grassPlane.position.x = -5

const plane = new THREE.PlaneGeometry(3, 3);
const triangle = new THREE.CircleGeometry(.1, 1)
const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);


// Mesh
const board = new THREE.Mesh(plane, greenMesh)
const sphere = new THREE.Mesh(geometry, redMesh)
const car = new THREE.Mesh(triangle, redMesh)
// scene.add(board)
// scene.add(car)
car.position.x = 0.1
car.position.y = 0.1
car.position.z = 1

// Lights

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
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, .1, 1000)
camera.position.x = map_columns/2
camera.position.y = map_rows/2
camera.position.z = 10
camera.rotation.y= Math.PI / 2
var point = new THREE.Vector3( 15, 15, 0 );
camera.lookAt(point)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.target = new THREE.Vector3(map_columns/2,map_rows/2,0);
// controls.enableDamping = true

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

for(let i=0;i<carsMeshesList.length;i++){
    
    
}

var vehicles_list = []
var vehicles_ids_list = []

const tick = () => {

    const elapsedTime = clock.getElapsedTime()
    const frame_index = Math.floor(elapsedTime)



    let px = [0,.2,.4,.6,.8,1,1,1,1,1,1,1,1]
    let py = [0,0,0,0,0,0,.2,.4,.6,.8,1]
    let pt = [.1,-.1,.1,-.1]

    

    for(let i=0;i<json.steps[frame_index].cars.length;i++){
        if(!vehicles_ids_list.includes(json.steps[frame_index].cars[i].id)){
            vehicles_list.push(new Vehicle(json.steps[frame_index].cars[i].id,Car()))
            // console.log(vehicles_list.at(-1).)
            vehicles_ids_list.push(json.steps[frame_index].cars[i].id)
            scene.add(vehicles_list.at(-1).vehicle_object)
            vehicles_list.at(-1).vehicle_object.position.x=json.steps[frame_index].cars[i].x
            vehicles_list.at(-1).vehicle_object.position.y=json.steps[frame_index].cars[i].y
        }
    }

    // console.log(vehicles_ids_list)

    for(let i=0;i<vehicles_list.length;i++){
        
        for(let j =0;j<json.steps[frame_index].cars.length;j++){
            if(vehicles_list[i].id==json.steps[frame_index].cars[j].id){
                
                for(let k=0; k<json.steps[frame_index+1].cars.length;k++){
                    if(vehicles_list[i].id==json.steps[frame_index+1].cars[k].id){
                        
                        

                        vehicles_list[i].vehicle_object.position.x = json.steps[frame_index].cars[j].y + (json.steps[frame_index+1].cars[k].y - json.steps[frame_index].cars[j].y)*(elapsedTime%1)
                        vehicles_list[i].vehicle_object.position.y = (map_rows - json.steps[frame_index].cars[j].x) + ((map_rows - json.steps[frame_index+1].cars[k].x) - (map_rows - json.steps[frame_index].cars[j].x))*(elapsedTime%1)
                        console.log(vehicles_list[i].id,vehicles_list[i].vehicle_object.position.x, vehicles_list[i].vehicle_object.position.y)
                        

                        let diff_y = json.steps[frame_index+1].cars[k].y - json.steps[frame_index].cars[j].y
                        let diff_x = json.steps[frame_index+1].cars[k].x - json.steps[frame_index].cars[j].x
                        // let vector = diff_x/diff_y 
                        
                        // vehicles_list[i].vehicle_object.rotation.y = Math.PI / 2
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