import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';

import {
  Element,
  Collapsible,
  Text,
  Button,
  Link,
  Label,
  Avatar,
  Stack,
  List,
  ListItem,
  ListAction,
  Switch,
  Stats,
  Tags,
} from '@codesandbox/components';

import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  sandboxUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { Icons } from '@codesandbox/template-icons';
import getIcon from '@codesandbox/common/lib/templates/icons';

import { css } from '@styled-system/css';
import { TemplateConfig } from './TemplateConfig';
import { PenIcon } from './icons';
import { EditSummary } from './EditSummary';
import { BookmarkTemplateButton } from './BookmarkTemplateButton';

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
    description,
    isFrozen,
    customTemplate,
    template,
    forkedFromSandbox,
    forkedTemplateSandbox,
    tags,
    team,
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
  const myTemplate = customTemplate && owned;
  const userTemplate = customTemplate && !owned;

  const [editing, setEditing] = React.useState(false);

  return (
    <>
      <Collapsible
        title={customTemplate ? 'Template Info' : 'Sandbox Info'}
        defaultOpen
      >
        <Stack direction="vertical" gap={6}>
          {editing ? (
            <EditSummary setEditing={setEditing} />
          ) : (
            <Stack
              as="section"
              direction="vertical"
              gap={2}
              css={css({ paddingX: 2 })}
            >
              <Stack justify="space-between" align="center">
                {customTemplate ? (
                  <Stack gap={2} align="center">
                    <TemplateIcon
                      iconUrl={customTemplate.iconUrl}
                      environment={template}
                    />
                    <Text maxWidth={190}>{getSandboxName(currentSandbox)}</Text>
                  </Stack>
                ) : (
                  <Text maxWidth={190}>{getSandboxName(currentSandbox)}</Text>
                )}
                {owned && !editing && (
                  <Button
                    variant="link"
                    css={css({ width: 10 })}
                    onClick={() => setEditing(true)}
                  >
                    <PenIcon />
                  </Button>
                )}
              </Stack>

              <Text variant="muted">{description}</Text>

              <Tags tags={tags} />
            </Stack>
          )}

          <Element
            as="section"
            css={css({
              paddingX: 2,
              // sorry :(
              marginBottom: userTemplate ? '16px  !important' : undefined,
            })}
          >
            {author ? (
              <Link href={profileUrl(author.username)}>
                <Stack
                  gap={2}
                  align="center"
                  css={{ display: 'inline-flex' }}
                  marginBottom={userTemplate ? 0 : 4}
                >
                  <Avatar user={author} />
                  <Element>
                    <Text variant={team ? 'body' : 'muted'} block>
                      {author.username}
                    </Text>
                    {team && (
                      <Text size={2} marginTop={1} variant="muted">
                        {team.name}
                      </Text>
                    )}
                  </Element>
                </Stack>
              </Link>
            ) : null}
            {userTemplate && (
              <>
                <Element marginTop={4}>
                  <Stats sandbox={currentSandbox} />
                </Element>
                <BookmarkTemplateButton />
              </>
            )}
          </Element>

          <List>
            {myTemplate && <TemplateConfig />}

            {owned && (
              <ListAction justify="space-between">
                <Label htmlFor="frozen">Frozen</Label>
                <Switch
                  id="frozen"
                  onChange={updateFrozenState}
                  on={customTemplate ? sessionFrozen : isFrozen}
                />
              </ListAction>
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

const TemplateIcon = ({ iconUrl, environment }) => {
  const Icon = Icons[iconUrl] || getIcon(environment);
  return <Icon />;
};
