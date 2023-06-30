import { state } from '../../store/state'
import dispatch from '../../store/dispatch'
import { count } from '../../store/actions'

export function increment(label: string): any {
  dispatch(count(label))
  const times = state.count[label]

  return {
    method: 'log',
    data: [`${label}: ${times}`]
  }
}
