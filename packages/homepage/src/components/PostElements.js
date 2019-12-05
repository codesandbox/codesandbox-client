import styled from 'styled-components';

export const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

export const Title = styled.h2`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.2;
  margin-bottom: 1rem;

  color: #f2f2f2;
`;

export const PostDate = styled.span`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 500;
  font-size: 14px;
  color: #b8b9ba;
  display: block;
  margin-bottom: 0.5rem;
`;

export const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-right: 1rem;
`;

export const Author = styled.h4`
  font-family: ${props => props.theme.homepage.appleFont};
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  color: #f2f2f2;
`;
