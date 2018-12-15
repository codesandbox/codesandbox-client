import React from 'react';
import styled from 'styled-components';
import { sortBy, takeRight } from 'lodash-es';
import { inject, observer } from 'mobx-react';

import AutosizeTextArea from 'common/components/AutosizeTextArea';

const Container = styled.div`
  min-height: 200px;
  max-height: 300px;
  padding: 0 1rem;
  color: white;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const Messages = styled.div`
  height: 100%;
  flex: 1;
`;

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
                    <div
                      style={{
                        color,
                        fontWeight: 600,
                        marginBottom: '0.25rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      {name}
                      {currentUserId === message.userId && ' (you)'}
                      {!metadata && ' (left)'}
                    </div>
                  )}
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 400,
                      marginBottom: '.25rem',
                    }}
                  >
                    {message.message.split('\n').map(m => (
                      <span key={m}>
                        {m}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              No messages, start sending some!
            </div>
          )}
        </Messages>
        <AutosizeTextArea
          useCacheForDOMMeasurements
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Send a message..."
          style={{
            width: '100%',
            minHeight: this.state.height,
            marginTop: '0.5rem',
          }}
          onKeyDown={this.handleKeyDown}
          onHeightChange={height => this.setState({ height })}
        />
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(Chat));
