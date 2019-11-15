import styled from 'styled-components';
import { HeroWrapper } from '../screens/home/hero/elements';
import { H2 } from '../components/Typography';
import Button from '../components/Button';

export const H6 = styled.h6`
  font-size: 19px;
  margin-bottom: 1rem;
  color: ${props => props.theme.homepage.white};
`;

export const CreateSandbox = styled(Button)`
  position: relative;
  top: 390px;
  z-index: 2;
  margin: auto;
  padding: 8px 21px;

  ${props => props.theme.breakpoints.md} {
    top: 2.5rem;
  }
`;

export const Title = styled(H2)`
  position: relative;
  top: 360px;
  z-index: 2;
  max-width: 547px;
  margin: auto;

  ${props => props.theme.breakpoints.md} {
    top: 0;
  }
`;

export const MacBookWrapper = styled(HeroWrapper)`
  margin-top: 0;
  overflow: visible;
  margin-bottom: 8rem;
  min-height: 60vh;

  ${props => props.theme.breakpoints.md} {
    min-height: auto;
  }
`;

export const Titles = styled.h3`
  font-style: normal;
  font-weight: 500;
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
  background: ${props => props.bg};
  border: 1px solid #242424;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 2.5rem 0;

  ${props => props.theme.breakpoints.md} {
    height: 250px;
  }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3.75rem;
  margin-bottom: 6.875rem;

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
