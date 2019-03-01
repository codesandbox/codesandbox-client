import styled, { css } from 'styled-components';

export const CenteredText = styled.div<{
  disableCenter: boolean;
  text: string;
}>`
  ${props =>
    !props.disableCenter &&
    css`
      justify-content: center;
    `};
  align-items: center;
  display: inline-flex;
  flex-direction: row;
  margin-bottom: 0.5rem;

  width: ${props => (props.text ? '10em' : '5em')};

  svg {
    opacity: 0.75;
    font-size: 1.125em;
  }
`;
