import { signInPageUrl } from '@codesandbox/common/es/utils/url-generator';
import { Element, Stack, ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Redirect } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { Content } from './Content';
import { Header } from './Header';
import { SIDEBAR_WIDTH, Sidebar } from './Sidebar';

const GlobalStyles = createGlobalStyle({
  body: { overflow: 'hidden' },
});

export const Dashboard: FunctionComponent = () => {
  const {
    state: { hasLogIn },
  } = useOvermind();

  if (!hasLogIn) {
    return <Redirect to={signInPageUrl()} />;
  }

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <GlobalStyles />
      <DndProvider backend={Backend}>
        <Stack
          direction="vertical"
          css={css({
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'sideBar.background',
            color: 'sideBar.foreground',
            width: '100vw',
            minHeight: '100vh',
          })}
        >
          <Header />
          <Stack css={{ flexGrow: 1 }}>
            <Sidebar
              css={css({
                // We set sidebar as absolute so that content can
                // take 100% width, this helps us enable dragging
                // sandboxes onto the sidebar more freely.
                position: 'absolute',
                borderRight: '1px solid',
                borderColor: 'sideBar.border',
                width: [0, 0, SIDEBAR_WIDTH],
                height: 'calc(100% - 48px)',
                flexShrink: 0,
                display: ['none', 'none', 'flex'],
              })}
            />

            <Element
              as="main"
              css={css({
                width: '100%',
                height: 'calc(100vh - 48px)',
                overflowY: 'scroll',
                paddingLeft: [0, 0, SIDEBAR_WIDTH],
              })}
            >
              <Content />
            </Element>
          </Stack>
        </Stack>
      </DndProvider>
    </ThemeProvider>
  );
};
