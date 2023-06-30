import { Action } from '../../definitions/Store'

export const initialState = {
  timings: {},
  count: {},
}

const now = () => {
  return typeof performance !== 'undefined' && performance.now
    ? performance.now()
    : Date.now()
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case 'COUNT': {
      const times = state.count[action.name] || 0

      return {
        ...state,
        count: {
          ...state.count,
          [action.name]: times + 1,
        },
      }
    }

    case 'TIME_START': {
      return {
        ...state,
        timings: {
          ...state.timings,
          [action.name]: {
            start: now(),
          },
        },
      }
    }

    case 'TIME_END': {
      const timing = state.timings[action.name]

      const end = now()
      const { start } = timing

      const time = end - start

      return {
        ...state,
        timings: {
          ...state.timings,
          [action.name]: {
            ...timing,
            end,
            time,
          },
        },
      }
    }

    default: {
      return state
    }
  }
}
