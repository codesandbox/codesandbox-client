import { Action } from '../../definitions/Store'
import reduce from './reducer'
import { state, update } from './state'

function dispatch(action: Action) {
  update(reduce(state, action))
}

export default dispatch
