import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

// TODO: Use withoutProps utility from common once Follow Templates is merged
//       to remove the DOM error for teamId prop
export const NavigationLink = styled(Link)`
  transition: 0.3s ease color;
  margin-right: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: white;
  }

  &:last-child {
    margin-right: 0;
  }

  margin-left: 0.5rem;
  &:first-of-type {
    margin-left: 0;
  }

  &:last-of-type {
    color: white;
  }

  &::after {
    content: '›';
  }
  &:last-of-type::after {
    content: none;
  }
`;
