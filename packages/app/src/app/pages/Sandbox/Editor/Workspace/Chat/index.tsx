import React, { useState, useEffect, useRef } from 'react';
import styled, { css as c } from 'styled-components';
import { sortBy, takeRight } from 'lodash-es';

import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';
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
  padding: 0 ${props => props.theme.sizes[2]}px;
  overflow-y: auto;
`;

const Messages = styled.div`
  height: 100%;
  flex: 1;
`;

const Avatar = styled.img`
  ${({
    theme,
    color,
    noUser,
  }: {
    theme: any;
    color: string;
    noUser?: boolean;
  }) => c`
    border-radius: ${theme.radii.medium}px;
    border: 1px solid ${color};
    width: ${theme.sizes[8]}px;
    height: ${theme.sizes[8]}px;

    ${
      noUser &&
      c`
      background-position-x: -1px;
    background-image: url('data:image/svg+xml,%3Csvg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cg opacity="0.2"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M21.0015 11.452C21.0015 12.4269 20.6545 13.3895 20.2444 14.1227C20.1513 14.2892 20.319 14.5705 20.487 14.8523C20.6714 15.1617 20.8563 15.4717 20.6969 15.6311C20.2605 16.0674 19.2293 16.0154 18.3942 15.9532C17.846 16.433 17.1851 16.7132 16.4738 16.7132C15.6737 16.7132 14.9375 16.3588 14.3535 15.7645C14.1934 15.8387 14.0338 15.9128 13.876 15.9883C12.6355 15.8237 11.8695 13.7817 12.1652 11.4272C12.4609 9.07269 13.7063 7.29741 14.9468 7.46197C15.2309 7.52309 15.4882 7.60195 15.7211 7.69552C16.2541 7.25516 16.887 7 17.5658 7C19.4633 7 21.0015 8.99325 21.0015 11.452ZM10.0533 24.5705L22.4514 24.5705C22.4514 24.5705 23.3477 18.5865 16.1777 18.4297C9.00769 18.2729 10.0533 24.5705 10.0533 24.5705Z" fill="white"/%3E%3C/g%3E%3C/svg%3E%0A');
    `
    }

  `}
`;

export const Chat: React.FC = () => {
  const [value, setValue] = useState('');
  const state = useAppState();
  const actions = useActions();
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

  const isLight = theme => theme.vscodeTheme.type === 'light';

  return (
    <Collapsible
      css={css(theme => ({
        borderTop: '1px solid',
        borderColor: 'sideBar.border',
        boxShadow: isLight(theme)
          ? '0px -8px 8px rgba(255,255,255,0.24), 0px -4px 8px rgba(255,255,255,0.4)'
          : '0px -8px 8px rgba(0,0,0,0.24), 0px -4px 8px rgba(0,0,0,0.4)',
      }))}
      defaultOpen
      title="Chat"
    >
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
                      css={css({
                        opacity: metadata ? 1 : 0.2,
                      })}
                    >
                      {metadata ? (
                        <Avatar
                          color={color}
                          alt={metadata.username}
                          src={metadata.avatarUrl}
                        />
                      ) : (
                        <Avatar noUser as="div" color={color} />
                      )}
                      <Text block weight="bold">
                        {name}
                      </Text>
                    </Stack>
                  )}
                  <Text
                    block
                    css={css({
                      opacity: metadata ? 1 : 0.2,
                      wordBreak: 'break-word',
                    })}
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
