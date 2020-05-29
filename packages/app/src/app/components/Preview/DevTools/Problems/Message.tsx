import theme from '@codesandbox/common/es/theme';
import { actions, dispatch } from 'codesandbox-api';
import React from 'react';
import { MdError, MdInfo, MdWarning } from 'react-icons/md';

import {
  MessageContainer,
  MessageIconContainer,
  MessageSource,
} from './elements';
import { MessageType } from '.';

export interface Props {
  message: MessageType;
}

function getIcon(type: 'notice' | 'warning' | 'error') {
  if (type === 'error') {
    return { Icon: MdError, color: theme.red() };
  }
  if (type === 'warning') {
    return { Icon: MdWarning, color: theme.primary() };
  }

  return { Icon: MdInfo, color: theme.secondary() };
}

export function ProblemMessage({ message }: Props) {
  const { Icon, color } = getIcon(message.severity);

  return (
    <MessageContainer
      onClick={() => {
        dispatch(
          actions.editor.openModule(message.path, message.line, message.column)
        );
      }}
    >
      <MessageIconContainer style={{ color }}>
        <Icon />
      </MessageIconContainer>
      <div>{message.message}</div>
      {message.source && <MessageSource>{message.source}</MessageSource>}
    </MessageContainer>
  );
}
