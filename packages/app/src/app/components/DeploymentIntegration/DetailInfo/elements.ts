import styled from 'styled-components';

export const Details = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  flex: 3;
  padding: 0.75rem 1rem;
  background-color: ${props => props.bgColor};
  margin-top: -1px;
`;

export const Heading = styled.div`
  color: ${props => (props.light ? 'rgba(0, 0, 0)' : 'rgba(255, 255, 255)')};
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

export const Info = styled.div`
  font-weight: 400;
  color: ${props => (props.light ? 'rgba(0, 0, 0)' : 'rgba(255, 255, 255)')};
`;
