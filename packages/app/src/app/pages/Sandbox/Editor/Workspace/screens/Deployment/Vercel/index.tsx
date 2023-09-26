import {
  Button,
  Element,
  Integration,
  Link,
  List,
  ListAction,
  ListItem,
  Stack,
  Text,
} from '@codesandbox/components';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { VercelIcon, VisitIcon, TrashIcon } from '../icons';

import { State } from './elements';

export const Vercel: FunctionComponent = () => {
  const {
    deployment,
    deployment: { deploySandboxClicked, setDeploymentToDelete },
    modalOpened,
    signInVercelClicked,
  } = useActions();
  const {
    deployment: {
      deploying,
      vercel: { deploysBeingDeleted, deploys },
    },
    user: {
      integrations: { vercel },
    },
  } = useAppState();

  return (
    <Integration icon={VercelIcon} title="Vercel">
      {vercel ? (
        <>
          <Element marginX={2} marginBottom={deploys.length ? 6 : 0}>
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
            {deploys.map(({ created, name, state, uid, url }) => {
              const disabled = deploysBeingDeleted
                ? deploysBeingDeleted.includes(uid)
                : deployment[`${uid}Deleting`];

              return (
                <List key={uid}>
                  <ListItem>
                    <Text weight="bold">{name}</Text>
                  </ListItem>

                  <ListItem>
                    <State state={state}>
                      {state.toString().toLowerCase()}
                    </State>

                    <Text
                      marginLeft={2}
                      variant="muted"
                    >{`(${formatDistanceToNow(created)} ago)`}</Text>
                  </ListItem>

                  <ListAction
                    onClick={() => window.open(`https://${url}`, '_blank')}
                  >
                    <Element marginRight={2}>
                      <VisitIcon />
                    </Element>{' '}
                    Visit Site
                  </ListAction>

                  <ListAction
                    disabled={disabled}
                    onClick={() => {
                      setDeploymentToDelete(uid);
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
        <Stack justify="space-between" marginX={2}>
          <Stack direction="vertical">
            <Text variant="muted">Enables</Text>

            <Text>Deployments</Text>
          </Stack>

          <Button autoWidth disabled={deploying} onClick={signInVercelClicked}>
            Sign in
          </Button>
        </Stack>
      )}
    </Integration>
  );
};
