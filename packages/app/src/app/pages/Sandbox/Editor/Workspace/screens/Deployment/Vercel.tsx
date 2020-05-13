import React from 'react';
import {
  Element,
  Text,
  Link,
  Stack,
  Button,
  Integration,
  ListAction,
  ListItem,
  List,
} from '@codesandbox/components';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useOvermind } from 'app/overmind';
import { VercelIcon, VisitIcon, TrashIcon } from './icons';
import { State } from './elements';

export const Vercel = () => {
  const {
    actions: { modalOpened, deployment, signInVercelClicked },
    state: {
      deployment: { deploying, sandboxDeploys, deploysBeingDeleted },
      user: { integrations },
    },
  } = useOvermind();
  const { deploySandboxClicked, setDeploymentToDelete } = deployment;

  return (
    <Integration icon={VercelIcon} title="Vercel">
      {integrations.vercel ? (
        <>
          <Element marginX={2} marginBottom={sandboxDeploys.length ? 6 : 0}>
            <Text variant="muted" block marginBottom={4}>
              Deploy your sandbox to{' '}
              <Link href="https://vercel.com/home" target="_blank">
                Vercel
              </Link>
            </Text>
            <Button disabled={deploying} onClick={deploySandboxClicked}>
              Deploy with Vercel
            </Button>
          </Element>

          <Element>
            {sandboxDeploys &&
              sandboxDeploys.map(deploy => {
                const disabled = deploysBeingDeleted
                  ? deploysBeingDeleted.includes(deploy.uid)
                  : deployment[`${deploy.uid}Deleting`];
                return (
                  <List key={deploy.uid}>
                    <ListItem>
                      <Text weight="bold">{deploy.name}</Text>
                    </ListItem>
                    <ListItem>
                      <State state={deploy.state}>
                        {deploy.state.toString().toLowerCase()}
                      </State>
                      <Text variant="muted" marginLeft={2}>
                        {`(${formatDistanceToNow(deploy.created)} ago)`}
                      </Text>
                    </ListItem>
                    <ListAction
                      onClick={() =>
                        window.open(`https://${deploy.url}`, '_blank')
                      }
                    >
                      <Element marginRight={2}>
                        <VisitIcon />
                      </Element>{' '}
                      Visit Site
                    </ListAction>
                    <ListAction
                      disabled={disabled}
                      onClick={() => {
                        setDeploymentToDelete({ id: deploy.uid });
                        modalOpened({ modal: 'deleteDeployment' });
                      }}
                    >
                      <Element marginRight={2}>
                        <TrashIcon />
                      </Element>{' '}
                      Delete
                    </ListAction>
                  </List>
                );
              })}
          </Element>
        </>
      ) : (
        <>
          <Stack justify="space-between" marginX={2}>
            <Stack direction="vertical">
              <Text variant="muted">Enables</Text>
              <Text>Deployments</Text>
            </Stack>

            <Button
              disabled={deploying}
              onClick={signInVercelClicked}
              css={{ width: 'auto' }}
            >
              Sign in
            </Button>
          </Stack>
        </>
      )}
    </Integration>
  );
};
