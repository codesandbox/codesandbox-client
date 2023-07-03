import { state } from '../../store/state'
import dispatch from '../../store/dispatch'
import { timeStart, timeEnd } from '../../store/actions'

export function start(label: string) {
  dispatch(timeStart(label))
}

export function stop(label: string): any {
  const timing = state?.timings[label]
  if (timing && !timing.end) {
    dispatch(timeEnd(label))
    const { time } = state.timings[label]

    return {
      method: 'log',
      data: [`${label}: ${time}ms`],
    }
  }
  return {
    method: 'warn',
    data: [`Timer '${label}' does not exist`],
  }
}
