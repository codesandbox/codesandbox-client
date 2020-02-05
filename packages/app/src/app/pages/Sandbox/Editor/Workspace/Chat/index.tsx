import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { sortBy, takeRight } from 'lodash-es';

import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import {
  Collapsible,
  Text,
  Stack,
  Textarea,
  Element,
} from '@codesandbox/components';

const Container = styled(Stack)`
  min-height: 200px;
  max-height: 300px;
  padding: 0 ${props => props.theme.sizes[8]}px;
  overflow-y: auto;
`;

const Messages = styled.div`
  height: 100%;
  flex: 1;
`;

const Avatar = styled.img`
  ${({ theme, color }) => css`
    border-radius: ${theme.radii.medium}px;
    border: 1px solid ${color};
    width: ${theme.sizes[8]}px;
    height: ${theme.sizes[8]}px;
  `}
`;

export const Chat: React.FC = () => {
  const [value, setValue] = useState('');
  const { state, actions } = useOvermind();
  const messagesRef = useRef(null);
  const scrollDown = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };
  useEffect(scrollDown);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === ENTER && !e.shiftKey && value.trim() !== '') {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const { messages, users } = state.live.roomInfo.chat;
  const roomInfoUsers = state.live.roomInfo.users;

  const orderedMessages: (m: any) => any[] = m =>
    sortBy(takeRight(m, 100), 'date');

  const messageData = message => {
    const metadata = roomInfoUsers.find(u => u.id === message.userId);
    return {
      metadata,
      color: metadata
        ? `rgb(${metadata.color[0]}, ${metadata.color[1]}, ${metadata.color[2]})`
        : '#636363',
      name: users[message.userId],
    };
  };

  const isNotSameUser = (message, i) =>
    i === 0 || messages[i - 1].userId !== message.userId;

  return (
    <Collapsible defaultOpen title="Chat">
      <Container direction="vertical" ref={messagesRef}>
        <Messages>
          {messages.length > 0 ? (
            orderedMessages(messages).map((message, i) => {
              const { color, name, metadata } = messageData(message);
              return (
                <Element key={message.date}>
                  {isNotSameUser(message, i) && (
                    <Stack
                      paddingTop={2}
                      marginBottom={2}
                      align="center"
                      gap={2}
                    >
                      <Avatar
                        color={color}
                        alt={metadata.username}
                        src={metadata.avatarUrl}
                      />
                      <Text block weight="bold">
                        {name}
                      </Text>
                    </Stack>
                  )}
                  <Text
                    block
                    style={{
                      wordBreak: 'break-word',
                    }}
                    marginBottom={2}
                  >
                    {message.message.split('\n').map(m => (
                      <span key={m}>
                        {m}
                        <br />
                      </span>
                    ))}
                  </Text>
                </Element>
              );
            })
          ) : (
            <Text variant="muted">No messages, start sending some!</Text>
          )}
        </Messages>
        <Element marginTop={4}>
          <Textarea
            autosize
            style={{ height: 'auto', minHeight: 'auto' }}
            rows={1}
            value={value}
            onChange={handleChange}
            placeholder="Send a message..."
            onKeyDown={handleKeyDown}
          />
        </Element>
      </Container>
    </Collapsible>
  );
};
