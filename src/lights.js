import json from './after.json';
import * as THREE from 'three';
import { map_columns } from './constants'


class TrafficLight {
    constructor(id, traffic_light_object) {
        this.id = id
        this.traffic_light_object = traffic_light_object
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
                new THREE.MeshNormalMaterial({ color: 0xff0000 })
            )
        ))

        scene.add(traffic_lights.at(-1).traffic_light_object)
        var tl_x = traffic_lights.at(-1).id.split('-')
        traffic_lights.at(-1).traffic_light_object.position.x = parseFloat(tl_x[1]) + .5
        traffic_lights.at(-1).traffic_light_object.position.y = map_columns - tl_x[0] - .5
        traffic_lights.at(-1).traffic_light_object.position.z = 1.5

        // console.log(traffic_lights.at(-1).id, traffic_lights.at(-1).traffic_light_object)
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

export {buildLights, traffic_lights}