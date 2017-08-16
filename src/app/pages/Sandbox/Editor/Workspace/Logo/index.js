// @flow
import * as React from 'react';
import styled, { injectGlobal } from 'styled-components';

import GithubIcon from 'react-icons/lib/go/mark-github';

import Relative from 'app/components/Relative';
import LogoIcon from 'app/components/Logo';
import Tooltip from 'app/components/Tooltip';
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

const GithubContainer = styled.a`
  position: absolute;
  right: 1rem;
  top: 0;
  line-height: 3rem;
  vertical-align: middle;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
`;

export default class Logo extends React.PureComponent<{}> {
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
      <Relative>
        <Container id="release" ref={this.setupHeadway} href="/">
          <div style={{ position: 'relative', display: 'flex' }}>
            <LogoIcon width={30} height={30} />
          </div>
          <Title>CodeSandbox</Title>
        </Container>

        <GithubContainer
          href="https://github.com/CompuIves/codesandbox-client"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Tooltip title="View source">
            <GithubIcon />
          </Tooltip>
        </GithubContainer>
      </Relative>
    );
  }
}
