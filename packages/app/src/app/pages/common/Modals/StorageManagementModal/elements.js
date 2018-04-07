import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background};
  width: 100%;
  padding-bottom: 2rem;
`;

export const JustifiedArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h2`
  font-weight: 500;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0 !important;
  font-size: 1.125rem;
  margin: 0;
  text-transform: uppercase;
`;

export const SubTitle = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  font-size: 0.875rem;
  padding: 2rem;
  margin-top: 0 !important;
  margin: 0;
  line-height: 1.4;
`;

export const Description = styled.div`
  margin: 0;
  padding-left: 2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
`;

export const Rule = styled.hr`
  border: none;
  height: 1px;
  outline: none;
  margin: 1rem 2rem;

  background-color: rgba(255, 255, 255, 0.1);
`;
