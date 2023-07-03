import * as React from 'react'
import { Theme } from '../../definitions/Component'
import { withTheme } from 'emotion-theming'
import { Root } from '../react-inspector/elements'

import Linkify from 'linkifyjs/react'
import type { Options } from 'linkifyjs'
import { Message } from '../../definitions/Component'
import Inspector from '../react-inspector'

interface Props {
  log: Message
  quoted: boolean
  theme?: Theme
  linkifyOptions?: Options
}

class ObjectTree extends React.PureComponent<Props, any> {
  render() {
    const { theme, quoted, log } = this.props

    return log.data.map((message: any, i: number) => {
      if (typeof message === 'string') {
        const string =
          !quoted && message.length ? (
            `${message} `
          ) : (
            <span>
              <span>"</span>
              <span
                style={{
                  color: theme.styles.OBJECT_VALUE_STRING_COLOR,
                }}
              >
                {message}
              </span>
              <span>" </span>
            </span>
          )

        return (
          <Root data-type="string" key={i}>
            <Linkify options={this.props.linkifyOptions}>{string}</Linkify>
          </Root>
        )
      }

      return <Inspector data={message} key={i} />
    })
  }
}

export default withTheme(ObjectTree)
