import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 1rem 0;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

export const CenteredHeader = styled.th`
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;
  padding: 1rem 0;

  ${props =>
    props.supporter &&
    css`
      background-color: rgba(0, 0, 0, 0.3);
    `};
`;
