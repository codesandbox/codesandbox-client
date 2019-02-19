import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql, Link } from 'gatsby';

import MaxWidth from 'common/components/flex/MaxWidth';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.background2};

  padding: 6rem 0;
`;

const Title = styled.h3`
  font-weight: 200;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: white;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 30px;
  align-items: center;
  margin-top: 60px;

  img {
    display: block;
    max-width: 80%;
    margin: auto;
  }
`;

const Button = styled(Link)`
  transition: 0.3s ease all;
  color: white;

  /* background-color: rgba(254, 143, 144, 1); */
  background-color: ${props => props.theme.secondary};
  text-decoration: none;
  padding: 0.5rem 12px;
  text-align: center;
  border-radius: 4px;
  display: block;
  width: 200px;

  margin: auto;
  margin-top: 3rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    box-shadow: 0 7px 12px rgba(0, 0, 0, 0.3);
  }
`;

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allUsersJson(filter: { pinned: { eq: true } }) {
          edges {
            node {
              id
              link
              logoURL
              link
              pinned
            }
          }
        }
      }
    `}
    render={({ allUsersJson: { edges } }) => (
      <Container>
        <MaxWidth width={1280}>
          <Title>Companies using CodeSandbox</Title>
          <Grid>
            {shuffleArray(edges).map(({ node: company }) => (
              <div>
                <a
                  href={company.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img height="150" src={company.logoURL} alt={company.name} />
                </a>
              </div>
            ))}
          </Grid>
          <Button to="/users">More Companies</Button>
        </MaxWidth>
      </Container>
    )}
  />
);
