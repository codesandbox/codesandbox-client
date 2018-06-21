import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Items = styled.div`
  margin-top: 1.5rem;
  width: 100%;
`;

export const CategoryHeader = styled(Link)`
  display: block;
  transition: 0.3s ease color;

  margin-bottom: 0.75rem;
  margin-left: 1rem;
  padding-top: 1rem;
  text-transform: uppercase;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-weight: 600;

  &:hover {
    color: white;
  }
`;
