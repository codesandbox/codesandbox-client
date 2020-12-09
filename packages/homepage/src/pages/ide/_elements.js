import styled, { css } from 'styled-components';
import { H2 } from '../../components/Typography';
import Button from '../../components/Button';
import Collaborate from '../../assets/icons/Collaborate';
import Terminal from '../../assets/icons/Terminal';
import Debug from '../../assets/icons/Debug';
import Heart from '../../assets/icons/Heart';
import Manage from '../../assets/icons/Manage';

export const H6 = styled.h6`
  font-size: 19px;
  margin-bottom: 1rem;
  color: ${props => props.theme.homepage.white};
`;

export const CreateSandbox = styled(Button)`
  position: relative;
  top: 220px;
  z-index: 2;
  margin: auto;
  font-size: 0.875rem;
  padding: 10px 25px;

  ${props => props.theme.breakpoints.md} {
    top: 2.5rem;
  }
`;

export const Title = styled(H2)`
  position: relative;
  top: 180px;
  z-index: 2;
  max-width: 547px;

  margin: auto;

  ${props => props.theme.breakpoints.md} {
    top: 0;
  }

  @media only screen and (max-width: 340px) {
    font-size: 1.7rem;
  }
`;

export const MacBookWrapper = styled.div`
  text-align: center;

  margin-top: 0;
  overflow: visible;
  margin-bottom: 8rem;

  ${props => props.theme.breakpoints.md} {
    min-height: auto;
  }
`;

export const Titles = styled.h3`
  font-weight: 900;
  font-size: 2rem;
  line-height: 38px;
  text-align: center;

  color: ${props => props.theme.homepage.white};
`;

export const Description = styled.h4`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;

  color: ${props => props.theme.homepage.white};
`;

export const ArtWorkWrapper = styled.div`
  height: 440px;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: url(${props => props.bg}) center;
  background-size: cover;
  border: 1px solid ${props => props.theme.homepage.grey};
  box-sizing: border-box;
  border-radius: 4px;
  margin: 2.5rem 0;

  img {
    max-height: 100%;
  }

  ${props => props.theme.breakpoints.md} {
    height: 250px;
  }

  ${props => props.theme.breakpoints.sm} {
    height: 150px;
  }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3.75rem;
  margin-bottom: 6.875rem;
  line-height: 1.5rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export const IconWrapper = styled.div`
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5rem 0;
`;

export const BigTitles = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 1.4375rem;
  line-height: 27px;
  margin-bottom: 2.5rem;
  text-align: center;

  color: ${props => props.theme.homepage.white};
`;

export const JoinTitle = styled(H2)`
  text-align: center;
  max-width: 547px;
  margin: auto;
  margin-bottom: 2.5rem;
  font-size: 36px;
  line-height: 43px;
`;

export const Wrapper = styled.div`
  margin-top: calc(6.875rem * 2);
`;

export const TweetsWrapper = styled.div`
  &:after {
    background: linear-gradient(90deg, rgba(4, 4, 4, 0) 0%, #040404 100%);
    width: 204px;
    content: '';
    height: 294px;
    right: 0;
    position: absolute;
    margin-top: 2rem;
    z-index: 10;

    ::-webkit-scrollbar {
      display: none;
      overflow-style: none;
    }

    ${props => props.theme.breakpoints.sm} {
      display: none;
    }
  }

  &:before {
    background: linear-gradient(90deg, rgba(4, 4, 4, 0) 0%, #040404 100%);
    transform: rotate(-180deg);
    width: 204px;
    content: '';
    height: 294px;
    left: 0;
    position: absolute;
    margin-top: 2rem;
    z-index: 10;

    ${props => props.theme.breakpoints.sm} {
      display: none;
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    width: 98vw;
    position: absolute;
    left: 0;
    margin-top: 2rem;
    overflow-x: scroll;

    &::-webkit-scrollbar {
      width: 0.5em;
      height: 0.5em;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 3px;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
    li {
      width: 442px;
      max-width: 80%;
      padding: 2.125rem;
      background: #151515;
      border: 1px solid ${props => props.theme.homepage.grey};
      box-sizing: border-box;
      border-radius: 4px;
      margin-right: 2rem;
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;

        img {
          width: 64px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
      }
    }
  }
`;

export const Quote = styled.div`
  font-family: Roboto;
  font-style: italic;
  font-weight: normal;
  font-size: 23px;
  line-height: 32px;

  color: ${props => props.theme.homepage.white};
`;

export const TweetAuthor = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 20px;
  margin-left: 1rem;

  color: ${props => props.theme.homepage.white};
`;

export const Join = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: calc(6.875rem * 2);

  button {
    top: 0;
    margin-bottom: 12rem;
  }
`;

const iconStyles = css`
  margin: auto;
  display: block;
  margin-bottom: 1rem;
`;

export const CollaborateIcon = styled(Collaborate)`
  ${iconStyles}
`;

export const TerminalIcon = styled(Terminal)`
  ${iconStyles}
`;

export const DebugIcon = styled(Debug)`
  ${iconStyles}
`;

export const HeartIcon = styled(Heart)`
  ${iconStyles}
`;

export const ManageIcon = styled(Manage)`
  ${iconStyles}
`;

export const Border = styled.div`
  position: absolute;
  background: ${props => props.theme.homepage.grey};
  width: 1200px;
  max-width: 80%;
  height: 1px;
  left: 50%;
  transform: translateX(-50%);
`;

export const ImageWrapper = styled.div`
  img {
    display: block;
    box-shadow: 0 -8px 120px #1d1d1d;
  }
`;
