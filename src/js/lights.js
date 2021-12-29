import * as THREE from 'three';


const BULB_SIZE = .16

const BULB_SEGMENTS = 16

const BULB_INITIAL_COLOR = 0xff0000


class Light {
    constructor(id, height, shift){
        this.id = id
        let [y, x, side] = id.split('-')
        this.mesh = buildLight()
        this.mesh.position.x = parseFloat(x) + shift +.5
        this.mesh.position.y = height - y -.5
        this.mesh.position.z = 1.5

        if (side == 'top') {
            this.mesh.position.y += .5
        }
        if (side == 'bottom') {
            this.mesh.position.y -= .5
        }
        if (side == 'left') {
            this.mesh.position.x -= .5
        }
        if (side == 'right') {
            this.mesh.position.x += .5
        }
    }
}

function buildLight(){
    const light = new THREE.Group()
    const bulb = new THREE.Mesh(
        new THREE.SphereBufferGeometry(BULB_SIZE, BULB_SEGMENTS, BULB_SEGMENTS),
        new THREE.MeshPhongMaterial({ color: BULB_INITIAL_COLOR })
    )
    light.add(bulb)

    return light
}

export default Light