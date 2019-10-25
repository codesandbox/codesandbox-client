import React from 'react';
import styled from 'styled-components';
import HeroSmall from '../../assets/images/small-ide.png';
import Button from '../../components/Button';

const JoinWrapper = styled.section`
  margin-top: 13.5rem;
  display: grid;
  grid-template-columns: 1fr 615px;
  width: 100%;
  text-align: center;
  background: #151515;
  min-height: 322px;
  position: relative;
  align-items: center;
`;

const IDE = styled.img`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const Text = styled.h3`
  font-weight: 500;
  font-size: 36px;
  line-height: 43px;
  font-family: ${props => props.theme.homepage.appleFont};
  color: ${props => props.theme.homepage.white};
  max-width: 80%;
  margin: auto;
  margin-bottom: 2.5rem;
`;

const Join = () => (
  <JoinWrapper>
    <div>
      <Text>Join millions of people prototyping what’s next</Text>
      <Button href="/s">Create Sandbox, it’s free</Button>
    </div>
    <IDE src={HeroSmall} alt="safari with codesandbox" />
  </JoinWrapper>
);

export default Join;
