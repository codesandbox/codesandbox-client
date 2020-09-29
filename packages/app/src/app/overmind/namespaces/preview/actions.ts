import { Action } from 'app/overmind'

export const toggleResponsiveMode: Action = ({ state }) => {
  if (state.preview.mode === 'responsive') {
    state.preview.mode = null
  } else {
    state.preview.mode = 'responsive'
  }
}