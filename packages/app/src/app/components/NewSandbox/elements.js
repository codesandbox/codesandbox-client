import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Row from 'common/components/flex/Row';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
`;

export const RowContainer = styled(Row)`
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 1.5rem;
  flex-wrap: wrap;
  &:last-of-type {
    padding-bottom: 1.5rem;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: 0.3s ease all;
  opacity: 0.8;

  padding: 1.5rem 0;

  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

export const Text = styled.div`
  margin-top: 1rem;
`;

export const LogoLink = styled(Link)`
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  width: 140px;
  margin: 0 1rem;
`;
