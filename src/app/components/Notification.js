import React from 'react';
import styled from 'styled-components';
import CloseIcon from 'react-icons/lib/md/close';
import InfoIcon from 'react-icons/lib/md/info';
import ErrorIcon from 'react-icons/lib/md/error';
import WarningIcon from 'react-icons/lib/md/warning';

import theme from '../../common/theme';

import type { NotificationButton } from '../store/notifications/reducer';

const Container = styled.div`
  position: relative;
  width: 300px;
  height: 50px;

  color: white;
  border-radius: 2px;
  box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  border-left: 2px solid transparent;
  border-color: ${props => {
  if (props.type === 'error') return theme.red.darken(0.2)();
  if (props.type === 'warning') return theme.primary.darken(0.2);
  if (props.type === 'success') return theme.green();
  return theme.secondary;
}}

  background-color: ${() => theme.background2.darken(0.2)()};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
  verical-align: middle;
  line-height: 1;
  box-sizing: border-box;
  color: ${() => theme.white()};
  font-size: 1rem;
`;

const Title = styled.span`
  display: inline-block;
  font-weight: 400;
  margin: 0;
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
    ${props => {
  if (props.type === 'error') return theme.redBackground.lighten(0.2);
  if (props.type === 'warning') return theme.primary.darken(0.5);
  return theme.secondary.darken(0.1);
}};
  font-weight: 500;

  &:hover {
    background-color:
      ${props => {
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
  title: string,
  body: string,
  type: string,
  buttons: Array<NotificationButton>,
  close: () => void,
};

const getIcon = type => {
  if (type === 'error') return <ErrorIcon />;
  if (type === 'warning') return <WarningIcon />;
  return <InfoIcon />;
};

export default ({ title, type, buttons = [], close }: Props) => (
  <Container type={type}>
    <CloseIconHandler>
      <CloseIcon onClick={close} />
    </CloseIconHandler>
    <Content>
      {getIcon(type)}&nbsp;&nbsp;
      <Title>{title}</Title>
    </Content>
    <Buttons>
      {buttons.map((button: NotificationButton) => (
        <Button key={button.title} type={type} onClick={button.action}>
          {button.title}
        </Button>
      ))}
    </Buttons>
  </Container>
);
