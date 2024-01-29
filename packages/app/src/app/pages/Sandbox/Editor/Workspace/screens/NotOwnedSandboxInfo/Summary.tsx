import React from 'react';
import { useActions, useAppState } from 'app/overmind';

import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  sandboxUrl,
  profileUrl,
  githubRepoUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';

import {
  Element,
  Collapsible,
  Text,
  Link,
  Stack,
  List,
  ListItem,
  Stats,
  Tags,
  Button,
} from '@codesandbox/components';
import css from '@styled-system/css';

import { BookmarkTemplateButton } from './BookmarkTemplateButton';
import { GitHubIcon } from '../GitHub/Icons';

const LinkOrSpan = ({ href, ...props }) => {
  const component = href ? Link : 'span';
  return React.createElement(component, { href, ...props });
};

export const Summary = () => {
  const {
    editor: { currentSandbox, isForkingSandbox },
    isLoggedIn,
  } = useAppState();
  const {
    author,
    description,
    customTemplate,
    template,
    forkedFromSandbox,
    forkedTemplateSandbox,
    tags,
    team,
    privacy,
  } = currentSandbox;
  const {
    editor: { forkSandboxClicked },
  } = useActions();
  const { isPro } = useWorkspaceSubscription();

  const isForked = forkedFromSandbox || forkedTemplateSandbox;
  const { url: templateUrl } = getTemplateDefinition(template);
  const isUnlistedOrPrivate = privacy === 1 || privacy === 2;

  return (
    <Collapsible
      title={customTemplate ? 'Template Info' : 'Sandbox Info'}
      defaultOpen
    >
      <Element marginBottom={6}>
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
          </Stack>

          <Text variant="muted">{description}</Text>

          {tags.length ? (
            <Element marginTop={4}>
              <Tags tags={tags} />
            </Element>
          ) : null}
        </Stack>
      </Element>

      <Stack as="section" direction="vertical" gap={6} paddingX={2}>
        <Stats sandbox={currentSandbox} />
        {customTemplate && isLoggedIn && <BookmarkTemplateButton />}
      </Stack>

      <Divider marginTop={8} marginBottom={4} />

      <Stack as="section" direction="vertical" gap={4}>
        {team && !currentSandbox.git ? (
          <LinkOrSpan href={author && profileUrl(author.username)}>
            <Stack gap={2} align="center" paddingX={2}>
              <TeamAvatar name={team.name} avatar={team.avatarUrl} />
              <Stack direction="vertical">
                <Text variant={author ? 'body' : 'muted'} block>
                  {team.name}
                </Text>
                {author && (
                  <Text size={2} variant="muted">
                    {author.name || author.username}
                  </Text>
                )}
              </Stack>
            </Stack>
          </LinkOrSpan>
        ) : null}

        {!author && currentSandbox.git ? (
          <Link href={githubRepoUrl(currentSandbox.git)} target="_blank">
            <Stack gap={2} align="center" paddingX={2}>
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

        <List>
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

        {!author && currentSandbox.git ? (
          <Stack as="section" direction="vertical" gap={4} paddingX={2}>
            <Text variant="muted" size={3}>
              This sandbox is in sync with{' '}
              <Text weight="bold">{currentSandbox.git.branch}</Text> on GitHub.
              You have to fork to make changes.
            </Text>

            <Button
              variant="primary"
              disabled={!isPro && isUnlistedOrPrivate}
              loading={isForkingSandbox}
              onClick={() => forkSandboxClicked({})}
            >
              {isForkingSandbox ? 'Forking...' : 'Fork'}
            </Button>
          </Stack>
        ) : null}
      </Stack>
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
