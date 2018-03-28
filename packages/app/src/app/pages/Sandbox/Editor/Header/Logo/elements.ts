import styled from 'app/styled-components';

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

export const Title = styled.span`
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  margin-left: calc(1rem + 1px);
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
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
