import React from 'react';

import CloseIcon from 'react-icons/lib/md/close';
import InfoIcon from 'react-icons/lib/md/info';
import ErrorIcon from 'react-icons/lib/md/error';
import WarningIcon from 'react-icons/lib/md/warning';

import {
  Container,
  Content,
  Title,
  Buttons,
  Button,
  CloseIconHandler,
} from './elements';

function getIcon(type) {
  if (type === 'error') return <ErrorIcon />;
  if (type === 'warning') return <WarningIcon />;
  return <InfoIcon />;
}

function Notification({ title, type, buttons = [], close }) {
  return (
    <Container type={type}>
      <CloseIconHandler>
        <CloseIcon onClick={close} />
      </CloseIconHandler>
      <Content>
        {getIcon(type)}&nbsp;&nbsp;
        <Title>{title}</Title>
      </Content>
      <Buttons>
        {buttons.map(button => (
          <Button key={button.title} type={type} onClick={button.action}>
            {button.title}
          </Button>
        ))}
      </Buttons>
    </Container>
  );
}

export default Notification;
