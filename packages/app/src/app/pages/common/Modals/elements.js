import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme['sideBar.background']};
  color: ${props =>
    props.theme.light ? props.theme.black : props.theme.white};

  padding: 1rem;
  padding-top: 0.75rem;

  margin: 0;
`;

export const Heading = styled.h2`
  margin-top: 7px !important;
  font-weight: 400;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 1.125rem;
`;

export const Explanation = styled.div`
  line-height: 1.4;
  margin-bottom: 0.5rem;
`;
