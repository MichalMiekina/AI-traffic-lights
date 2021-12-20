import map from './world2.json';
import * as THREE from 'three';
import { map_columns, map_rows } from './constants'

// wyciągnąć do maina
const streetTexture = getStreet()
const grassTexture = getGrass()

function getStreet() {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0, 0, 64, 64)

    context.fillStyle = '#333'
    context.fillRect(1, 1, 62, 62)

    return new THREE.CanvasTexture(canvas)
}

function getGrass() {
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')

    context.fillStyle = '#FFF'
    context.fillRect(0, 0, 64, 64)

    context.fillStyle = '#0a0'
    context.fillRect(1, 1, 62, 62)

    return new THREE.CanvasTexture(canvas)
}


function buildMap(scene) {
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

export { streetTexture, grassTexture,buildMap }