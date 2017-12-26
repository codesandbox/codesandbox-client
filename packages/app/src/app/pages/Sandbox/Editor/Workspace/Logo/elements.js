import styled from 'styled-components';

export const Container = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  overflow: hidden;
  text-decoration: none;
`;

export const Title = styled.h1`
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  margin-left: 1rem;
  color: white;
`;

export const GithubContainer = styled.a`
  position: absolute;
  right: 1rem;
  top: 0;
  line-height: 3rem;
  vertical-align: middle;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
`;
