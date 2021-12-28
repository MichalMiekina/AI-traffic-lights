import json from './after.json';
import * as THREE from 'three';

const BULB_SIZE = .16

const BULB_SEGMENTS = 16

const BULB_INITIAL_COLOR = 0xff0000

const HALF = .5

const BULB_HEIGHT = 1.5



function buildLight(){
    const light = new THREE.Group()
    const bulb = new THREE.Mesh(
        new THREE.SphereBufferGeometry(BULB_SIZE, BULB_SEGMENTS, BULB_SEGMENTS),
        new THREE.MeshPhongMaterial({ color: BULB_INITIAL_COLOR })
    )
    light.add(bulb)

    return light
}

export { buildLight }