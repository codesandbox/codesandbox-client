// @flow
import React from 'react';
import styled, { injectGlobal } from 'styled-components';

import LogoIcon from 'app/components/Logo';
import theme from 'common/theme';

const Container = styled.a`
  display: flex;
  position: relative;
  align-items: center;
  color: ${props => props.theme.white};
  vertical-align: middle;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  overflow: hidden;
  text-decoration: none;
`;

const Title = styled.h1`
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
  margin-left: 1rem;
  color: white;
`;

export default class Logo extends React.PureComponent {
  setupHeadway = el => {
    if (el && window.Headway) {
      const config = {
        selector: '#release', // CSS selector where to inject the badge
        account: 'Jlv65x', // your account ID
      };
      window.Headway.init(config);

      // eslint-disable-next-line
      injectGlobal`
        #HW_badge {
          background: ${theme.secondary()} !important;
        }
        #HW_badge.HW_softHidden {
          background: #d4d4d4 !important;
        }
      `;
    }
  };

  render() {
    return (
      <Container id="release" ref={this.setupHeadway} href="/">
        <div style={{ position: 'relative', display: 'flex' }}>
          <LogoIcon width={30} height={30} />
        </div>
        <Title>CodeSandbox</Title>
      </Container>
    );
  }
}
