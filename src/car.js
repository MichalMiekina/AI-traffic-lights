import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

let carX = 69;

// export {carX};

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
    
    

    return car
}