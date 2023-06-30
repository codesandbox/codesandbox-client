import { Methods } from '../../definitions/Console'
import { Payload } from '../../definitions/Payload'
import GUID from './GUID'

import * as Timing from './methods/timing'
import * as Count from './methods/count'
import * as Assert from './methods/assert'

/**
 * Parses a console log and converts it to a special Log object
 * @argument method The console method to parse
 * @argument data The arguments passed to the console method
 */
function Parse(
  method: Methods,
  data: any[],
  staticID?: string
): Payload | false {
  // Create an ID
  const id = staticID || GUID()

  // Parse the methods
  switch (method) {
    case 'clear': {
      return {
        method,
        id
      }
    }

    case 'count': {
      const label = typeof data[0] === 'string' ? data[0] : 'default'
      if (!label) return false

      return {
        ...Count.increment(label),
        id
      }
    }

    case 'time':
    case 'timeEnd': {
      const label = typeof data[0] === 'string' ? data[0] : 'default'
      if (!label) return false

      if (method === 'time') {
        Timing.start(label)
        return false
      }

      return {
        ...Timing.stop(label),
        id
      }
    }

    case 'assert': {
      const valid = data.length !== 0

      if (valid) {
        const assertion = Assert.test(data[0], ...data.slice(1))
        if (assertion) {
          return {
            ...assertion,
            id
          }
        }
      }

      return false
    }

    case 'error': {
      const errors = data.map(error => {
        try {
          return error.stack || error
        } catch (e) {
          return error
        }
      })

      return {
        method,
        id,
        data: errors
      }
    }

    default: {
      return {
        method,
        id,
        data
      }
    }
  }
}

export default Parse
