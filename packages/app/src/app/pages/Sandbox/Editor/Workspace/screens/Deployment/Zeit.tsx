import React from 'react';
import {
  Element,
  Text,
  Stack,
  Button,
  Integration,
  ListAction,
  ListItem,
  List,
} from '@codesandbox/components';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { css } from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { ZeitIcon, VisitIcon, TrashIcon } from './icons';
import { State } from './elements';

export const Zeit = () => {
  const {
    actions: { modalOpened, deployment },
    state: {
      deployment: { deploying, sandboxDeploys, deploysBeingDeleted },
      user: { integrations },
    },
  } = useOvermind();
  const { deploySandboxClicked, setDeploymentToDelete } = deployment;
  return (
    <Element marginTop={5}>
      <Integration icon={ZeitIcon} title="ZEIT">
        <Stack direction="vertical">
          <Text variant="muted">Enables</Text>
          <Text>Deployments</Text>
        </Stack>
        <Button disabled={deploying} onClick={deploySandboxClicked}>
          {integrations.zeit ? 'Deploy' : 'Sign In'}
        </Button>
        <Element
          css={css({
            gridColumnStart: 1,
            gridColumnEnd: 3,
          })}
        >
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
                      {`(${distanceInWordsToNow(deploy.created)} ago)`}
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
      </Integration>
    </Element>
  );
};
