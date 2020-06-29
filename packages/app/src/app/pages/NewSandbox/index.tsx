import css from '@styled-system/css';
import { ThemeProvider, Element, Stack } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import Media from 'react-media';
import {
  CreateSandbox,
  COLUMN_MEDIA_THRESHOLD,
} from 'app/components/CreateNewSandbox/CreateSandbox';
import { useOvermind } from 'app/overmind';

import { Navigation } from 'app/pages/common/Navigation';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import { ContentSkeleton } from '../Sandbox/Editor/Skeleton';
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
        })}
      >
        <Element
          css={css({
            'header > div': {
              maxWidth: '100%',
              width: '100%',
            },
          })}
        >
          <Navigation title="New Sandbox" />
        </Element>
        <Element css={css({ pointerEvents: 'none', opacity: 0.8 })}>
          <Stack>
            <SideNav topOffset={48} bottomOffset={0} />
            <ContentSkeleton
              style={{
                opacity: 1,
                zIndex: 0,
                top: 48,
                left: 57,
                width: 'calc(100vw - 57px)',
                height: 'calc(100vh - 48px)',
                overflow: 'hidden',
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
