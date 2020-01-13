import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NavigationTitle = styled.h2`
  display: inline-flex;
  margin-right: 0.5rem;
  text-decoration: none;
  transition: 0.3s ease color;
  font-size: 1.25rem;
  margin-left: 0;
  color: white;
  margin-top: 0;
  margin-bottom: 0;
  font-weight: 400;

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
