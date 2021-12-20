import json from './after.json';
import * as THREE from 'three';
import { map_columns } from './constants'


const BULB_SIZE = .16

const BULB_SEGMENTS = 16

const BULB_INITIAL_COLOR = 0xff0000

const HALF = .5

const BULB_HEIGHT = 1.5

//usunięta klasa, bo nie ma żadnych metod, w takiej sytuacji wystarczy zwykły słownik


function buildLights(scene) {
    let traffic_lights = []

    json.steps[0].lights.forEach(light => {
    
        let semafor = {id: light.id,
            traffic_light_object: new THREE.Mesh(
                new THREE.SphereBufferGeometry(BULB_SIZE, BULB_SEGMENTS, BULB_SEGMENTS),
                new THREE.MeshNormalMaterial({ color: BULB_INITIAL_COLOR })
            )}

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

export {buildLights}