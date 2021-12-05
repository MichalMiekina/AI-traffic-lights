import * as THREE from 'three'

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

export {TrafficLight, Vehicle, Car}