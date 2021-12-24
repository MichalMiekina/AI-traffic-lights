import * as THREE from 'three'

class Vehicle{
    constructor(id, vehicle_object){
        this.id = id
        this.vehicle_object = vehicle_object
    }
}

function Car() {
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00,0xffffff]
    let color_index = Math.floor(Math.random() * colors.length)
    var txtColor = colors[color_index]
    var txtColor_string = txtColor.toString(16)
    while(txtColor_string.length!=6){
        txtColor_string = "00"+txtColor_string
    }
    txtColor_string = "#"+txtColor_string
    const car = new THREE.Group()

    const carFrontTexture = getCarFrontTexture(txtColor_string)
    const carSideTexture = getCarSideTexture(txtColor_string)
    const carFrontLampsTexture = getCarFrontLamps(txtColor_string)

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
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ map: carFrontLampsTexture }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
        ]   
    )

    main.position.y=0.5
    main.position.z=0
    car.add(main)

    var lamp = new THREE.RectAreaLight(0xffffff, 1, 1, 1)
    lamp.position.set(0,0,0)
    // car.add(lamp)

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(4,2,5,4),
        [
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ map: carSideTexture }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ color: txtColor }),
            new THREE.MeshLambertMaterial({ map: carFrontTexture }),
            new THREE.MeshLambertMaterial({ color: txtColor }),

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


function getCarFrontTexture(txtColor_string){
    const  canvas = document.createElement("canvas")
    canvas.width=64
    canvas.height=64
    const context = canvas.getContext("2d")

    context.fillStyle = txtColor_string
    context.fillRect(0,0,64,64)

    context.fillStyle = "#888888"
    context.fillRect(8,8,48,64)

    return new THREE.CanvasTexture(canvas)
}

function getCarSideTexture(txtColor_string){
    const  canvas = document.createElement("canvas")
    canvas.width=128
    canvas.height=64
    const context = canvas.getContext("2d")

    context.fillStyle = txtColor_string
    context.fillRect(0,0,128,64)

    context.fillStyle = "#888888"
    context.fillRect(8,8,40,64)
    
    context.fillStyle = "#888888"
    context.fillRect(60,8,64,64)

    return new THREE.CanvasTexture(canvas)
}

function getCarFrontLamps(txtColor_string){
    const canvas = document.createElement("canvas")
    canvas.width=128
    canvas.height=64
    const context = canvas.getContext('2d')

    context.fillStyle = txtColor_string
    context.fillRect(0,0,128,64)
    
    context.fillStyle = '#FFFF33'
    context.fillRect(4,4,16,16)
    context.fillRect(108,4,16,16)

    return new THREE.CanvasTexture(canvas)
}

export {Car, Vehicle}