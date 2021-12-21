// import map from './world2.json';
// import {map} from './home'
import * as THREE from 'three';
import { map_columns, map_rows } from './constants'

const RECT_SIZE = 64
const RECT_START = 0
const INNER_RECT_START = 1

const INNER_RECT_SIZE = 62

const STREET_COLOR = '#333'
const FRAME_COLOR = '#FFF'

const GRASS_COLOR = '#0a0'


const streetTexture = createStreet()
const grassTexture = createGrass()

function createContext() {
    const canvas = document.createElement("canvas")
    canvas.width = RECT_SIZE
    canvas.height = RECT_SIZE
    return {canvas: canvas, context: canvas.getContext('2d')}
}

function createStreet() {
    const {canvas, context} = createContext()

    context.fillStyle = FRAME_COLOR
    context.fillRect(RECT_START, RECT_START, RECT_SIZE, RECT_SIZE)

    context.fillStyle = STREET_COLOR
    context.fillRect(INNER_RECT_START, INNER_RECT_START, INNER_RECT_SIZE, INNER_RECT_SIZE)

    return new THREE.CanvasTexture(canvas)
}

function createGrass() {
    const {canvas, context} = createContext()

    context.fillStyle = FRAME_COLOR
    context.fillRect(RECT_START, RECT_START, RECT_SIZE, RECT_SIZE)

    context.fillStyle = GRASS_COLOR
    context.fillRect(INNER_RECT_START, INNER_RECT_START, INNER_RECT_SIZE, INNER_RECT_SIZE)

    return new THREE.CanvasTexture(canvas)
}


function buildMap(scene, map) {
    console.log('XD: '+map)
    const nodesMeshesList = []
    for (let i = 0; i < map_rows; i++) {
        for (let j = 0; j < map_columns; j++) {

            let texture = map.nodes[i][j].type == 'grass' ? grassTexture : streetTexture 

            let material = new THREE.MeshLambertMaterial({ map: texture })

            let mesh = new THREE.Mesh(
                new THREE.BoxBufferGeometry(1, 1, .1),
                Array(6).fill(material)
            )

            mesh.position.x = j + .5
            mesh.position.y = map_columns - i - .5
            mesh.position.z = 1

            scene.add(mesh)
            nodesMeshesList.push(mesh)
        }
    }
}

export { buildMap }