import * as THREE from 'three'

class Vehicle{
    constructor(id, vehicle_object){
        this.id = id
        this.vehicle_object = vehicle_object
    }
}

function Car() {
    var colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00]
    var color_index = Math.floor(Math.random() * colors.length)
    var color_test = colors[color_index]
    const car = new THREE.Group()

    const carFrontTexture = getCarFrontTexture()
    const carSideTexture = getCarSideTexture()
    const carFrontLampsTexture = getCarFrontLamps()

    const backWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    backWheel.position.z = -2
    backWheel.rotation.x = Math.PI * 2
    backWheel.rotation.z = Math.PI / 2

    car.add(backWheel)

    const frontWheel = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(1, 1, 5, 32),
        new THREE.MeshLambertMaterial({ color: 0x000000 })
    )
    frontWheel.position.z = 2
    frontWheel.rotation.x = Math.PI * 2
    frontWheel.rotation.z = Math.PI / 2

    car.add(frontWheel)

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,8,4),
        [
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ map: carFrontLampsTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),
        ]   
    )

    var lamp1 = new THREE.DirectionalLight(0xffffff, 2, 100)
    lamp1.target = main
    main.add(lamp1)
    main.position.y=0.5
    main.position.z=0
    car.add(main)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,5,4),
        [
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ color: color_test }),
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),
            new THREE.MeshLambertMaterial({ color: color_test }),

        ]
        
    )
    cabin.position.y=2.5
    cabin.position.z=0
    car.add(cabin)
    
    car.position.z=1.1
    car.rotation.x=Math.PI/2
    car.scale.set(.05,.05,.05)

    return car
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

export {Car, Vehicle}