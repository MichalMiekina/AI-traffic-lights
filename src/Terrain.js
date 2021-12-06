import json from './after.json';
import map from './world2.json';
import * as THREE from 'three';
import { map_columns, map_rows } from './constants'

const streetTexture = getStreet()
const grassTexture = getGrass()

function getStreet() {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0, 0, 64, 64)

    context.fillStyle = '#333'
    context.fillRect(2, 2, 60, 60)

    return new THREE.CanvasTexture(canvas)
}

function getGrass() {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0, 0, 64, 64)

    context.fillStyle = '#0a0'
    context.fillRect(2, 2, 60, 60)

    return new THREE.CanvasTexture(canvas)
}


class TrafficLight {
    constructor(id, traffic_light_object) {
        this.id = id
        this.traffic_light_object = traffic_light_object
    }
}

function buildMap(scene) {

    const nodesMeshesList = []
    for (let i = 0; i < map_rows; i++) {
        for (let j = 0; j < map_columns; j++) {
            if (map.nodes[i][j].type == 'grass') {
                nodesMeshesList.push(new THREE.Mesh(
                    new THREE.BoxBufferGeometry(1, 1, .1),
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
                    new THREE.BoxBufferGeometry(1, 1, .1),
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
            nodesMeshesList.at(-1).position.x = j + .5
            nodesMeshesList.at(-1).position.y = map_columns - i - .5
            nodesMeshesList.at(-1).position.z = 1
        }
    }
}


// Lights
const traffic_lights = []
function buildLights(scene) {
    for (let i = 0; i < json.steps[0].lights.length; i++) {

        traffic_lights.push(new TrafficLight(
            json.steps[0].lights[i].id,
            new THREE.Mesh(
                new THREE.SphereBufferGeometry(.16, 16, 16),
                new THREE.MeshLambertMaterial({ color: 0xff0000 })
            )
        ))

        scene.add(traffic_lights.at(-1).traffic_light_object)
        var tl_x = traffic_lights.at(-1).id.split('-')
        traffic_lights.at(-1).traffic_light_object.position.x = parseFloat(tl_x[1]) + .5
        traffic_lights.at(-1).traffic_light_object.position.y = map_columns - tl_x[0] - .5
        traffic_lights.at(-1).traffic_light_object.position.z = 1.5

        console.log(traffic_lights.at(-1).id, traffic_lights.at(-1).traffic_light_object)
        if (tl_x[2] == 'top') {
            traffic_lights.at(-1).traffic_light_object.position.y += .5
        }
        if (tl_x[2] == 'bottom') {
            traffic_lights.at(-1).traffic_light_object.position.y -= .5
        }
        if (tl_x[2] == 'left') {
            traffic_lights.at(-1).traffic_light_object.position.x -= .5
        }
        if (tl_x[2] == 'right') {
            traffic_lights.at(-1).traffic_light_object.position.x += .5
        }

    }
}






export { streetTexture, grassTexture, buildLights, traffic_lights,buildMap }