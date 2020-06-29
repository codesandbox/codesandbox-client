import css from '@styled-system/css';
import { ThemeProvider, Element, Stack } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import Media from 'react-media';
import {
  CreateSandbox,
  COLUMN_MEDIA_THRESHOLD,
} from 'app/components/CreateNewSandbox/CreateSandbox';
import { useOvermind } from 'app/overmind';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import { ContentSkeleton } from '../Sandbox/Editor/Skeleton';
import { Header } from '../Sandbox/Editor/Header';
import { Navigation as SideNav } from '../Sandbox/Editor/Navigation';

export const NewSandbox: FunctionComponent = () => {
  const {
    actions: { sandboxPageMounted },
  } = useOvermind();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <ThemeProvider>
      <Element
        css={css({
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        })}
      >
        <Element
          css={css({
            background: 'rgba(0,0,0,0.4)',
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            zIndex: 1,
          })}
        />
        <Element css={css({ pointerEvents: 'none', opacity: 0.8 })}>
          <Header />
          <Stack>
            <SideNav topOffset={48} bottomOffset={0} />
            <ContentSkeleton
              style={{
                opacity: 1,
                zIndex: 0,
                top: 48,
                left: 57,
                width: 'calc(100vw - 57px)',
              }}
            />
          </Stack>
        </Element>
        <MaxWidth>
          <Element margin={6} style={{ height: '100%' }}>
            <Element marginTop={80}>
              <Stack align="center" justify="center">
                <Media query={`(min-width: ${COLUMN_MEDIA_THRESHOLD}px)`}>
                  {matches => (
                    <Element
                      css={css({
                        backgroundColor: 'sideBar.background',
                        maxWidth: '100%',
                        width: matches ? 1200 : 900,
                        position: 'relative',
                        zIndex: 2,
                      })}
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
