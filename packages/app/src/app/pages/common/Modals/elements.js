import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background};
  padding: 1rem;
  padding-top: 0.75rem;

  margin: 0;
  color: rgba(255, 255, 255, 0.8);
`;

export const Heading = styled.h2`
  margin-top: 7px !important;
  font-weight: 400;
  color: white;
  font-size: 1.125rem;
`;

export const Explanation = styled.div`
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;
