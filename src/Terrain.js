import map from './world2.json';
import * as THREE from 'three';
import { map_columns, map_rows } from './constants'

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
            if (map.nodes[i][j].type == 'grass') {
                nodesMeshesList.push(new THREE.Mesh(
                    new THREE.BoxBufferGeometry(1, 1, .1),
                    [
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                        new THREE.MeshLambertMaterial({ map: grassTexture }),
                    ]
                ))
            }
            else {
                nodesMeshesList.push(new THREE.Mesh(
                    new THREE.BoxBufferGeometry(1, 1, .1),
                    [
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                        new THREE.MeshLambertMaterial({ map: streetTexture }),
                    ]
                ))
            }
            scene.add(nodesMeshesList.at(-1))
            nodesMeshesList.at(-1).position.x = j + .5
            nodesMeshesList.at(-1).position.y = map_columns - i - .5
            nodesMeshesList.at(-1).position.z = 1
        }
    }
}

export { streetTexture, grassTexture,buildMap }