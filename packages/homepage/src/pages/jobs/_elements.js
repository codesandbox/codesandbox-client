import styled from 'styled-components';
import TeamMember from '../../components/TeamMember';

export const PageTitle = styled.h1`
  font-weight: 900;
  font-size: 48px;
  color: ${props => props.theme.homepage.white};
  margin-bottom: 40px;

  @media screen and (max-width: 900px) {
    text-align: center;
    font-size: 32px;
  }
`;

export const PageSubtitle = styled.h2`
  font-size: 23px;
  line-height: 1.5;
  color: ${props => props.theme.homepage.white};
  font-weight: bold;
  margin-bottom: 24px;
`;

export const TitleDescription = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 1.5;
  color: ${props => props.theme.homepage.white};
  margin-bottom: 120px;

  @media screen and (max-width: 900px) {
    font-size: 16px;
    margin-bottom: 40px;
  }
`;

export const Job = styled.li`
  list-style: none;
  font-size: 19px;
  line-height: 33px;
  height: 64px;
  color: ${props => props.theme.homepage.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  margin: 0;
  border-bottom: 1px solid #343434;
`;

export const Jobs = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: 50px;
  border-top: 1px solid #343434;
`;

export const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-gap: 100px;
  margin-bottom: 140px;

  @media screen and (max-width: 900px) {
    grid-template-columns: 1fr;
    justify-content: center;
    grid-gap: 40px;
  }
`;

export const ImageGallery = styled.div`
  margin-bottom: 140px;
  display: grid;
  grid-template-columns: 322px 304px 443px;
  grid-gap: 8;
  justify-content: center;

  section {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    align-items: stretch;
  }

  img {
    max-height: 100%;
  }

  @media screen and (max-width: 1200px) {
    grid-template-columns: 322px 304px;

    > img:last-child {
      display: none;
    }
  }

  @media screen and (max-width: 660px) {
    grid-template-columns: 322px;

    > img:nth-child(2) {
      display: none;
    }
  }
`;

export const TeamMemberRandom = styled(TeamMember).attrs(props => ({
  border: true,
  noHover: true,
  ...props,
}))`
  position: absolute;
  border-width: 2px;
  width: 55px;
  height: 55px;
  top: 450px;
  right: -64px;
  transform: rotate(26.25deg);
  opacity: 0.8;
  width: 70px;
  height: 70px;

  @media screen and (max-width: 970px) {
    display: none;
  }
`;
