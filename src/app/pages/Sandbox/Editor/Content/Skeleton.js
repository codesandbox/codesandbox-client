import React from 'react';
import styled from 'styled-components';

import Fullscreen from 'app/components/flex/Fullscreen';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Centered from 'app/components/flex/Centered';

const Header = styled.div`
  position: absolute;
  top: 0;
  height: 3rem;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.background2};
  z-index: 40;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
`;

export default () =>
  <Fullscreen>
    <Header />
    <Centered horizontal vertical>
      <Title delay={0.6}>Loading Sandbox...</Title>
      <SubTitle delay={1}>Fetching git repository...</SubTitle>
    </Centered>
  </Fullscreen>;
