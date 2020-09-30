import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import {
  githubRepoUrl,
  profileUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
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
import css from '@styled-system/css';
import { Markdown } from 'app/components/Markdown';
import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';

import { GitHubIcon } from '../../GitHub/Icons';
import { EditSummary } from './EditSummary';
import { PenIcon } from '../icons';
import { TemplateConfig } from './TemplateConfig';

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

  const [editing, setEditing] = React.useState(false);

  return (
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

              <Element itemProp="text">
                <Markdown
                  source={
                    description || 'Add a short description for this sandbox'
                  }
                />
              </Element>

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
