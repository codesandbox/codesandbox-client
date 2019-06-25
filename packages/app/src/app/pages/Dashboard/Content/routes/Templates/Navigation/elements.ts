import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NavigationLink = styled(Link)`
  margin-right: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: 0.3s ease color;
  font-size: 1.25rem;
  margin-left: 0;
  color: white;

  &:last-child {
    margin-right: 0;
  }
`;

export const Number = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.5rem;
`;
