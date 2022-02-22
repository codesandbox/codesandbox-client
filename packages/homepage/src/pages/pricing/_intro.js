import React from 'react';
import styled from 'styled-components';

import { Title, SubTitle } from './_elements';
import privateIcon from './assets/private.svg';
import exportIcon from './assets/export.svg';
import userIcon from './assets/user.svg';

const Caption = styled.p`
  color: #dcff50;
  font-size: 32px;
  font-family: 'TWKEverett', sans-serif;
  font-weight: 500;
`;

const GridItem = styled.div``;

const Grid = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 96px;

  ${GridItem} {
    width: calc(100% / 3 - 5.4em);
  }
`;

const Icon = styled.div`
  background: #191919;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  display: flex;
  margin-bottom: 24px;

  img {
    margin: auto;
  }
`;

export const Intro = () => {
  return (
    <>
      <Caption>CodeSandbox Pro</Caption>
      <Title>Everything you love about CodeSandbox, but make it Pro</Title>

      <Grid>
        <GridItem>
          <Icon>
            <img src={privateIcon} alt="private npm packages" />
          </Icon>
          <SubTitle>
            Use private NPM packages and manage advanced permissions options
          </SubTitle>
        </GridItem>

        <GridItem>
          <Icon>
            <img src={exportIcon} alt="storage" />
          </Icon>
          <SubTitle>
            Go bigger and bolder with 500MB of storage and 30MB upload speed
          </SubTitle>
        </GridItem>

        <GridItem>
          <Icon>
            <img src={userIcon} alt="pricing" />
          </Icon>
          <SubTitle>
            Choose between different pricing and plans to suit your needs and
            budget
          </SubTitle>
        </GridItem>
      </Grid>
    </>
  );
};
