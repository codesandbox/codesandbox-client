import { initialState } from './reducer'
export let state: typeof initialState

export function update(newState: any) {
  state = newState
}
