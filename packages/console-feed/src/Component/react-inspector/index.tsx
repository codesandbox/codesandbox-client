import { withTheme } from 'emotion-theming'
import * as React from 'react'
import {
  DOMInspector,
  Inspector,
  ObjectLabel,
  ObjectName,
  ObjectValue,
  ObjectPreview,
} from 'react-inspector'

import { Context } from '../../definitions/Component'
import ErrorPanel from '../message-parsers/Error'
import { Constructor, HTML, Root, Table } from './elements'

interface Props {
  theme?: Context
  data: any
}

const REMAINING_KEY = '__console_feed_remaining__'

// copied from react-inspector
function intersperse(arr, sep) {
  if (arr.length === 0) {
    return []
  }

  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]])
}

const getArrayLength = (array: Array<any>) => {
  if (!array || array.length < 1) {
    return 0
  }

  const remainingKeyCount = array[array.length - 1]
    .toString()
    .split(REMAINING_KEY)

  if (remainingKeyCount[1] === undefined) {
    return array.length
  } else {
    const remaining = parseInt(
      array[array.length - 1].toString().split(REMAINING_KEY)[1]
    )

    return array.length - 1 + remaining
  }
}

const CustomObjectRootLabel = ({ name, data }) => {
  let rootData = data
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    const object = {}
    for (const propertyName in data) {
      if (data.hasOwnProperty(propertyName)) {
        let propertyValue = data[propertyName]
        if (Array.isArray(propertyValue)) {
          const arrayLength = getArrayLength(propertyValue)
          object[propertyName] = new Array(arrayLength)
        } else {
          object[propertyName] = propertyValue
        }
      }
    }
    rootData = Object.assign(Object.create(Object.getPrototypeOf(data)), object)
  }
  if (typeof name === 'string') {
    return (
      <span>
        <ObjectName name={name} />
        <span>: </span>
        <ObjectPreview data={rootData} />
      </span>
    )
  } else {
    return <ObjectPreview data={rootData} />
  }
}

const CustomObjectLabel = ({ name, data, isNonenumerable = false }) =>
  name === REMAINING_KEY ? (
    data > 0 ? (
      <span>{data} more...</span>
    ) : null
  ) : (
    <span>
      {typeof name === 'string' ? (
        <ObjectName name={name} dimmed={isNonenumerable} />
      ) : (
        <ObjectPreview data={name} />
      )}
      <span>: </span>

      <ObjectValue object={data} />
    </span>
  )

class CustomInspector extends React.PureComponent<Props, any> {
  render() {
    const { data, theme } = this.props
    const { styles, method } = theme

    const dom = data instanceof HTMLElement
    const table = method === 'table'

    return (
      <Root data-type={table ? 'table' : dom ? 'html' : 'object'}>
        {table ? (
          <Table>
            <Inspector {...this.props} theme={styles} table />
            <Inspector
              {...this.props}
              theme={styles}
              nodeRenderer={this.nodeRenderer.bind(this)}
            />
          </Table>
        ) : dom ? (
          <HTML>
            <DOMInspector {...this.props} theme={styles} />
          </HTML>
        ) : (
          <Inspector
            {...this.props}
            theme={styles}
            nodeRenderer={this.nodeRenderer.bind(this)}
          />
        )}
      </Root>
    )
  }

  getCustomNode(data: any) {
    const { styles } = this.props.theme
    const constructor = data?.constructor?.name

    if (constructor === 'Function')
      return (
        <span style={{ fontStyle: 'italic' }}>
          <ObjectPreview data={data} />
          {` {`}
          <span style={{ color: 'rgb(181, 181, 181)' }}>{data.body}</span>
          {`}`}
        </span>
      )

    if (data instanceof Error && typeof data.stack === 'string') {
      return <ErrorPanel error={data.stack} />
    }

    if (constructor === 'Promise')
      return (
        <span style={{ fontStyle: 'italic' }}>
          Promise {`{`}
          <span style={{ opacity: 0.6 }}>{`<pending>`}</span>
          {`}`}
        </span>
      )

    if (data instanceof HTMLElement)
      return (
        <HTML>
          <DOMInspector data={data} theme={styles} />
        </HTML>
      )

    if (Array.isArray(data)) {
      const arrayLength = getArrayLength(data)
      const maxProperties = styles.OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES

      if (
        typeof data[data.length - 1] === 'string' &&
        data[data.length - 1].includes(REMAINING_KEY)
      ) {
        data = data.slice(0, -1)
      }

      const previewArray = data
        .slice(0, maxProperties)
        .map((element, index) => {
          if (Array.isArray(element)) {
            return (
              <ObjectValue
                key={index}
                object={new Array(getArrayLength(element))}
              />
            )
          } else {
            return <ObjectValue key={index} object={element} />
          }
        })
      if (arrayLength > maxProperties) {
        previewArray.push(<span key="ellipsis">…</span>)
      }
      return (
        <React.Fragment>
          <span style={styles.objectDescription}>
            {arrayLength === 0 ? `` : `(${arrayLength})\xa0`}
          </span>
          <span style={styles.preview}>
            [{intersperse(previewArray, ', ')}
            {}]
          </span>
        </React.Fragment>
      )
    }

    return null
  }

  nodeRenderer(props: any) {
    let { depth, name, data, isNonenumerable } = props

    // Root
    if (depth === 0) {
      const customNode = this.getCustomNode(data)
      return customNode || <CustomObjectRootLabel name={name} data={data} />
    }

    if (typeof data === 'string' && data.includes(REMAINING_KEY)) {
      name = REMAINING_KEY
      data = data.split(REMAINING_KEY)[1]
    }

    if (name === 'constructor')
      return (
        <Constructor>
          <ObjectLabel
            name="<constructor>"
            data={data.name}
            isNonenumerable={isNonenumerable}
          />
        </Constructor>
      )

    const customNode = this.getCustomNode(data)

    return customNode ? (
      <Root>
        <ObjectName name={name} />
        <span>: </span>
        {customNode}
      </Root>
    ) : (
      <CustomObjectLabel
        name={name}
        data={data}
        isNonenumerable={isNonenumerable}
      />
    )
  }
}

export default withTheme(CustomInspector)
