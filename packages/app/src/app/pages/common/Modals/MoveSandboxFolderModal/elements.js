import styled, { css } from 'styled-components';

export const Block = styled.div`
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.9);
  padding: 1rem 1.5rem;

  font-size: 0.875rem;
  font-weight: 600;

  ${props =>
    props.right &&
    css`
      text-align: right;
    `};
`;

export const TeamContainer = styled.div`
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  padding-top: 0;
  margin-top: 1rem;
`;

export const TeamName = styled.div`
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  font-size: 0.875rem;
  margin: 1rem 1rem;
`;

export const CancelButton = styled.button`
  transition: 0.3s ease color;
  font-size: 0.875rem;
  margin-right: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  outline: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.secondary};
  }
`;
