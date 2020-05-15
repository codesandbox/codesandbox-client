import css from '@styled-system/css';
import { ThemeProvider, Element, Stack } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import React, { FunctionComponent, useEffect } from 'react';
import Media from 'react-media';
import {
  CreateSandbox,
  COLUMN_MEDIA_THRESHOLD,
} from 'app/components/CreateNewSandbox/CreateSandbox';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';

export const NewSandbox: FunctionComponent = () => {
  const {
    actions: { sandboxPageMounted },
  } = useOvermind();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <ThemeProvider theme={codesandboxBlack}>
      <Element
        css={css({
          width: '100vw',
          height: '100vh',
          backgroundColor: 'sideBar.background',
        })}
      >
        <Navigation title="New Sandbox" />
        <MaxWidth>
          <Element margin={6} style={{ height: '100%' }}>
            <Element marginTop={80}>
              <Stack align="center" justify="center">
                <Media query={`(min-width: ${COLUMN_MEDIA_THRESHOLD}px)`}>
                  {matches => (
                    <Element
                      style={{
                        maxWidth: '100%',
                        width: matches ? 1200 : 900,
                      }}
                      marginTop={8}
                    >
                      <CreateSandbox />
                    </Element>
                  )}
                </Media>
              </Stack>
            </Element>
          </Element>
        </MaxWidth>
      </Element>
    </ThemeProvider>
  );
};
