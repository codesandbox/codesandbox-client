import getTemplateDefinition from '@codesandbox/common/es/templates';
import { getSandboxName } from '@codesandbox/common/es/utils/get-sandbox-name';
import { getTemplateIcon } from '@codesandbox/common/es/utils/getTemplateIcon';
import {
  githubRepoUrl,
  profileUrl,
  sandboxUrl,
} from '@codesandbox/common/es/utils/url-generator';
import {
  Avatar,
  Collapsible,
  Element,
  Link,
  List,
  ListItem,
  Stack,
  Stats,
  Tags,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

import { GitHubIcon } from '../GitHub/Icons';
import { BookmarkTemplateButton } from './BookmarkTemplateButton';

export const Summary = () => {
  const {
    state: {
      editor: { currentSandbox },
      isLoggedIn,
    },
  } = useOvermind();
  const {
    author,
    description,
    customTemplate,
    template,
    forkedFromSandbox,
    forkedTemplateSandbox,
    tags,
    team,
  } = currentSandbox;

  const isForked = forkedFromSandbox || forkedTemplateSandbox;
  const { url: templateUrl } = getTemplateDefinition(template);

  return (
    <>
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
          {author ? (
            <Link href={profileUrl(author.username)}>
              <Stack gap={2} align="center" paddingX={2}>
                <Avatar user={author} />
                <Stack direction="vertical">
                  <Link variant={team ? 'body' : 'muted'} block>
                    {author.username}
                  </Link>
                  {team && (
                    <Text size={2} variant="muted">
                      {team.name}
                    </Text>
                  )}
                </Stack>
              </Stack>
            </Link>
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

          <List>
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
        </Stack>
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
