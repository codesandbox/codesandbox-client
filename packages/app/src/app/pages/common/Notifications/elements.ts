import styled, { injectGlobal } from 'app/styled-components';

injectGlobal`
  .notifications-leave {
    opacity: 1;
  }

  .notifications-leave.notifications-leave-active  {
    transition: all 300ms ease;
    opacity: 0.01;
  }
`;

export const NotificationContainer = styled.div`
  position: fixed;
  right: 24px;
  bottom: 0;
  z-index: 41;
`;
