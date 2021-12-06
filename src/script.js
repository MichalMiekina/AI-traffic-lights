import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import json from './after.json';

import {map_columns, map_rows} from './constants'
import {Car} from './Car'
import {buildLights, buildMap, traffic_lights} from './Terrain'



class TrafficLight{
    constructor(id, traffic_light_object){
        this.id = id
        this.traffic_light_object = traffic_light_object
    }
}


class Vehicle{
    constructor(id, vehicle_object){
        this.id = id
        this.vehicle_object = vehicle_object
    }
}

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
camera.position.x = map_columns/2
camera.position.y = map_rows/2
camera.position.z = 10
camera.rotation.y= Math.PI / 2
scene.add(camera)


const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );
// Objects
const test_car = Car()
// scene.add(test_car)
// test_car.rotation.x = 0
test_car.position.x = 0
test_car.rotation.y = Math.PI * 1.5
// test_car.position.y = 7.5
console.log(test_car.position.x, test_car.position.y, test_car.position.z)


buildMap(scene)
buildLights(scene)

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
