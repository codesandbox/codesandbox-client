import React from 'react';

import { ObjectInspector } from 'react-inspector';

import formatMessageString from '../format-message';
import MessageIcon from '../MessageIcon';
import { IconContainer } from '../elements';
import { Container, InnerItem, inspectorTheme } from './elements';

function formatMessage(message) {
  const formattedResult = document.createElement('span');

  formatMessageString(
    message.arguments[0],
    message.arguments.slice(1),
    formattedResult
  );

  return formattedResult;
}

function getMessage(message) {
  if (message.type === 'return') {
    return (
      <InnerItem>
        <ObjectInspector theme={inspectorTheme} data={message.arguments[0]} />
      </InnerItem>
    );
  }

  if (message.type === 'command') {
    return <InnerItem>{message.arguments[0]}</InnerItem>;
  }

  if (
    message.arguments.length > 0 &&
    typeof message.arguments[0] === 'string' &&
    message.arguments[0].indexOf('%') > -1
  ) {
    return (
      <InnerItem
        dangerouslySetInnerHTML={{
          __html: formatMessage(message).outerHTML.replace(
            /(?:\r\n|\r|\n)/g,
            '<br />'
          ),
        }}
      />
    );
  }

  if (message.arguments.every(argument => typeof argument === 'string')) {
    return <InnerItem>{message.arguments.join(' ')}</InnerItem>;
  }

  return message.arguments.map((m, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <InnerItem key={i}>
      <ObjectInspector theme={inspectorTheme} data={m} />
    </InnerItem>
  ));
}

function Message({ message }) {
  return (
    <Container logType={message.logType}>
      <div>
        <IconContainer>
          <MessageIcon type={message.type} logType={message.logType} />
        </IconContainer>
      </div>
      <div>{getMessage(message)}</div>
    </Container>
  );
}

export default Message;
