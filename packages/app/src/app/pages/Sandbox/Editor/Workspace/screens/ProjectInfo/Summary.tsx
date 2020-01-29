import React, { useEffect } from 'react';
import {
  Element,
  Collapsible,
  Text,
  Link,
  Label,
  Avatar,
  Stack,
  List,
  ListItem,
  Switch,
  Stats,
} from '@codesandbox/components';

import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  sandboxUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';

import { css } from '@styled-system/css';
import { Title } from './Title';
import { Description } from './Description';

export const Summary = () => {
  const {
    actions: {
      editor: { frozenUpdated, sessionFreezeOverride },
    },
    state: {
      editor: { currentSandbox, sessionFrozen },
    },
  } = useOvermind();
  const {
    owned,
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
  const { url: templateUrl } = getTemplateDefinition(template);

  return (
    <>
      <Collapsible title="Sandbox Info" defaultOpen>
        <Stack direction="vertical" gap={6}>
          <Element as="section" css={css({ paddingX: 2 })}>
            <Title editable={owned} />
            <Description editable={owned} />
          </Element>

          <Element as="section" css={css({ paddingX: 2 })}>
            {author ? (
              <Link href={profileUrl(author.username)}>
                <Stack gap={2} align="center" marginBottom={4}>
                  <Avatar user={author} /> <Text>{author.username}</Text>
                </Stack>
              </Link>
            ) : null}
            <Stats sandbox={currentSandbox} />
          </Element>

          <List>
            {owned && (
              <ListItem justify="space-between">
                <Label htmlFor="frozen">Frozen</Label>
                <Switch
                  id="frozen"
                  onChange={updateFrozenState}
                  on={customTemplate ? sessionFrozen : isFrozen}
                />
              </ListItem>
            )}
            {isForked ? (
              <ListItem justify="space-between">
                <Text>
                  {forkedTemplateSandbox ? 'Template' : 'Forked From'}
                </Text>
                <Link
                  variant="muted"
                  href={sandboxUrl(forkedFromSandbox || forkedTemplateSandbox)}
                  target="_blank"
                >
                  {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
                </Link>
              </ListItem>
            ) : null}
            <ListItem justify="space-between">
              <Text>Environment</Text>
              <Link variant="muted" href={templateUrl} target="_blank">
                {template}
              </Link>
            </ListItem>
          </List>
        </Stack>
      </Collapsible>
    </>
  );
};
