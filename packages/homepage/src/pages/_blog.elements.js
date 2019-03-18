import styled from 'styled-components';

export const Posts = styled.article`
  display: flex;
  align-items: flex-start;
  background: ${props => props.theme.background2};
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 30px;
`;

export const Subtitle = styled.h3`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 18px;
  line-height: 1.5;

  color: #b8b9ba;
`;

export const Title = styled.h2`
  font-family: 'Poppins';
  font-weight: 600;
  font-size: 30px;
  line-height: 1.5;

  color: #f2f2f2;
`;

export const Thumbnail = styled.img`
  margin-right: 23px;
`;

export const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 250px 1fr;
  grid-gap: 90px;
`;

export const Date = styled.span`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 12px;
  color: #b8b9ba;
  display: block;
`;

export const AuthorImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const Author = styled.h4`
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 18px;
  margin: 0;
  margin-left: 16px;

  color: #f2f2f2;
`;
