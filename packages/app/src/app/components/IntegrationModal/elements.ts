import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background};
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 1.25rem;
  color: white;
  margin: 0;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

export const PoweredBy = styled.h2`
  font-weight: 400;
  font-size: 1rem;
  color: white;
  margin-top: 0 !important;
  margin-bottom: 0;
`;

export const Header = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const Division = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 0;

  background-color: rgba(255, 255, 255, 0.1);
`;

export const DisabledOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  margin: 0 auto;
  color: white;
  font-size: 1.25rem;
  z-index: 20;
`;
