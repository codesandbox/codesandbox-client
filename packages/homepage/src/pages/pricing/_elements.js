import styled from 'styled-components';

export const Card = styled.div`
  width: 100%;
  height: 30rem;

  background: ${props => (props.dark ? '#151515' : props.theme.homepage.blue)};
  border-radius: 0.25rem;
  padding: 2.5rem;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTitle = styled.h3`
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  color: ${props => props.theme.homepage.white};
`;

export const Price = styled.h6`
  font-weight: 500;
  font-size: 2.25rem;
  text-align: center;

  color: ${props => props.theme.homepage.white};
`;

export const List = styled.ul`
  list-style: none;
  margin: 0;
  font-style: normal;
  font-size: 1.4rem;
  text-align: left;
  color: ${props => props.theme.homepage.muted};
  margin-top: 3rem;
  margin-left: 1rem;

  li span {
    color: ${props => props.theme.homepage.white};
  }
`;

export const Button = styled.a`
  height: 2.75rem;
  text-decoration: none;
  background: ${props => props.theme.homepage.grey};
  border-radius: 0.125rem;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.homepage.white};
  transition: all 200ms ease;

  ${props =>
    props.white &&
    `
    background: ${props.theme.homepage.white};
    color: ${props.theme.homepage.blue};
  `}

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1.05);
  }

  &:focus {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    transform: scale(1);
  }
`;

export const FeaturesTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 11.875rem 11.875rem;
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;

  color: ${props => props.theme.homepage.white};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.homepage.grey};
  margin-top: 5rem;

  ${props =>
    props.inside &&
    `
    margin-left: 2.5rem;
  `}

  ${props => props.theme.breakpoints.md} {
    grid-template-columns: 1fr 5.625rem 3.75rem;
    font-size: 1rem;
    margin-left: 0 !important;
  }
`;

export const FeaturesTable = styled.ul`
  list-style: none;
  margin: 0;

  ${props =>
    props.inside &&
    `
    margin-left: 2.5rem;
  `}

  ${props => props.theme.breakpoints.md} {
    margin-left: 0 !important;
  }

  li {
    display: grid;
    grid-template-columns: 1fr 11.875rem 11.875rem;
    margin-bottom: 1rem;

    ${props => props.theme.breakpoints.md} {
      grid-template-columns: 1fr 3.75rem 3.75rem;
    }

    span {
      width: 100%;
      display: block;
      text-align: center;
      font-weight: 500;
      font-size: 1.4rem;

      ${props => props.theme.breakpoints.md} {
        font-size: 1rem;
      }
    }
  }
`;

export const FeatureTitle = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;

  color: ${props => props.theme.homepage.white};
  text-align: left !important;
  padding-bottom: 0.25rem;
`;

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 26rem 26rem;
  grid-template-areas:
    'free pro'
    'team team';
  grid-gap: 2rem;
  justify-content: center;
  margin-top: 4rem;

  ${props => props.theme.breakpoints.lg} {
    grid-template-columns: minmax(100%, 26rem);
    grid-template-areas:
      'free'
      'pro'
      'team';
  }
`;

export const FeaturesTitle = styled.h3`
  font-weight: 500;
  font-size: 2.25rem;

  color: ${props => props.theme.homepage.white};
  margin-bottom: 3.75rem;
  margin-top: 6rem;
`;
