import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import {
  githubRepoUrl,
  profileUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import {
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
  IconButton,
  Button,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Markdown } from 'app/components/Markdown';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { useAppState, useActions } from 'app/overmind';
import React, { useEffect } from 'react';

import { GitHubIcon } from '../../GitHub/Icons';
import { EditSummary } from './EditSummary';
import { TemplateConfig } from './TemplateConfig';

const LinkOrSpan = ({ href, ...props }) => {
  const component = href ? Link : 'span';
  return React.createElement(component, { href, ...props });
};

export const Summary = () => {
  const {
    currentSandbox,
    isForkingSandbox,
    sessionFrozen,
  } = useAppState().editor;
  const { editingSandboxInfo } = useAppState().workspace;
  const {
    frozenUpdated,
    sessionFreezeOverride,
    forkSandboxClicked,
  } = useActions().editor;
  const { toggleEditingSandboxInfo } = useActions().workspace;
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

  return (
    <Collapsible
      title={customTemplate ? 'Template Info' : 'Sandbox Info'}
      defaultOpen
    >
      <Element marginBottom={editingSandboxInfo ? 10 : 6}>
        {editingSandboxInfo ? (
          <EditSummary setEditing={toggleEditingSandboxInfo} />
        ) : (
          <Stack as="section" direction="vertical" gap={2} paddingX={2}>
            <Stack justify="space-between" align="center">
              {customTemplate ? (
                <Stack gap={2} align="center">
                  <TemplateIcon
                    templateName={customTemplate.title}
                    iconUrl={customTemplate.iconUrl}
                    environment={template}
                  />
                  <Text maxWidth="100%">{getSandboxName(currentSandbox)}</Text>
                </Stack>
              ) : (
                <Text maxWidth="100%">{getSandboxName(currentSandbox)}</Text>
              )}
              <IconButton
                name="edit"
                title="Edit description"
                size={12}
                onClick={() => toggleEditingSandboxInfo(true)}
              />
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
        {team && !currentSandbox.git ? (
          <LinkOrSpan href={author && profileUrl(author.username)}>
            <Stack gap={2} align="center" css={{ display: 'inline-flex' }}>
              <TeamAvatar name={team.name} avatar={team.avatarUrl} />
              <Element>
                <Text variant={author ? 'body' : 'muted'} block>
                  {team.name}
                </Text>
                {author && (
                  <Text size={2} marginTop={1} variant="muted" maxWidth="100%">
                    {author.name || author.username}
                  </Text>
                )}
              </Element>
            </Stack>
          </LinkOrSpan>
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
                <GitHubIcon title="GitHub repository" width={20} height={20} />
              </Stack>
              <Link variant="muted" maxWidth="100%">
                {currentSandbox.git.username}/{currentSandbox.git.repo}
              </Link>
            </Stack>
          </Link>
        ) : null}

        <Stats sandbox={currentSandbox} />
      </Stack>

      {!author && currentSandbox.git ? (
        <Stack as="section" direction="vertical" gap={4} paddingX={2}>
          <Text variant="muted" size={3}>
            This sandbox is in sync with{' '}
            <Text weight="bold">{currentSandbox.git.branch}</Text> on GitHub.
            You have to fork to make changes
          </Text>
          <Button
            marginTop={8}
            variant="primary"
            loading={isForkingSandbox}
            onClick={() => forkSandboxClicked({})}
          >
            {isForkingSandbox ? 'Forking...' : 'Fork'}
          </Button>
        </Stack>
      ) : null}

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

const TemplateIcon = ({ iconUrl, templateName, environment }) => {
  const { UserIcon } = getTemplateIcon(templateName, iconUrl, environment);

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
