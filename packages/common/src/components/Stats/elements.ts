import styled, { css } from 'styled-components';

export const Stats = styled.div<{ vertical: boolean }>`
  display: flex;

  ${props =>
    props.vertical
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
          align-items: center;
        `};

  height: 100%;
`;
