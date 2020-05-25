import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import {
  Stack,
  Column,
  Text,
  Link,
  Button,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { SkeletonCard } from 'app/pages/NewDashboard/Components/Sandbox/SandboxCard';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';

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
    <SelectionProvider
      sandboxes={[
        ...(sandboxes.TEMPLATE_START_PAGE || []),
        ...(sandboxes.RECENT_START_PAGE || []),
      ]}
    >
      <section style={{ position: 'relative' }}>
        <Stack justify="space-between" marginBottom={4}>
          <Text>Recently Used Templates</Text>
        </Stack>

        {sandboxes.TEMPLATE_START_PAGE ? (
          <SandboxGrid>
            {sandboxes.TEMPLATE_START_PAGE.map(({ sandbox }) => (
              <Column key={sandbox.id}>
                <Sandbox template sandbox={sandbox} />
              </Column>
            ))}
          </SandboxGrid>
        ) : (
          <SandboxGrid>
            {Array.from(Array(4).keys()).map(n => (
              <Column key={n}>
                <SkeletonCard />
              </Column>
            ))}
          </SandboxGrid>
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
          <SandboxGrid>
            <Column>
              <NewSandbox
                onClick={() => actions.modalOpened({ modal: 'newSandbox' })}
              />
            </Column>
            {sandboxes.RECENT_START_PAGE.map(sandbox => (
              <Column key={sandbox.id}>
                <Sandbox sandbox={sandbox} />
              </Column>
            ))}
          </SandboxGrid>
        ) : (
          <SandboxGrid
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
          </SandboxGrid>
        )}
      </section>
    </SelectionProvider>
  );
};

const NewSandbox = ({ onClick }) => (
  <Button
    variant="link"
    onClick={onClick}
    css={css({
      height: 240,
      fontSize: 3,
      backgroundColor: 'grays.700',
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      transition: 'all ease-in',
      transitionDuration: theme => theme.speeds[2],
      ':hover, :focus, :focus-within': {
        boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
      },
    })}
  >
    <Stack direction="vertical" align="center" gap={4}>
      <Icon name="plusInCircle" size={24} />
      <Text>New Sandbox</Text>
    </Stack>
  </Button>
);
