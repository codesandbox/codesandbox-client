import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    margin: 0;
    background-color: ${theme.background};
    color: rgba(255, 255, 255, 0.8);
  `}
`;

export const Title = styled.h1`
  margin: 0;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  text-transform: uppercase;
`;

export const PoweredBy = styled.h2`
  margin-top: 0 !important;
  margin-bottom: 0;
  color: white;
  font-size: 1rem;
  font-weight: 400;
`;

export const Header = styled.div`
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  text-align: center;
`;

export const Division = styled.hr`
  height: 1px;
  margin: 0;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
`;

export const DisabledOverlay = styled.div`
  position: absolute;
  z-index: 20;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.25rem;
`;
