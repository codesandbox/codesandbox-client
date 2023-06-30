import * as React from 'react'
import { MessageProps, Theme } from '../definitions/Component'
import { ThemeProvider } from 'emotion-theming'

import { Message, Icon, Content, AmountIcon, Timestamp } from './elements'

import Formatted from './message-parsers/Formatted'
import ObjectTree from './message-parsers/Object'
import ErrorPanel from './message-parsers/Error'

// https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions
const reSubstitutions = /(%[coOs])|(%(([0-9]*[.])?[0-9]+)?[dif])/g

class ConsoleMessage extends React.Component<MessageProps, any> {
  shouldComponentUpdate(nextProps) {
    return this.props.log.amount !== nextProps.log.amount
  }

  theme = (theme: Theme) => ({
    ...theme,
    method: this.props.log.method,
  })

  render() {
    const { log } = this.props
    return (
      <ThemeProvider theme={this.theme}>
        <Message data-method={log.method}>
          {log.amount > 1 ? <AmountIcon>{log.amount}</AmountIcon> : <Icon />}
          {log.timestamp ? <Timestamp>{log.timestamp}</Timestamp> : <span/>}
          <Content>{this.getNode()}</Content>
        </Message>
      </ThemeProvider>
    )
  }

  getNode() {
    const { log } = this.props

    // Error handling
    const error = this.typeCheck(log)
    if (error) return error

    // Chrome formatting
    if (log.data.length > 0 && typeof log.data[0] === 'string') {
      const matchLength = log.data[0].match(reSubstitutions)?.length
      if (matchLength) {
        const restData = log.data.slice(1 + matchLength)
        return (
          <>
            <Formatted data={log.data} />
            {restData.length > 0 && (
              <ObjectTree
                quoted={false}
                log={{ ...log, data: restData }}
                linkifyOptions={this.props.linkifyOptions}
              />
            )}
          </>
        )
      }
    }

    // Error panel
    if (
      log.data.every((message) => typeof message === 'string') &&
      log.method === 'error'
    ) {
      return <ErrorPanel error={log.data.join(' ')} />
    }

    // Normal inspector
    const quoted = typeof log.data[0] !== 'string'
    return (
      <ObjectTree
        log={log}
        quoted={quoted}
        linkifyOptions={this.props.linkifyOptions}
      />
    )
  }

  typeCheck(log: any) {
    if (!log) {
      return (
        <Formatted
          data={[
            `%c[console-feed] %cFailed to parse message! %clog was typeof ${typeof log}, but it should've been a log object`,
            'color: red',
            'color: orange',
            'color: cyan',
          ]}
        />
      )
    } else if (!(log.data instanceof Array)) {
      return (
        <Formatted
          data={[
            '%c[console-feed] %cFailed to parse message! %clog.data was not an array!',
            'color: red',
            'color: orange',
            'color: cyan',
          ]}
        />
      )
    }
    return false
  }
}

export default ConsoleMessage
