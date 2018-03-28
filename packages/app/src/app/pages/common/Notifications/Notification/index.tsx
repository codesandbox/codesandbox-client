import * as React from 'react';

import CloseIcon from 'react-icons/lib/md/close';
import InfoIcon from 'react-icons/lib/md/info';
import ErrorIcon from 'react-icons/lib/md/error';
import WarningIcon from 'react-icons/lib/md/warning';
import { NotificationType, NotificationButton } from 'app/store/types'
import {
  Container,
  Content,
  Title,
  Buttons,
  Button,
  CloseIconHandler
} from './elements';

function getIcon(type) {
  if (type === 'error') return <ErrorIcon />;
  if (type === 'warning') return <WarningIcon />;
  return <InfoIcon />;
}

type Props = {
  title: string
  type: NotificationType
  buttons: NotificationButton[]
  close: () => void
}

const  Notification: React.SFC<Props> = ({ title, type, buttons = [], close }) => {
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
