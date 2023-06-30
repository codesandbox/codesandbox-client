import * as _ from 'lodash'
import Parse from '..'

it('asserts values', () => {
  expect(Parse('assert', [2 > 1], 'assert-true')).toBe(false)
  expect(Parse('assert', [1 > 2], 'assert-false')).toMatchSnapshot(
    'assertion failed'
  )
})

describe('count', () => {
  it('counts with label', () => {
    let final

    _.times(10, () => {
      final = Parse('count', ['count-10'])
    })

    expect(final && final.data[0]).toBe('count-10: 10')
  })

  it('counts with default label', () => {
    let final

    _.times(10, () => {
      final = Parse('count', [])
    })

    expect(final && final.data[0]).toBe('default: 10')
  })
})

describe('time', () => {
  it('profile time with label', () => {
    Parse('time', ['timer-test'])

    setTimeout(() => {
      const result = Parse('timeEnd', ['timer-test'], 'timer-result')
      expect(
        result && +result.data[0].replace(/[^0-9]/g, '') > 100
      ).toBeTruthy()
    }, 100)
  })

  it('non existent label', () => {
    Parse('time', ['timer-test'])

    const failure = Parse('timeEnd', ['nonExistent'], 'timer-fail')
    expect(failure).toMatchSnapshot('non existent timer')
  })

  it('profile time with default label', () => {
    Parse('time', [])

    const result = Parse('timeEnd', [], 'timer-result')
    expect(result && result.data[0].match(/^default: \d+\.\d+ms$/)).toBeTruthy()
  })
})

it('records errors', () => {
  const result = Parse('error', [new Error('one')], 'errors')

  expect(result && result.data[0]).toContain('Error: one')
})
