import React from 'react';
import styled from 'styled-components';

export const HeroWrapper = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10rem 0 5rem 0;
  margin-bottom: 4rem;

  ${props => props.theme.breakpoints.md} {
    padding-top: 5rem;
  }

  > div {
    text-align: center;
    max-width: 80%;
    margin: auto;
  }

  ${props => props.theme.breakpoints.md} {
    > div {
      max-width: 90%;
    }
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  line-height: 57px;
  font-family: ${props => props.theme.homepage.appleFont};

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: 900;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2rem;
  }
`;

export const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.muted};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

export const TemplateList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &:after {
    content: '';
    flex: 1;
  }
`;

const TemplateWrapper = styled.li`
  list-style: none;
  text-align: left;

  padding: 1em;
  margin-bottom: 1rem;
  width: calc(((100% - 1rem * 3) / 4));

  border-radius: 4px;
  border: 1px solid ${props => props.theme.homepage.grey};

  transition: background 200ms ease;

  &:hover {
    background: #151515;
  }

  a {
    color: inherit;
    text-decoration: none;
    display: block;
  }
`;

const TemplateTitle = styled.h3`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 1rem;

  color: ${props => props.theme.homepage.white};
  margin: 0;
  margin-bottom: 0.5em;
`;

const TemplateDescription = styled.p`
  font-family: ${props => props.theme.homepage.appleFont};
  font-size: 0.8rem;

  color: #757575;
  margin: 0;
`;

export const TemplateItem = ({ alias, title, environment }) => (
  <TemplateWrapper>
    <a href={`https://codesandbox.io/s/${alias}`}>
      {/* <img src="" alt={`Template ${title}`} /> */}
      <TemplateTitle>{title}</TemplateTitle>
      <TemplateDescription>{environment}</TemplateDescription>
    </a>
  </TemplateWrapper>
);
