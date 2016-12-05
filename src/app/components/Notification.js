import React from 'react';
import styled from 'styled-components';
import CloseIcon from 'react-icons/lib/md/close';

import theme from '../../common/theme';

import type { NotificationButton } from '../store/reducers/notifications';

const Container = styled.div`
  position: relative;
  width: 300px;
  height: 125px;

  color: white;
  border-radius: 3px;
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  background-color:
    ${(props) => {
      if (props.type === 'error') return theme.redBackground.lighten(0.5);
      if (props.type === 'warning') return theme.primary.darken(0.4);
      return theme.secondary;
    }};
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
  margin-bottom: 1rem;
`;

const Buttons = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex: auto;
`;

const Button = styled.div`
  transition: 0.3s ease all;
  position: relative;
  display: block;
  width: 100%;
  text-align: center;
  cursor: pointer;
  padding: 0.5rem;
  background-color:
    ${(props) => {
      if (props.type === 'error') return theme.redBackground.lighten(0.2);
      if (props.type === 'warning') return theme.primary.darken(0.5);
      return theme.secondary.darken(0.1);
    }};
  font-weight: 500;

  &:hover {
    background-color:
      ${(props) => {
        if (props.type === 'error') return theme.redBackground.lighten(0.1);
        if (props.type === 'warning') return theme.primary.darken(0.6);
        return theme.secondary.darken(0.2);
      }};
  }
`;

const CloseIconHandler = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  color: white;
  cursor: pointer;
`;

type Props = {
  title: string;
  body: string;
  type: string;
  buttons: Array<NotificationButton>;
  close: () => void;
};

export default ({ title, body, type, buttons = [], close }: Props) => (
  <Container type={type}>
    <CloseIconHandler>
      <CloseIcon onClick={close} />
    </CloseIconHandler>
    <Content>
      <Title>{title}</Title>
      <p>{body}</p>
    </Content>
    <Buttons>
      {buttons.map((button: NotificationButton) => (
        <Button key={button.title} type={type} onClick={button.action}>{button.title}</Button>
      ))}
    </Buttons>
  </Container>
);
