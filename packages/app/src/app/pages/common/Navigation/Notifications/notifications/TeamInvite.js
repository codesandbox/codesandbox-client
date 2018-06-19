import React from 'react';
import styled from 'styled-components';

import { NotificationContainer } from '../elements';

const Container = NotificationContainer.extend`
  display: flex;
`;

const Image = styled.img`
  border-radius: 4px;
  width: 24px;
  height: 24px;
  margin-right: 1rem;
  margin-top: 0.25rem;
`;

const Buttons = styled.div`
  display: flex;
`;

const Button = styled.div`
  transition: 0.3s ease background-color;
  height: 36px;
  width: 100%;

  color: white;
  background-color: ${props =>
    props.decline ? props.theme.red : props.theme.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  &:hover {
    background-color: ${props =>
      props.decline
        ? props.theme.red.lighten(0.1)
        : props.theme.secondary.lighten(0.2)};
  }
`;

const W = styled.span`
  color: white;
`;

export default ({
  unread,
  teamId,
  teamName,
  userId,
  inviterName,
  inviterAvatar,
}) => (
  <div>
    <Container unread={unread}>
      <Image src={inviterAvatar} />
      <div>
        <W>{inviterName}</W> invited you to join team <W>{teamName}</W>
      </div>
    </Container>
    <Buttons>
      <Button decline>Decline</Button>
      <Button>Accept</Button>
    </Buttons>
  </div>
);
