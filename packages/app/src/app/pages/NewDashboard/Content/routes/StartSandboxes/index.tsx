import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import {
  Stack,
  Grid,
  Column,
  Text,
  Link,
  Button,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import {
  SandboxCard,
  SkeletonCard,
} from 'app/pages/NewDashboard/Components/SandboxCard';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';

export const StartSandboxes = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.START_PAGE);
  }, [actions.dashboard]);

  return (
    <>
      <section style={{ position: 'relative' }}>
        <Stack justify="space-between" marginBottom={4}>
          <Text>Recently Used Templates</Text>
        </Stack>

        {sandboxes.TEMPLATE_START_PAGE ? (
          <Grid
            rowGap={6}
            columnGap={6}
            marginBottom={8}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            })}
          >
            {sandboxes.TEMPLATE_START_PAGE.map(({ sandbox }) => (
              <Column key={sandbox.id}>
                <SandboxCard template sandbox={sandbox} />
              </Column>
            ))}
          </Grid>
        ) : (
          <Grid
            rowGap={6}
            columnGap={6}
            marginBottom={8}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            })}
          >
            {Array.from(Array(4).keys()).map(n => (
              <Column key={n}>
                <SkeletonCard />
              </Column>
            ))}
          </Grid>
        )}
      </section>

      <section style={{ position: 'relative' }}>
        <Stack justify="space-between" align="center" marginBottom={4}>
          <Text>Your Recent Sandboxes</Text>
          <Link as={RouterLink} to="recent" size={3} variant="muted">
            Show more
          </Link>
        </Stack>

        {sandboxes.RECENT_START_PAGE ? (
          <Grid
            rowGap={6}
            columnGap={6}
            marginBottom={8}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            })}
          >
            <Column>
              <NewSandbox
                onClick={() => actions.modalOpened({ modal: 'newSandbox' })}
              />
            </Column>
            {sandboxes.RECENT_START_PAGE.map(sandbox => (
              <Column key={sandbox.id}>
                <SandboxCard sandbox={sandbox} />
              </Column>
            ))}
          </Grid>
        ) : (
          <Grid
            rowGap={6}
            columnGap={6}
            marginBottom={8}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            })}
          >
            <Column>
              <NewSandbox
                onClick={() => actions.modalOpened({ modal: 'newSandbox' })}
              />
            </Column>
            {Array.from(Array(7).keys()).map(n => (
              <Column key={n}>
                <SkeletonCard />
              </Column>
            ))}
          </Grid>
        )}
      </section>
    </>
  );
};

const NewSandbox = ({ onClick }) => (
  <Button
    variant="link"
    onClick={onClick}
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
    <Stack direction="vertical" align="center" gap={4}>
      <Icon name="plusInCircle" size={24} />
      <Text>New Sandbox</Text>
    </Stack>
  </Button>
);
