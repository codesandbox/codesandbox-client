import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Button, Grid, Column } from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxCard } from 'app/pages/NewDashboard/Components/SandboxCard';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';

export const StartSandboxes = () => {
  const {
    actions,
    state: {
      dashboard: { startPageSandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getStartPageSandboxes();
  }, [actions.dashboard]);

  return (
    <>
      <section style={{ position: 'relative' }}>
        <Text marginBottom={4} block>
          Recently used Templates
        </Text>
        {startPageSandboxes.templates ? (
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
                <SandboxCard template sandbox={sandbox} />
              </Column>
            ))}
          </Grid>
        ) : (
          <Loading />
        )}
      </section>

      <section style={{ position: 'relative' }}>
        <Text
          marginBottom={4}
          block
          css={css({ position: 'relative', zIndex: 99 })}
        >
          Your Recent Sandboxes
        </Text>
        {startPageSandboxes.recent ? (
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
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};
