import styled, { css } from 'styled-components';

export const Container = styled.div`
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  overflow: auto;
  max-height: 100%;
`;

export const Title = styled.h1`
  display: inline-block;
  font-weight: 600;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: 1rem;
  flex: 1;
`;

export const Description = styled.p`
  font-size: 1;
  line-height: 1.4;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
`;

export const Icon = styled.div<{ disabled?: boolean }>`
  transition: 0.3s ease color;
  margin: 0.5rem;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 1.25rem;

  cursor: pointer;

  &:hover {
    color: white;
  }

  ${props =>
    props.disabled &&
    css`
      color: rgba(255, 255, 255, 0.5);
      cursor: initial;

      &:hover {
        color: rgba(255, 255, 255, 0.5);
      }
    `};
`;
