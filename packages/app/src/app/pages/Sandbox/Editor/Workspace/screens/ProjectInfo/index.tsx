import React, { useEffect } from 'react';
import {
  Element,
  Collapsible,
  Text,
  Label,
  Avatar,
  Stack,
  List,
  ListItem,
  Switch,
  Stats,
} from '@codesandbox/components';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useOvermind } from 'app/overmind';

import { css } from '@styled-system/css';
import { Title } from './Title';
import { Description } from './Description';
import { Privacy } from './Privacy';
import { Config } from './Config';

const Link = props => <Text variant="muted" {...props} />;

export const ProjectInfo = () => {
  const {
    actions: {
      editor: { frozenUpdated, sessionFreezeOverride },
    },
    state: {
      editor: { currentSandbox, sessionFrozen },
    },
  } = useOvermind();
  const {
    author,
    isFrozen,
    customTemplate,
    template,
    forkedFromSandbox,
    forkedTemplateSandbox,
  } = currentSandbox;

  useEffect(() => {
    // always freeze it on start
    if (customTemplate) {
      frozenUpdated({ frozen: true });
    }
  }, [customTemplate, frozenUpdated]);

  const updateFrozenState = () => {
    if (customTemplate) {
      return sessionFreezeOverride({ frozen: !sessionFrozen });
    }

    return frozenUpdated({ frozen: !isFrozen });
  };

  const isForked = forkedFromSandbox || forkedTemplateSandbox;

  return (
    <>
      <Collapsible title="Sandbox Info" defaultOpen>
        <Stack direction="vertical" gap={6}>
          <Element as="section" css={css({ paddingX: 2 })}>
            <Title editable />
            <Description editable />
          </Element>

          <Element as="section" css={css({ paddingX: 2 })}>
            {author ? (
              <Stack gap={2} align="center" marginBottom={4}>
                <Avatar user={author} /> <Text>{author.username}</Text>
              </Stack>
            ) : null}
            <Stats sandbox={currentSandbox} />
          </Element>

          <List>
            <ListItem justify="space-between">
              <Label htmlFor="frozen">Frozen</Label>
              <Switch
                id="frozen"
                onChange={updateFrozenState}
                on={customTemplate ? sessionFrozen : isFrozen}
              />
            </ListItem>
            {isForked ? (
              <ListItem justify="space-between">
                <Text>
                  {forkedTemplateSandbox ? 'Template' : 'Forked From'}
                </Text>
                <Link>
                  {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
                </Link>
              </ListItem>
            ) : null}
            <ListItem justify="space-between">
              <Text>Environment</Text>
              <Link>{template}</Link>
            </ListItem>
          </List>
        </Stack>
      </Collapsible>
      <Privacy />
      <Config />
    </>
  );
};
