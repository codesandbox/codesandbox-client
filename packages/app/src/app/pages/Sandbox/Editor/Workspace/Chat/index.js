import React from 'react';
import { sortBy, takeRight } from 'lodash-es';
import { inject, observer } from 'mobx-react';

import AutosizeTextArea from 'common/components/AutosizeTextArea';

import { Container, Messages, Name, Message, NoMessages } from './elements';

class Chat extends React.Component {
  state = {
    value: '',
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      // Enter
      this.props.signals.live.onSendChat({
        message: this.state.value,
      });
      this.setState({ value: '' });
      if (this.messages) {
        this.messages.scrollTop = this.messages.scrollHeight;
      }
    }
  };

  handleChange = e => {
    this.setState({ value: e.target.value });
  };

  componentDidUpdate() {
    if (this.messages) {
      this.messages.scrollTop = this.messages.scrollHeight;
    }
  }

  componentDidMount() {
    if (this.messages) {
      this.messages.scrollTop = this.messages.scrollHeight;
    }
  }

  render() {
    const { store } = this.props;
    const { messages, users } = store.live.roomInfo.chat;
    const currentUserId = store.user.id;
    const usersMetadata = store.live.roomInfo.usersMetadata;

    return (
      <Container
        ref={el => {
          this.messages = el;
        }}
      >
        <Messages>
          {messages.length > 0 ? (
            sortBy(takeRight(messages, 100), 'date').map((message, i) => {
              const metadata = usersMetadata.get(message.userId);
              const color = metadata
                ? `rgb(${metadata.color[0]}, ${metadata.color[1]}, ${
                    metadata.color[2]
                  })`
                : '#636363';
              const name = users.get(message.userId);
              return (
                <div key={message.date}>
                  {(i === 0 || messages[i - 1].userId !== message.userId) && (
                    <Name color={color}>
                      {name}
                      {currentUserId === message.userId && ' (you)'}
                      {!metadata && ' (left)'}
                    </Name>
                  )}
                  <Message>
                    {message.message.split('\n').map(m => (
                      <span key={m}>
                        {m}
                        <br />
                      </span>
                    ))}
                  </Message>
                </div>
              );
            })
          ) : (
            <NoMessages>No messages, start sending some!</NoMessages>
          )}
        </Messages>
        <AutosizeTextArea
          useCacheForDOMMeasurements
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Send a message..."
          css={`
            width: 100%;
            min-height: ${this.state.height};
            margin-top: 0.5rem;
          `}
          onKeyDown={this.handleKeyDown}
          onHeightChange={height => this.setState({ height })}
        />
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Chat));
