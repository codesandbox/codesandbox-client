import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { sortBy, takeRight } from 'lodash-es';

import AutosizeTextArea from '@codesandbox/common/lib/components/AutosizeTextArea';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';

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

export const Chat: React.FC = () => {
  const [value, setValue] = useState('');
  const [height, setHeight] = useState('');
  const { state, actions } = useOvermind();
  const messagesRef = useRef(null);
  function scrollDown() {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }
  useEffect(scrollDown);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === ENTER && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      // Enter
      actions.live.onSendChat({
        message: value,
      });
      setValue('');
      scrollDown();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const { messages, users } = state.live.roomInfo.chat;
  const currentUserId = state.live.liveUserId;
  const roomInfoUsers = state.live.roomInfo.users;

  return (
    <Container
      ref={el => {
        messagesRef.current = el;
      }}
    >
      <Messages>
        {messages.length > 0 ? (
          sortBy(takeRight(messages, 100), 'date').map((message, i) => {
            const metadata = roomInfoUsers.find(u => u.id === message.userId);
            const color = metadata
              ? `rgb(${metadata.color[0]}, ${metadata.color[1]}, ${
                  metadata.color[2]
                })`
              : '#636363';
            const name = users.get
              ? users.get(message.userId)
              : users[message.userId];
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
        value={value}
        onChange={handleChange}
        placeholder="Send a message..."
        style={{
          width: '100%',
          minHeight: height,
          marginTop: '0.5rem',
        }}
        onKeyDown={handleKeyDown}
        onHeightChange={setHeight}
      />
    </Container>
  );
};
