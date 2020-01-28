import React, { useEffect } from 'react';
import { Collapsible, Text, Element, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { css } from '@styled-system/css';
import { GitHubIcon } from './Icons';
import { CommitForm } from './CommitForm';
import { Changes } from './Changes';
import { CreateRepo } from './CreateRepo';
import { GithubLogin } from './GithubLogin';
import { NotOwner } from './NotOwner';
import { NotLoggedIn } from './NotLoggedIn';

export const GitHub = () => {
  const {
    actions: {
      git: { gitMounted },
    },
    state: {
      git: { isFetching, originalGitChanges: gitChanges },
      editor: {
        currentSandbox: { originalGit, owned },
      },
      isLoggedIn,
      user,
    },
  } = useOvermind();
  useEffect(() => {
    gitMounted();
  }, [gitMounted]);

  const changeCount = gitChanges
    ? gitChanges.added.length +
      gitChanges.modified.length +
      gitChanges.deleted.length
    : 0;

  if (!isLoggedIn) return <NotLoggedIn />;
  if (!owned) return <NotOwner />;

  if (!user.integrations.github) {
    return (
      <Collapsible title="Github" defaultOpen>
        <Element
          css={css({
            paddingX: 2,
          })}
        >
          <Text variant="muted" marginBottom={4} block>
            You can create commits and open pull requests if you add GitHub to
            your integrations.
          </Text>
          <GithubLogin />
        </Element>
      </Collapsible>
    );
  }

  return (
    <>
      {originalGit ? (
        <Collapsible title="Github" defaultOpen>
          <Element css={css({ paddingX: 2 })}>
            <Stack gap={2} marginBottom={6} align="center">
              <GitHubIcon />
              <Text size={2}>
                {originalGit.username}/{originalGit.repo}
              </Text>
            </Stack>
          </Element>
          <Element>
            <Text size={3} block marginBottom={2} marginX={2}>
              Changes ({isFetching ? '...' : changeCount})
            </Text>
            {!isFetching ? (
              gitChanges && <Changes {...gitChanges} />
            ) : (
              <Element css={css({ paddingX: 2 })}>
                <Text variant="muted">Fetching changes...</Text>
              </Element>
            )}
            {!isFetching && (
              <>
                {changeCount > 0 && <CommitForm />}
                {changeCount === 0 && (
                  <Element css={css({ paddingX: 2 })}>
                    <Text variant="muted" weight="bold">
                      There are no changes
                    </Text>
                  </Element>
                )}
              </>
            )}
          </Element>
        </Collapsible>
      ) : null}
      <CreateRepo />
    </>
  );
};

// <Collapsible title="Github" defaultOpen>
//       <Element css={{ paddingX: 2 }}>
//         <Stack gap={2} marginBottom={6}>
//           {GitHubIcon}
//           <Text size={2}>codesandbox/components</Text>
//         </Stack>
//       </Element>

//       <Element>
//         <Text size={3} block marginBottom={2} marginX={2}>
//           Changes (4)
//         </Text>
//         <List marginBottom={6}>
//           <ListAction gap={2}>
//             {addedIcon} <Text variant="muted">src/index.js</Text>
//           </ListAction>
//           <ListAction gap={2}>
//             {deletedIcon} <Text variant="muted">src/style.css</Text>
//           </ListAction>
//           <ListAction gap={2}>
//             {changedIcon} <Text variant="muted">package.json</Text>
//           </ListAction>
//           <ListAction gap={2}>
//             {changedIcon} <Text variant="muted">dist.js</Text>
//           </ListAction>
//         </List>

//         <Text size={3} block marginBottom={2} marginX={2}>
//           Commit Message
//         </Text>
//         <Stack as="form" direction="vertical" gap={1} marginX={2}>
//           <Input placeholder="Subject" />
//           <Textarea maxLength={280} placeholder="Description" />
//           <Button variant="secondary">Open Pull Request</Button>
//         </Stack>
//       </Element>
//     </Collapsible>
//     <Collapsible title="Export to GitHub" defaultOpen>
//       <Element css={{ paddingX: 2 }}>
//         <Stack as="form" direction="vertical" gap={2}>
//           <Input type="text" placeholder="Enter repository url" />
//           <Button variant="secondary">Create Repository</Button>
//         </Stack>
//       </Element>
