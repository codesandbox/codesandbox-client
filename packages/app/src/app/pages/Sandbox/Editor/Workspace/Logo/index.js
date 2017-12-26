import * as React from 'react';
import { injectGlobal } from 'styled-components';
import GithubIcon from 'react-icons/lib/go/mark-github';

import Relative from 'common/components/Relative';
import LogoIcon from 'common/components/Logo';
import Tooltip from 'common/components/Tooltip';
import theme from 'common/theme';

import { Container, Title, GithubContainer } from './elements';

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
