import json from './after.json';
import * as THREE from 'three';

const BULB_SIZE = .16

const BULB_SEGMENTS = 16

const BULB_INITIAL_COLOR = 0xff0000

const HALF = .5

const BULB_HEIGHT = 1.5


function buildLights(scene, map_columns) {
    let traffic_lights = []

    json.steps[0].lights.forEach(light => {

        let semafor = {
            id: light.id,
            traffic_light_object: new THREE.Mesh(
                new THREE.SphereBufferGeometry(BULB_SIZE, BULB_SEGMENTS, BULB_SEGMENTS),
                new THREE.MeshNormalMaterial({ color: BULB_INITIAL_COLOR })
            )
        }

        let [y, x, side] = semafor.id.split('-')

        semafor.traffic_light_object.position.x = parseFloat(x) + HALF
        semafor.traffic_light_object.position.y = map_columns - y - HALF
        semafor.traffic_light_object.position.z = BULB_HEIGHT

        if (side == 'top') {
            semafor.traffic_light_object.position.y += HALF
        }
        if (side == 'bottom') {
            semafor.traffic_light_object.position.y -= HALF
        }
        if (side == 'left') {
            semafor.traffic_light_object.position.x -= HALF
        }
        if (side == 'right') {
            semafor.traffic_light_object.position.x += HALF
        }

        scene.add(semafor.traffic_light_object)
        traffic_lights.push(semafor)

    });
    return traffic_lights
}

function buildLight(){
    const light = new THREE.Group()
    const bulb = new THREE.Mesh(
        new THREE.SphereBufferGeometry(BULB_SIZE, BULB_SEGMENTS, BULB_SEGMENTS),
        new THREE.MeshLambertMaterial({ color: BULB_INITIAL_COLOR })
    )
    light.add(bulb)

    return light
}

export { buildLight, buildLights }