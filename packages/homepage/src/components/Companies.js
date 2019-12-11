import React from 'react';
import styled from 'styled-components';
import shuffleArray from '../utils/shuffleArray';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 30px;
  align-items: center;
  margin-top: 60px;
  margin-left: 0;
  list-style: none;

  img {
    display: block;
    max-width: 80%;
    margin: auto;
  }
`;

export default ({ companies }) => (
  <Grid>
    {shuffleArray(companies).map(({ node: company }) => (
      <li>
        <a
          href={company.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${company.name} is using CodeSandbox`}
        >
          <img
            height="150"
            src={company.logoURL}
            alt={company.name}
            loading="lazy"
          />
        </a>
      </li>
    ))}
  </Grid>
);
