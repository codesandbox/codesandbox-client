import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Button, Grid, Column, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxCard } from '../../../Components/SandboxCard';

export const StartSandboxes = () => {
  const {
    actions,
    state: {
      user,
      dashboard: { startPageSandboxes, loadingPage },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getStartPageSandboxes();
  }, [actions.dashboard, user]);

  if (loadingPage) {
    return <Element>Loading</Element>;
  }

  return (
    <>
      <section>
        <Text marginBottom={4} block>
          Recently used Templates
        </Text>
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          {startPageSandboxes.templates.map(({ sandbox }) => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      </section>

      <section>
        <Text marginBottom={4} block>
          Your Recent Sandboxes
        </Text>
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          <Column>
            <Button
              variant="link"
              onClick={() => actions.modalOpened({ modal: 'newSandbox' })}
              css={css({
                height: 240,
                fontSize: 3,
                border: '1px solid',
                borderColor: 'grays.600',
                borderRadius: 'medium',
                transition: 'all ease-in',
                transitionDuration: theme => theme.speeds[2],
                ':hover, :focus': {
                  transform: 'scale(0.98)',
                },
              })}
            >
              New Sandbox
            </Button>
          </Column>
          {startPageSandboxes.recent.map(sandbox => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      </section>
    </>
  );
};
