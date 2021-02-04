import React from 'react';
import styled from 'styled-components';

const CTA = styled.div`
  text-align: center;
  margin: 16rem auto;

  h3 {
    font-weight: normal;
    font-size: 23px;
    line-height: 27px;
    text-align: center;
    color: #999;
    margin: 1rem auto;
    max-width: 40rem;
  }

  a {
    background: #5962df;
    text-decoration: none;
    border-radius: 0.125rem;
    border: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    text-align: center;
    font-weight: 500;

    color: #fff !important;
    -webkit-transition: all 200ms ease;
    -webkit-text-decoration: none;
    transition: all 200ms ease;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    display: inline-block;
    min-width: 190px;
    margin: 1rem auto;
    padding: 8px 24px;
  }
`;

export default ({ link, title, subtitle, cta }) => (
  <CTA>
    <h1>{title}</h1>
    <h3>{subtitle}</h3>
    <a title={cta} href={link}>
      {cta}{' '}
    </a>
  </CTA>
);
