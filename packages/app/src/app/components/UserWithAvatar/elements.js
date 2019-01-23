import styled, { css } from 'styled-components';

export const CenteredText = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const AuthorName = styled.span`
  display: inline-flex;
  align-items: center;
  margin: 0 0.75em;

  ${props =>
    props.useBigName &&
    css`
      margin: 0 0.75em;
      font-size: 1rem;
    `};
`;

export const Names = styled.div`
  display: inline-flex;

  flex-direction: column;
`;

export const Username = styled.div`
  ${props =>
    props.hasTwoNames &&
    css`
      opacity: 0.7;
      font-size: 0.75em;
    `};
`;

export const Image = styled.img`
  width: 1.75em;
  height: 1.75em;
  border-radius: 8px;
`;
