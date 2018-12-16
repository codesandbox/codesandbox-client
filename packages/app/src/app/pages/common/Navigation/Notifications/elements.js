import styled, { css } from 'styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export const Container = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  text-align: left;
  line-height: 1.6;
  width: 358px;
  z-index: 10;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;

  border-radius: 2px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);

  background-color: ${props => props.theme.background};
`;

export const NotificationsContainer = styled.div`
  color: rgba(255, 255, 255, 0.6);
  max-height: 500px;
  overflow-y: auto;
`;

export const NoNotifications = styled.div`
  padding: 0.75rem 1rem;
`;

export const Loading = styled.div`
  ${delayEffect(1)};

  padding: 0.75rem 1rem;
`;

export const Title = styled.div`
  color: white;
  padding: 0.75rem 1rem;

  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
`;

export const NotificationContainer = styled.div`
  transition: 0.3s ease border-color;
  padding: 0.75rem 1rem;

  border-left: 2px solid transparent;

  ${props =>
    props.read
      ? css`
          border-color: rgba(0, 0, 0, 0.3);
          opacity: 0.6;
        `
      : css`
          border-color: ${props.theme.secondary.clearer(0.2)()};

          &:hover {
            border-color: ${props.theme.secondary()};
          }
        `};

  ${props =>
    props.success &&
    css`
      border-color: ${props.theme.green.clearer(0.2)()};

      &:hover {
        border-color: ${props.theme.green()};
      }
    `};
`;

export const NotificationImage = styled.img`
  border-radius: 4px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  margin-right: 1rem;
  margin-top: 0.25rem;
`;
