import {
  Avatar,
  Button,
  Collapsible,
  Element,
  Label,
  Link,
  List,
  ListAction,
  ListItem,
  Stack,
  Stats,
  Switch,
  Tags,
  Text,
} from '@codesandbox/components';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  githubRepoUrl,
  profileUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import css from '@styled-system/css';
import React, { FunctionComponent, useEffect, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { GitHubIcon } from '../../GitHub/Icons';

import { PenIcon } from '../icons';

import { EditSummary } from './EditSummary';
import { TemplateConfig } from './TemplateConfig';

export const Summary: FunctionComponent = () => {
  const {
    actions: {
      editor: { frozenUpdated, sessionFreezeOverride },
    },
    state: {
      editor: {
        currentSandbox,
        currentSandbox: {
          author,
          customTemplate,
          description,
          forkedFromSandbox,
          forkedTemplateSandbox,
          isFrozen,
          tags,
          team,
          template,
        },
        sessionFrozen,
      },
    },
  } = useOvermind();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // always freeze it on start
    if (customTemplate) {
      frozenUpdated(true);
    }
  }, [customTemplate, frozenUpdated]);

  const updateFrozenState = e => {
    e.preventDefault();
    if (customTemplate) {
      return sessionFreezeOverride(!sessionFrozen);
    }

    return frozenUpdated(!isFrozen);
  };

  const isForked = forkedFromSandbox || forkedTemplateSandbox;
  const { url: templateUrl } = getTemplateDefinition(template);

  return (
    <>
      <Collapsible
        defaultOpen
        title={customTemplate ? 'Template Info' : 'Sandbox Info'}
      >
        <Element marginBottom={editing ? 10 : 6}>
          {editing ? (
            <EditSummary setEditing={setEditing} />
          ) : (
            <Stack as="section" direction="vertical" gap={2} paddingX={2}>
              <Stack align="center" justify="space-between">
                {customTemplate ? (
                  <Stack align="center" gap={2}>
                    <TemplateIcon
                      environment={template}
                      iconUrl={customTemplate.iconUrl}
                    />

                    <Text maxWidth="100%">
                      {getSandboxName(currentSandbox)}
                    </Text>
                  </Stack>
                ) : (
                  <Text maxWidth="100%">{getSandboxName(currentSandbox)}</Text>
                )}
                <Button
                  css={css({ width: 10 })}
                  onClick={() => setEditing(true)}
                  variant="link"
                >
                  <PenIcon />
                </Button>
              </Stack>

              <Text onClick={() => setEditing(true)} variant="muted">
                {description || 'Add a short description for this sandbox'}
              </Text>

              {tags.length > 0 ? (
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
              <Stack align="center" css={{ display: 'inline-flex' }} gap={2}>
                <Avatar user={author} />

                <Element>
                  <Text block variant={team ? 'body' : 'muted'}>
                    {author.username}
                  </Text>

                  {team ? (
                    <Text
                      marginTop={1}
                      maxWidth="100%"
                      variant="muted"
                      size={2}
                    >
                      {team.name}
                    </Text>
                  ) : null}
                </Element>
              </Stack>
            </Link>
          ) : null}

          {!author && currentSandbox.git ? (
            <Link href={githubRepoUrl(currentSandbox.git)} target="_blank">
              <Stack align="center" gap={2}>
                <Stack
                  align="center"
                  css={css({
                    size: 8,
                    minWidth: 8,
                    borderRadius: 'small',
                    border: '1px solid',
                    borderColor: 'avatar.border',
                  })}
                  justify="center"
                >
                  <GitHubIcon height={20} width={20} />
                </Stack>

                <Link maxWidth="100%" variant="muted">
                  {currentSandbox.git.username}/{currentSandbox.git.repo}
                </Link>
              </Stack>
            </Link>
          ) : null}

          <Stats sandbox={currentSandbox} />
        </Stack>

        <Divider marginBottom={4} marginTop={8} />

        <List>
          {customTemplate && <TemplateConfig />}

          <ListAction justify="space-between" onClick={updateFrozenState}>
            <Label htmlFor="frozen">Frozen</Label>

            <Switch
              id="frozen"
              on={customTemplate ? sessionFrozen : isFrozen}
              onChange={updateFrozenState}
            />
          </ListAction>

          {isForked ? (
            <ListItem justify="space-between">
              <Text>{forkedTemplateSandbox ? 'Template' : 'Forked From'}</Text>

              <Link
                href={sandboxUrl(forkedFromSandbox || forkedTemplateSandbox)}
                target="_blank"
                variant="muted"
              >
                {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
              </Link>
            </ListItem>
          ) : null}

          <ListItem gap={2} justify="space-between">
            <Text>Environment</Text>

            <Link
              maxWidth="100%"
              href={templateUrl}
              target="_blank"
              variant="muted"
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
  const { UserIcon } = getTemplateIcon(iconUrl, environment);

  return <UserIcon />;
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
