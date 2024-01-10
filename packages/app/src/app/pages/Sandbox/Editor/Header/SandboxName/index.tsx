import { basename } from 'path';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Button, Element, Stack, Text } from '@codesandbox/components';
import { github as GitHubIcon } from '@codesandbox/components/lib/components/Icon/icons';
import css from '@styled-system/css';
import { GitInfo, Sandbox } from '@codesandbox/common/lib/types';
import { useAppState, useActions } from 'app/overmind';
import React, {
  ChangeEvent,
  CSSProperties,
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { PrivacyTooltip } from '../PrivacyTooltip';
import { Folder, Form, Main, NameInput, TemplateBadge } from './elements';

const SandboxNameElement: React.FC<{
  git: GitInfo;
  handleBlur: () => void;
  handleInputUpdate: (e: ChangeEvent<HTMLInputElement>) => void;
  handleKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleNameClick: () => void;
  owned: boolean;
  sandboxName: string;
  submitNameChange: (event: ChangeEvent<HTMLFormElement>) => void;
  updatingName: boolean;
  value: string;
}> = ({
  git,
  handleBlur,
  handleInputUpdate,
  handleKeyUp,
  sandboxName,
  submitNameChange,
  updatingName,
  value,
  owned,
  handleNameClick,
}) => {
  if (updatingName && !git) {
    return (
      <Form onSubmit={submitNameChange}>
        <NameInput
          autoFocus
          ref={(el: HTMLInputElement) => {
            if (el) {
              el.focus();
            }
          }}
          onBlur={handleBlur}
          onChange={handleInputUpdate}
          onKeyUp={handleKeyUp}
          placeholder={name}
          value={value}
          arial-label="sandbox name"
        />
      </Form>
    );
  }

  if (!git) {
    return owned ? (
      <Button
        variant="link"
        css={css({ fontSize: 3, width: 'auto', color: 'foreground' })}
        arial-label="Change sandbox name"
        onClick={handleNameClick}
      >
        {sandboxName}
      </Button>
    ) : (
      <Text>{sandboxName}</Text>
    );
  }

  return null;
};

const getFolderName = (sandbox: Sandbox) => {
  if (!sandbox) {
    return 'Drafts';
  }

  if (sandbox.collection) {
    const base = basename(sandbox.collection.path);

    return base || 'Sandboxes';
  }

  return 'Drafts';
};

export const SandboxName: FunctionComponent = () => {
  const {
    modals,
    workspace: { sandboxInfoUpdated, valueChanged },
  } = useActions();
  const {
    editor: { currentSandbox },
    isLoggedIn,
  } = useAppState();
  const [updatingName, setUpdatingName] = useState(false);
  const [name, setName] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!fadeIn) {
      const id = setTimeout(() => {
        setFadeIn(true);
      }, 500);
      return () => clearTimeout(id);
    }

    return () => {};
  }, [fadeIn]);

  const sandboxName =
    (currentSandbox && getSandboxName(currentSandbox)) || 'Untitled';

  const updateSandboxInfo = () => {
    sandboxInfoUpdated();

    setUpdatingName(false);
  };

  const submitNameChange = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateSandboxInfo();

    track('Change Sandbox Name From Header');
  };

  const handleNameClick = () => {
    setUpdatingName(true);

    setName(sandboxName);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ESC) {
      updateSandboxInfo();
    }
  };

  const handleBlur = () => {
    updateSandboxInfo();
  };

  const handleInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    valueChanged({
      field: 'title',
      value: e.target.value,
    });

    setName(e.target.value);
  };

  const value = name !== 'Untitled' && updatingName ? name : '';

  if (!currentSandbox) {
    return null;
  }

  const folderName = getFolderName(currentSandbox);

  const { customTemplate } = currentSandbox;

  const git =
    !updatingName && (currentSandbox.git || currentSandbox.originalGit);

  const owned = hasPermission(currentSandbox.authorization, 'owner');

  const disabledStyle: CSSProperties = {
    opacity: updatingName ? 0 : 1,
    pointerEvents: updatingName ? 'none' : 'auto',
  };

  return (
    <Main style={fadeIn ? { opacity: 1 } : null}>
      <Stack align="center">
        {!customTemplate && owned && !git && (
          <Folder style={disabledStyle}>
            {isLoggedIn ? (
              <Button
                variant="link"
                css={css({ fontSize: 3, width: 'auto' })}
                onClick={() =>
                  modals.moveSandboxModal.open({
                    sandboxIds: [currentSandbox.id],
                    preventSandboxLeaving:
                      currentSandbox.permissions.preventSandboxLeaving,
                  })
                }
                arial-label="Change sandbox folder"
              >
                {folderName}
              </Button>
            ) : (
              'Anonymous '
            )}
            <Text role="presentation" variant="muted">
              /
            </Text>
          </Folder>
        )}

        <SandboxNameElement
          git={git}
          handleBlur={handleBlur}
          handleInputUpdate={handleInputUpdate}
          handleKeyUp={handleKeyUp}
          handleNameClick={handleNameClick}
          owned={owned}
          sandboxName={sandboxName}
          submitNameChange={submitNameChange}
          updatingName={updatingName}
          value={value}
        />

        {!git ? (
          <Element as="span" marginLeft={owned ? 0 : 2} style={disabledStyle}>
            <PrivacyTooltip />
          </Element>
        ) : null}

        {!updatingName &&
        currentSandbox.customTemplate &&
        !currentSandbox.git &&
        !currentSandbox.baseGit ? (
          <Tooltip
            content={
              <>
                This sandbox is a template, you can learn about templates in the{' '}
                <Link target="_blank" to="/docs/learn/sandboxes/templates">
                  docs
                </Link>
                .
              </>
            }
            delay={0}
            interactive
            placement="bottom"
          >
            <TemplateBadge color={customTemplate.color}>Template</TemplateBadge>
          </Tooltip>
        ) : null}
        {git ? (
          <Tooltip
            content={
              <>
                This sandbox is a GitHub sandbox, you can learn more about
                GitHub sandboxes in the{' '}
                <Link target="_blank" to="/docs/git">
                  docs
                </Link>
                .
              </>
            }
            delay={0}
            interactive
            placement="bottom"
          >
            <TemplateBadge style={{ margin: 0, cursor: 'default' }}>
              <GitHubIcon width={15} />
              <Text paddingLeft={2}>
                <Text css={css({ opacity: 0.8 })}>
                  {git.username} / {git.repo} /{' '}
                </Text>
                <Text>{git.branch}</Text>
                <Text css={css({ opacity: 0.8 })}>
                  {git.path ? ' /' + git.path : null}
                </Text>
              </Text>
            </TemplateBadge>
          </Tooltip>
        ) : null}
        {currentSandbox.originalGit ? (
          <Element marginLeft={2}>
            <PrivacyTooltip />
          </Element>
        ) : null}
      </Stack>
    </Main>
  );
};
