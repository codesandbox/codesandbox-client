import React from 'react'
import { render } from 'react-dom'
import update from 'immutability-helper'
import { Hook, Console, Decode } from '../../src'
import { Message } from '../../src/definitions/Component'

const iframe = document.createElement('iframe')
iframe.src = './iframe.html'
document.body.appendChild(iframe)

class App extends React.Component {
  state = {
    isDarkMode: true,
    logs: [
      {
        method: 'result',
        data: ['Result'],
        timestamp: this.getTimestamp(),
      },
      {
        method: 'command',
        data: ['Command'],
        timestamp: this.getTimestamp(),
      },
    ] as any[],
    filter: [],
    searchKeywords: '',
  }

  getNumberStringWithWidth(num: Number, width: number) {
    const str = num.toString()
    if (width > str.length) return '0'.repeat(width - str.length) + str
    return str.substr(0, width)
  }

  getTimestamp() {
    const date = new Date()
    const h = this.getNumberStringWithWidth(date.getHours(), 2)
    const min = this.getNumberStringWithWidth(date.getMinutes(), 2)
    const sec = this.getNumberStringWithWidth(date.getSeconds(), 2)
    const ms = this.getNumberStringWithWidth(date.getMilliseconds(), 3)
    return `${h}:${min}:${sec}.${ms}`
  }

  componentDidMount() {
    Hook(
      (iframe.contentWindow as any).console,
      (log) => {
        const decoded = Decode(log)
        decoded.timestamp = this.getTimestamp()
        this.setState((state) => update(state, { logs: { $push: [decoded] } }))
      },
      true,
      100
    )
  }

  switch = () => {
    const filter = this.state.filter.length === 0 ? ['log'] : []
    this.setState({
      filter,
    })
  }

  handleKeywordsChange = ({ target: { value: searchKeywords } }) => {
    this.setState({ searchKeywords })
  }

  render() {
    const { isDarkMode } = this.state
    return (
      <div
        style={{
          margin: '1em 0',
          color: isDarkMode ? '#fff' : '#242424',
          backgroundColor: isDarkMode ? '#242424' : '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
          <button onClick={this.switch.bind(this)}>Show only logs</button>
          <input placeholder="search" onChange={this.handleKeywordsChange} />
          <label>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => {
                this.setState({ isDarkMode: e.target.checked })
              }}
            />
            Toggle dark mode
          </label>
        </div>

        <Console
          logs={this.state.logs}
          variant={isDarkMode ? 'dark' : 'light'}
          filter={this.state.filter}
          searchKeywords={this.state.searchKeywords}
        />
      </div>
    )
  }
}

render(<App />, document.querySelector('#demo'))
