import { css } from '@styled-system/css';
import React, { FunctionComponent, useEffect } from 'react';
import { Element, Button, ThemeProvider, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { Navigation } from '../Navigation';
import { Sadbox } from '../ErrorBoundary/CodeSadbox/Sadbox';

export const Phew: FunctionComponent = () => {
  const { genericPageMounted } = useActions();
  const { hasLogIn } = useAppState();

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  return (
    <ThemeProvider>
      <Element
        css={css({
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'grays.900',
          height: '100vh',
          width: '100vw',
          fontFamily: 'Inter, sans-serif',
          color: 'white',
        })}
      >
        <Element
          css={css({
            width: '100vw',
            position: 'absolute',
            top: 0,
          })}
        >
          <Navigation title="Phew" />
        </Element>
        <Sadbox scale={3} />
        <Text
          block
          weight="bold"
          size={7}
          marginBottom={6}
          marginTop={6}
          align="center"
          css={css({ maxWidth: '80%', marginX: 'auto' })}
        >
          Phew, that was a close one!
        </Text>
        <Text
          weight="bold"
          marginBottom={12}
          size={6}
          align="center"
          css={css({ maxWidth: '80%', marginX: 'auto' })}
        >
          The sandbox you tried to open is identified as a phishing site.
        </Text>
        <Text
          marginBottom={12}
          size={6}
          align="center"
          css={css({ maxWidth: '80%', marginX: 'auto' })}
        >
          Don&apos;t worry; we protected you!
        </Text>
        <a
          href="/"
          style={{
            textDecoration: 'none',
          }}
        >
          <Button
            css={css({
              width: 'auto',
            })}
          >
            Go to {hasLogIn ? 'Dashboard' : 'Homepage'}
          </Button>
        </a>
      </Element>
    </ThemeProvider>
  );
};
