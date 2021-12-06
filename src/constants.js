import map from '../src/world2.json';
import {scene} from '../src/script'

const map_rows = map.nodes.length;
const map_columns = map.nodes[0].length;

export {map_rows, map_columns}