import map from '../src/world2.json'
import after from './after.json'

const frames_amount = after.steps.length
const map_rows = map.nodes.length;
const map_columns = map.nodes[0].length;

export {map_rows, map_columns, frames_amount}