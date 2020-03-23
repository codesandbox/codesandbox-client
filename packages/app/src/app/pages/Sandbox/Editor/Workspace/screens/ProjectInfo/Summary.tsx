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
  githubRepoUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { Icons } from '@codesandbox/template-icons';
import getIcon from '@codesandbox/common/lib/templates/icons';

import css from '@styled-system/css';
import { TemplateConfig } from './TemplateConfig';
import { PenIcon } from './icons';
import { EditSummary } from './EditSummary';
import { GitHubIcon } from '../GitHub/Icons';

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

  const updateFrozenState = e => {
    e.preventDefault();
    if (customTemplate) {
      return sessionFreezeOverride({ frozen: !sessionFrozen });
    }

    return frozenUpdated({ frozen: !isFrozen });
  };

  const isForked = forkedFromSandbox || forkedTemplateSandbox;
  const { url: templateUrl } = getTemplateDefinition(template);

  const [editing, setEditing] = React.useState(false);

  return (
    <>
      <Collapsible
        title={customTemplate ? 'Template Info' : 'Sandbox Info'}
        defaultOpen
      >
        <Element marginBottom={editing ? 10 : 6}>
          {editing ? (
            <EditSummary setEditing={setEditing} />
          ) : (
            <Stack as="section" direction="vertical" gap={2} paddingX={2}>
              <Stack justify="space-between" align="center">
                {customTemplate ? (
                  <Stack gap={2} align="center">
                    <TemplateIcon
                      iconUrl={customTemplate.iconUrl}
                      environment={template}
                    />
                    <Text maxWidth="100%">
                      {getSandboxName(currentSandbox)}
                    </Text>
                  </Stack>
                ) : (
                  <Text maxWidth="100%">{getSandboxName(currentSandbox)}</Text>
                )}
                <Button
                  variant="link"
                  css={css({ width: 10 })}
                  onClick={() => setEditing(true)}
                >
                  <PenIcon />
                </Button>
              </Stack>

              <Text variant="muted" onClick={() => setEditing(true)}>
                {description || 'Add a short description for this sandbox'}
              </Text>

              {tags.length ? (
                <Element marginTop={4}>
                  <Tags tags={tags} />
                </Element>
              ) : null}
            </Stack>
          )}
        </Element>

        <Stack as="section" direction="vertical" gap={4} paddingX={2}>
          {author ? (
            <Link href={profileUrl(author.username)}>
              <Stack gap={2} align="center" css={{ display: 'inline-flex' }}>
                <Avatar user={author} />
                <Element>
                  <Text variant={team ? 'body' : 'muted'} block>
                    {author.username}
                  </Text>
                  {team && (
                    <Text
                      size={2}
                      marginTop={1}
                      variant="muted"
                      maxWidth="100%"
                    >
                      {team.name}
                    </Text>
                  )}
                </Element>
              </Stack>
            </Link>
          ) : null}

          {!author && currentSandbox.git ? (
            <Link href={githubRepoUrl(currentSandbox.git)} target="_blank">
              <Stack gap={2} align="center">
                <Stack
                  justify="center"
                  align="center"
                  css={css({
                    size: 8,
                    minWidth: 8,
                    borderRadius: 'small',
                    border: '1px solid',
                    borderColor: 'avatar.border',
                  })}
                >
                  <GitHubIcon
                    title="GitHub repository"
                    width={20}
                    height={20}
                  />
                </Stack>
                <Link variant="muted" maxWidth="100%">
                  {currentSandbox.git.username}/{currentSandbox.git.repo}
                </Link>
              </Stack>
            </Link>
          ) : null}

          <Stats sandbox={currentSandbox} />
        </Stack>

        <Divider marginTop={8} marginBottom={4} />

        <List>
          {customTemplate && <TemplateConfig />}
          <ListAction justify="space-between" onClick={updateFrozenState}>
            <Label htmlFor="frozen">Frozen</Label>
            <Switch
              id="frozen"
              onChange={updateFrozenState}
              on={customTemplate ? sessionFrozen : isFrozen}
            />
          </ListAction>
          {isForked ? (
            <ListItem justify="space-between">
              <Text>{forkedTemplateSandbox ? 'Template' : 'Forked From'}</Text>
              <Link
                variant="muted"
                href={sandboxUrl(forkedFromSandbox || forkedTemplateSandbox)}
                target="_blank"
              >
                {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
              </Link>
            </ListItem>
          ) : null}
          <ListItem justify="space-between" gap={2}>
            <Text>Environment</Text>
            <Link
              variant="muted"
              href={templateUrl}
              target="_blank"
              maxWidth="100%"
            >
              {template}
            </Link>
          </ListItem>
        </List>
      </Collapsible>
    </>
  );
};

const TemplateIcon = ({ iconUrl, environment }) => {
  const Icon = Icons[iconUrl] || getIcon(environment);
  return <Icon />;
};

const Divider = props => (
  <Element
    as="hr"
    css={css({
      width: '100%',
      border: 'none',
      borderBottom: '1px solid',
      borderColor: 'sideBar.border',
    })}
    {...props}
  />
);
