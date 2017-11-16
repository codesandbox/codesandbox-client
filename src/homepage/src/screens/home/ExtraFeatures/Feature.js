import React from 'react';
import styled from 'styled-components';

import media from '../../../utils/media';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  align-items: center;
  text-align: center;

  color: white;

  margin: 1rem;

  width: calc(25% - 2rem);

  ${media.tablet`
    width: calc(50% - 2rem);
  `};

  ${media.phone`
    width: 100%;
  `};

  svg {
    font-size: 2rem;
    color: #d3f2ff;

    font-weight: 400;
    line-height: 1.4;

    text-shadow: 0 1px 0px rgba(0, 0, 0, 0.3);
  }
`;

const Title = styled.div`
  font-size: 1.125rem;
  margin: 0.5rem 0;
`;

const Description = styled.div`
  color: #d3f2ff;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;

  text-shadow: 0 1px 0px rgba(0, 0, 0, 0.3);

  max-width: 100%; /* IE11 */

  a {
    color: white;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.secondary.lighten(0.2)()};
    }
  }
`;

const NewBadge = styled.div`
  position: absolute;
  top: -0.9rem;
  right: 5.2rem;
  padding: 0 5px;
  background-image: linear-gradient(
    45deg,
    ${props => props.theme.green} 0%,
    ${props => props.theme.green.darken(0.1)} 100%
  );
  font-weight: 700;
  font-size: 0.875rem;
  text-align: left;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
`;

const PatronBadge = styled.a`
  display: block;
  position: absolute;
  top: -0.9rem;
  right: 4.2rem;
  padding: 0 5px;
  background-image: linear-gradient(-225deg, #ffc766 0%, #f6b053 100%);

  font-size: 0.875rem;
  text-align: left;

  font-weight: 700;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  border-radius: 2px;

  text-decoration: none;
`;

export default ({ Icon, title, description, newFeature, patron }) => (
  <Container>
    <Icon />
    <Title>{title}</Title>
    {newFeature && <NewBadge>new</NewBadge>}
    {patron && (
      <PatronBadge href="/patron" target="_blank" rel="noopener noreferrer">
        patron
      </PatronBadge>
    )}
    <Description>{description}</Description>
  </Container>
);
