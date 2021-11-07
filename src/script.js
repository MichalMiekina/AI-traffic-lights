import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import json from '../src/data.json';
import map from '../src/world.json';



console.log(json.frames[0].cars[0])
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
const tmpGeometry =new THREE.CircleGeometry(.1,1)
const nodeGeometry = new THREE.PlaneGeometry(1,1)

for(let i=0;i<json.frames[0].cars.length;i++){
    
    carsMeshesList.push(new THREE.Mesh(tmpGeometry,redMesh))
    scene.add(carsMeshesList[i])
    carsMeshesList[i].position.x = json.frames[0].cars[i].x
    carsMeshesList[i].position.y = json.frames[0].cars[i].y
    carsMeshesList[i].position.z = 1

    console.log(`CAR: x: ${carsMeshesList[i].position.x}, y: ${carsMeshesList[i].position.y}, z: ${carsMeshesList[i].position.z}`)
}

// Loading map
console.log(map.nodes.length)
let map_rows = map.nodes.length;
let map_columns = map.nodes[0].length;
let nodesMeshesList = []
console.log(map.nodes[0][1])
for(let i=0;i<map_rows;i++){
    for(let j=0;j<map_columns;j++){
        // nodesMeshesList.push(new THREE.Mesh(nodeGeometry,))
        if(map.nodes[i][j].type=='grass'){
            nodesMeshesList.push(new THREE.Mesh(nodeGeometry,greenMesh))
        }
        else{
            nodesMeshesList.push(new THREE.Mesh(nodeGeometry,grayMesh))
        }
        scene.add(nodesMeshesList.at(-1))
        nodesMeshesList.at(-1).position.x = j
        nodesMeshesList.at(-1).position.y = -1 * i
        nodesMeshesList.at(-1).position.z = 1

    }
}
console.log(nodesMeshesList)
const roadPlane = new THREE.Mesh(nodeGeometry, grayMesh)
const grassPlane = new THREE.Mesh(nodeGeometry, greenMesh)
// scene.add(roadPlane)
// scene.add(grassPlane)
roadPlane.position.z=1
grassPlane.position.z=1
grassPlane.position.x=-5

const plane = new THREE.PlaneGeometry(3,3);
const triangle = new THREE.CircleGeometry(.1,1)
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );


// Mesh
const board = new THREE.Mesh(plane, greenMesh)
const sphere = new THREE.Mesh(geometry,redMesh)
const car = new THREE.Mesh(triangle, redMesh)
// scene.add(board)
scene.add(car)
car.position.x = 0.1
car.position.y = 0.1
car.position.z=1


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 1.5
camera.position.y = -1
camera.position.z = 10
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
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

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    // console.log(`CAR: x: ${car.position.x}, y: ${car.position.y}, z: ${car.position.z}`)
    
    // car.position.x+=.001

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()