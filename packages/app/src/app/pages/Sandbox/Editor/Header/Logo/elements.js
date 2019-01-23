import styled from 'styled-components';

export const Container = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  margin-right: 1rem;

  padding: 0 calc(1rem + 1px);

  box-sizing: border-box;

  overflow: hidden;
  text-decoration: none;
`;

export const GithubContainer = styled.a`
  position: absolute;
  right: 1rem;
  top: 0;
  line-height: 3rem;
  vertical-align: middle;
  font-size: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  text-decoration: none;
`;
