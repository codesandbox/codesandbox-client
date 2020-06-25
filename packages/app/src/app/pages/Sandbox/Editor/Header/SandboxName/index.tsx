import { basename } from 'path';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { Button, Element, Stack, Text } from '@codesandbox/components';
import { github as GitHubIcon } from '@codesandbox/components/lib/components/Icon/icons';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { PrivacyTooltip } from '../PrivacyTooltip';
import { Folder, Form, Main, NameInput, TemplateBadge } from './elements';

export const SandboxName: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: {
      editor: { currentSandbox },
      isLoggedIn,
    },
  } = useOvermind();
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

  const folderName =
    currentSandbox && currentSandbox.collection
      ? basename(currentSandbox.collection.path) ||
        (currentSandbox.team ? currentSandbox.team.name : 'My Sandboxes')
      : 'My Sandboxes';

  const { customTemplate, owned } = currentSandbox || {
    customTemplate: null,
    owned: false,
  };

  const git =
    !updatingName && (currentSandbox.git || currentSandbox.originalGit);

  return (
    <Main style={fadeIn ? { opacity: 1 } : null}>
      <Stack align="center">
        {!customTemplate && owned && !git && !updatingName && (
          <Folder>
            {isLoggedIn ? (
              <Button
                variant="link"
                css={css({ fontSize: 3, width: 'auto' })}
                onClick={() => modalOpened({ modal: 'moveSandbox' })}
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

        {updatingName && !git ? (
          <>
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
          </>
        ) : (
          <>
            {!git ? (
              owned ? (
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
              )
            ) : null}
          </>
        )}

        {!updatingName && !git ? (
          <Element as="span" marginLeft={owned ? 0 : 2}>
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
                <Link target="_blank" to="/docs/templates">
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
