import styled from 'styled-components';

// header

export const Header = styled.section`
  text-align: center;
  padding: 4rem 0;
  color: #f2f2f2;
  margin-bottom: 8rrem;
`;

export const PageTitle = styled.h1`
  font-weight: 500;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 5.5rme;
  letter-spacing: -0.02rem;
`;

export const PageSubtitle = styled.h2`
  font-size: 2rem;
  font-weight: 400;
`;

export const Posts = styled.article`
  maxwidth: 768px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 2rem;
  padding: 0 0 8rem 0;
  padding: 4rem 0;
  border-bottom: 1px solid #242424;
  &:last-child {
    border: none;
  }
`;

export const Aside = styled.aside`
  font-size: 1rem;
  font-stretch: normal;
  font-style: normal;
  font-variant-caps: normal;
  font-weight: 500;
  line-height: 18px;
  color: #757575;
  margin-bottom: 2rem;
`;

export const Thumbnail = styled.img`
  margin-bottom: 2rem;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
`;

export const Posstitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0 0 0.25em 0;
`;

export const Post = styled.p`
  font-size: 1.1rem;
  line-height: 1.6rem;
  margin-top: 0.8em;
  margin-bottom: 1.2rem;
`;
