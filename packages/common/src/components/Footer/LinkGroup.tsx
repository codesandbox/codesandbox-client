import React from 'react';
import styled from 'styled-components';
import Link from './Link';
import media from '../../utils/media';

const Column = styled.div`
  width: calc(33% - 2rem);
  margin: 0 1rem;

  ${media.phone`
    width: 100%;
    margin-bottom: 1rem;
  `};
`;

const Title = styled.h5`
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.secondary};
`;

const List = styled.ul`
  color: rgba(255, 255, 255, 0.7);
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    a {
      transition: 0.3s ease color;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
`;

const LinkGroup = ({ id, title, links }) => (
  <Column as="nav" aria-labelledby={id}>
    <Title id={id}>{title}</Title>
    <List>
      {links.map(({ name, url, newTab = true }) => (
        <Link key={url} name={name} url={url} newTab={newTab} />
      ))}
    </List>
  </Column>
);

export default LinkGroup;
