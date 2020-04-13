import styled from 'styled-components';

export const Header = styled.section`
  text-align: center;
  padding-top: 4rem;
  padding-right: 0px;
  padding-bottom: 8rem;
  padding-left: 0px;
  color: rgb(242, 242, 242);
  margin-bottom: 2rem;
`;

export const PageTitle = styled.h1`
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 5.5rem;
  letter-spacing: -0.02rem;
`;

export const PageSubtitle = styled.h3`
  font-size: 1.6rem;
  line-height: 1.2;
  font-weight: 400;
  padding: 0;
  margin: 0 0 1.0875rem;
}
`;

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 4rem;


  > div {
    transform: scale(1);
    transition: all 0.2s ease-in-out;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr;

    > div:first-child {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    > div:first-child .thumb {
      height: 24rem;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;

    > div:first-child {
      grid-column-start: 1;
      grid-column-end: 3;
    }

    > div:first-child .thumb {
      height: 20rem;
    }

    > div:nth-child(2) .thumb {
      height: 18rem;
  }

  > div :hover {
    transform: scale(0.98);
    box-shadow:0 .125rem .5rem rgba(0,0,0,0.25);
  }
`;

export const Wrapper = styled.div`
  border: 1px solid #242424;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.5);
  overflow: hidden;
  border-radius: 0.5rem;
  clip-path: inset(0px round 0.5rem);
  background: #151515;
`;

export const CardContent = styled.div`
  padding: 1.5rem 1rem 1rem 1rem;
`;

export const Thumbnail = styled.div`
  border: none;
  border-bottom: 1px solid #242424;
  min-width: 100%;
  min-height: 20rem;
  background-size: cover;
  background-position: center center;

  @media screen and (min-width: 765px) {
    min-height: 10rem;
  }

  @media screen and (min-width: 1200px) {
    min-height: 10rem;
  }
`;

export const Posts = styled.article``;

export const Title = styled.h2`
  color: #fff;
  font-size: 19px;
  line-height: 1.5;
  font-weight: 500;
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
`;

export const PublishDate = styled.p`
  color: #9999;
  font-size: 1rem;
  line-height: 1;
  font-weight: 300;
`;
