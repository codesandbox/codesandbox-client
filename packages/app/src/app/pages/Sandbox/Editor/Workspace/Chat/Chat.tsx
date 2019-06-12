import React, { useState, useEffect, createRef } from 'react';
import { observer } from 'mobx-react-lite';
import { sortBy, takeRight } from 'lodash-es';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useSignals, useStore } from 'app/store';
import {
  Container,
  Messages,
  User,
  Message,
  NoMessages,
  ChatInput,
} from './elements';
import { Msg } from './types';

export const Chat = observer(() => {
  const [message, setMessage] = useState(``);
  const [height, setHeight] = useState(undefined);
  const chatLog = createRef<HTMLDivElement>();
  const {
    live: { onSendChat },
  } = useSignals();
  const {
    live: {
      roomInfo: {
        chat: { messages, users },
        users: participants,
      },
      liveUserId,
    },
  } = useStore();

  useEffect(() => {
    if (chatLog !== null) {
      chatLog.current.scrollTop = chatLog.current.scrollHeight;
    }
  }, [chatLog]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ENTER && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      // Enter
      onSendChat({ message });
      setMessage('');
      if (chatLog.current !== null) {
        chatLog.current.scrollTop = chatLog.current.scrollHeight;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Container ref={chatLog}>
      <Messages>
        {messages.length > 0 ? (
          sortBy(takeRight(messages, 100), 'date').map((msg: Msg, i) => {
            const metadata = participants.find(u => u.id === msg.userId);
            const color = metadata
              ? `rgb(${metadata.color[0]}, ${metadata.color[1]}, ${
                  metadata.color[2]
                })`
              : '#636363';
            const name = users.get(msg.userId);
            return (
              <div key={msg.date}>
                {(i === 0 || messages[i - 1].userId !== msg.userId) && (
                  <User color={color}>
                    {name}
                    {liveUserId === msg.userId && ' (you)'}
                    {!metadata && ' (left)'}
                  </User>
                )}
                <Message>
                  {msg.message.split('\n').map(m => (
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
      <ChatInput
        useCacheForDOMMeasurements
        height={height}
        value={message}
        onChange={handleChange}
        placeholder="Send a message..."
        onKeyDown={handleKeyDown}
        onHeightChange={(val: number) => setHeight(val)}
      />
    </Container>
  );
});
