import styled, { css } from 'styled-components';

// header

export const Header = styled.section`
  text-align: center;
  padding: 4rem 0 8rem 0;
  color: #f2f2f2;
  margin-bottom: 2rem;

  @media screen and (max-width: 768px) {
    padding: 4rem 0 2rem 0;
  }
`;

export const PageTitle = styled.h1`
  font-weight: 500;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 5.5rem;
  letter-spacing: -0.02rem;

  @media screen and (max-width: 768px) {
    font-size: 2.5rem;
    line-height: 3.5rem;
  }
`;

export const PageSubtitle = styled.h2`
  font-size: 2rem;
  font-weight: 400;

  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const Posts = styled.article`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-template-areas:
    'aside img'
    '. content';

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'aside'
      'img'
      'content';
  }

  grid-column-gap: 2rem;
  padding: 4rem 0 2rem 0;
  border-bottom: 1px solid #151515;
  &:last-child {
    border: none;
  }
`;

export const Aside = styled.aside`
  font-size: 1rem;
  font-stretch: normal;
  font-style: normal;
  font-variant-caps: normal;
  font-weight: 400;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.65);
  margin: 4rem 0 0 0;
  grid-area: aside;

  @media screen and (max-width: 768px) {
    margin: 0.25rem 0 2rem 0;
  }
`;

export const Thumbnail = styled.img`
  margin-bottom: 2rem;
  width: 100%;
  overflow: hidden;
  grid-area: img;
  clip-path: inset(0 0 0 0 round 0.5rem);
`;

export const Smallupdate = styled.div`
  background: #151515;
  text-align: center;
  justify-content: center;
  padding: 5rem 0;
  margin-bottom: 2rem;
  grid-area: img;
  font-size: 3rem;
  font-weight: 700;
  border: 1px solid #242424;
  border-radius: 0.25rem;

  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    padding: 3rem 0;
  }
`;

export const Postitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 200;
  margin: 2rem 0 0.5rem 0;
  color: #fff;

  > a {
    color: #fff;
    text-decoration: none;
  }
`;

export const listStyles = css`
  > ul,
  ol {
    padding: 0;
    margin: 1rem 0 3rem 0;
    color: rgba(255, 255, 255, 0.75);
  }

  > ul li,
  ol li {
    list-style: none;
    line-height: 2rem;
    padding: 0px 0px 0px 2rem;
    position: relative;
  }

  > ul li:before {
    content: ' ';
    background-image: url("data:image/svg+xml;utf8,<svg width='15' height='11' viewBox='0 0 15 11' xmlns='http://www.w3.org/2000/svg'><path id='mask' d='M2 6l3.5 3.5L13 2' stroke-width='2' stroke='%236cc7f6'  fill='none' stroke-linecap='round'/></svg>");
    height: 11px;
    width: 15px;
    left: 2px;
    top: 10px;
    position: absolute;
  }

  > ol li:before {
    content: '+ ';
    font-weight: 600;
    color: #5bc266;
    font-size: 19px;
    width: 10px;
    height: 10px;
    top: -1px;
    left: 5px;

    position: absolute;
  }

  > ul li a,
  ol li a {
    color: rgba(255, 255, 255, 1);
    text-decoration: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0);
    transition: all 100ms ease-in;
  }

  > ul li a:hover,
  ol li a:hover {
    border-bottom: 1px solid rgba(255, 255, 255, 1);
  }
`;

export const Post = styled.div`
  font-size: 1.1rem;
  line-height: 1.6rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 1.8em;
  margin-bottom: 2rem;
  grid-area: content;

  > p a {
    text-decoration: none;
  }

  > p {
    margin-bottom: 2rem;
  }

  > h3 {
    color: #fff;
    font-size: 19px;
    margin-top: 1rem;
  }

  > h4 {
    color: #fff;
    font-size: 19px;
    margin-top: 0rem;
  }

  > h5 {
    color: #fff;
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
  }

  > image {
    margin: 0;
  }

  ${listStyles}
`;
