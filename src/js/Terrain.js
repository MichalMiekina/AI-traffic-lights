import * as THREE from 'three';
import Light from './lights'
import Car from './Car'

const RECT_SIZE = 64
const RECT_START = 0
const INNER_RECT_START = 1

const INNER_RECT_SIZE = 62

const STREET_COLOR = '#333'
const FRAME_COLOR = '#FFF'

const GRASS_COLOR = '#0a0'

const grassTexture = createGrass()


class World {
    constructor(scene, width, height, map, course, shift) {
        this.scene = scene
        this.shift = shift
        this.width = width
        this.height = height
        this.cars = []
        this.lights = []

        course.steps[0].lights.forEach(element => {
            const light = new Light(element.id, height, this.shift)
            this.lights.push(light)
            this.scene.add(light.mesh)
        })

        this.map = buildWorldMesh(map)
        this.map.position.x += shift
        this.scene.add(this.map)
    }
    updateWorld(prevStep, step0, step1, simElapsedTime) {
        this.updateCars(prevStep.cars, step0.cars, step1.cars, simElapsedTime)
        this.updateLights(step0.lights)
    }
    updateLights(lights) {
        this.lights.forEach(element => {
            this.updateLightColor(lights, element)
        })
    }
    updateLightColor(lights, { id, mesh }) {
        const { color } = lights.find(obj => obj.id == id)
        switch (color) {
            case 'red':
                mesh.children[0].material.color = { r: 1, g: 0, b: 0 }
                break;
            case 'green':
                mesh.children[0].material.color = { r: 0, g: 1, b: 0 }
                break;
            case 'amber':
                mesh.children[0].material.color = { r: 1, g: 1, b: 0 }
                break;
        }
    }
    updateCars(prevCars, cars0, cars1, simElapsedTime) {
        const existingCarsID = cars0.map(a => a.id)

        // removing cars that left the world
        this.cars.forEach(element => {
            !existingCarsID.includes(element.id) && this.removeSingleCar(element.id)
        })

        // creating and moving cars
        cars0.forEach(element => {
            this.updateCarPosition(prevCars, cars0, cars1, element, simElapsedTime)
        });

        // updating cars rotation
        this.cars.forEach(element => {
            existingCarsID.includes(element.id) && this.updateCarRotation(cars0, element.id)
        })
    }

    updateCarPosition(prevCars, cars0, cars1, { id, x, y }, simElapsedTime) {
        let car = this.findCar(id)
        const frameIndexRest = simElapsedTime % 1
        if (cars1.map(a => a.id).includes(id)) {
            // create car if not exists
            if (!car) {
                car = new Car(id, x, y)
                this.cars.push(car)
                this.scene.add(car.mesh)
            }
            // change car position
            const car0 = cars0.find(obj => obj.id == id)
            const car1 = cars1.find(obj => obj.id == id)

            const diff_x = car1.x - car0.x
            const diff_y = car1.y - car0.y

            car.mesh.position.x = x + this.shift + diff_x * frameIndexRest
            car.mesh.position.y = this.height - y - diff_y * frameIndexRest
        }
        else {
            const prevCar = prevCars.find(obj => obj.id == id)
            const car0 = cars0.find(obj => obj.id == id)

            const diff_x = car0.x - prevCar.x
            const diff_y = car0.y - prevCar.y

            if (car) {
                car.mesh.position.x = x + this.shift + diff_x * frameIndexRest
                car.mesh.position.y = this.height - y - diff_y * frameIndexRest
            }
        }


    }

    updateCarRotation(cars0, id) {

        const d = cars0.find(obj => obj.id == id).d
        const mesh = this.findCar(id).mesh
        
        switch (d) {
            case 'l':
                mesh.rotation.y = Math.PI * (3 / 2)
                break;
            case 'r':
                mesh.rotation.y = Math.PI * (1 / 2)
                break;
            case 't':
                mesh.rotation.y = Math.PI * 0
                break;
            case 'b':
                mesh.rotation.y = Math.PI * 1
                break;
        }
    }

    removeSingleCar(id) {
        // remove mesh
        let car = this.findCar(id)
        this.scene.remove(car.mesh)
        // remove car object from array
        let index = this.cars.findIndex(obj => obj.id == id)
        this.cars.splice(index, 1)
    }
    findCar(id) {
        return this.cars.find(obj => obj.id == id)
    }
}



function createContext() {
    const canvas = document.createElement("canvas")
    canvas.width = RECT_SIZE
    canvas.height = RECT_SIZE
    return { canvas: canvas, context: canvas.getContext('2d') }
}

function createStreet(weight, type, directions) {

    const { canvas, context } = createContext()

    context.fillStyle = FRAME_COLOR
    context.fillRect(RECT_START, RECT_START, RECT_SIZE, RECT_SIZE)

    if (['exit', 'entry'].includes(type)) {
        context.fillStyle = type == 'exit' ? '#990000' : '#000099'
        context.fillRect(INNER_RECT_START, INNER_RECT_START, INNER_RECT_SIZE, INNER_RECT_SIZE)
    }
    else {
        context.fillStyle = STREET_COLOR
        context.fillRect(INNER_RECT_START, INNER_RECT_START, INNER_RECT_SIZE, INNER_RECT_SIZE)
    }

    if (weight) {
        context.fillStyle = 'white'
        context.font = '60px MonoLisa';
        context.textAlign = 'center'
        context.textBaseline = 'middle';
        context.fillText(weight, RECT_SIZE / 2, RECT_SIZE / 2);
    }

    return new THREE.CanvasTexture(canvas)
}

function createGrass() {
    const { canvas, context } = createContext()

    context.fillStyle = FRAME_COLOR
    context.fillRect(RECT_START, RECT_START, RECT_SIZE, RECT_SIZE)

    context.fillStyle = GRASS_COLOR
    context.fillRect(INNER_RECT_START, INNER_RECT_START, INNER_RECT_SIZE, INNER_RECT_SIZE)

    return new THREE.CanvasTexture(canvas)
}


function buildWorldMesh(map) {
    const world = new THREE.Group()
    const nodesMeshesList = []
    for (let i = 0; i < map.nodes.length; i++) {
        for (let j = 0; j < map.nodes[i].length; j++) {
            let texture = map.nodes[i][j].type == 'grass' ? grassTexture : createStreet(map.nodes[i][j].weight, map.nodes[i][j].type, map.nodes[i][j].directions)

            let material = new THREE.MeshLambertMaterial({ map: texture })

            let mesh = new THREE.Mesh(
                new THREE.BoxBufferGeometry(1, 1, .1),
                Array(6).fill(material)
            )

            mesh.position.x = j + .5
            mesh.position.y = map.nodes[i].length - i - .5
            mesh.position.z = 1
            world.add(mesh)
            nodesMeshesList.push(mesh)
        }
    }
    return world
}
export { buildWorldMesh }
export default World