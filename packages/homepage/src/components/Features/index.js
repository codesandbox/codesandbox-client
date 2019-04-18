import React from 'react';
import styled from 'styled-components';
import features from './list';
import media from '../../utils/media';

const Icon = styled.img`
  width: 41px;
  height: 48px;
  margin-right: 26px;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 60px;
  color: white;
  font-family: Poppins;
  font-weight: 600;

  ${media.tablet`
    grid-template-columns: repeat(2, 1fr);
  `};

  ${media.phone`
    grid-template-columns: repeat(1, 1fr);
  `};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h5`
  font-size: 30px;
  color: ${props => props.theme.lightText};
  margin: 0;
  padding: 0;
`;

const Link = styled.a`
  color: white;
`;

const Description = styled.p`
  font-weight: normal;
`;

export default ({ homepage = true }) => (
  <Grid>
    {features
      .filter(f => (homepage ? f.homepage === homepage : true))
      .map(feature => (
        <section>
          <Header>
            <Icon src={feature.icon} alt={feature.title} />
            <Title>{feature.title}</Title>
          </Header>
          <Description>{feature.description}</Description>
          <Link href={feature.link}>Learn how it works</Link>
        </section>
      ))}
  </Grid>
);
