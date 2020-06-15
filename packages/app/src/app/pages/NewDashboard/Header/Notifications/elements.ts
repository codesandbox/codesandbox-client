import styled, { css } from 'styled-components';

export const NotificationContainer = styled.div<{
  read?: boolean;
  success?: boolean;
}>`
  transition: 0.3s ease all;
  padding: 0.75rem 1rem;

  border-left: 2px solid transparent;

  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  ${props =>
    props.read
      ? css`
          border-left-color: transparent;

          &:hover {
            background-color: ${props.theme.background2};
          }
        `
      : css`
          border-left-color: ${props.theme.secondary.clearer(0.3)()};

          &:hover {
            border-left-color: ${props.theme.secondary()};
            background-color: ${props.theme.background2};
          }
        `};

  ${props =>
    props.success &&
    css`
      border-left-color: ${props.theme.green.clearer(0.2)()};

      &:hover {
        border-left-color: ${props.theme.green()};
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
