import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { Link } from 'react-router-dom';
import { basename } from 'path';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';
import { useSpring, animated } from 'react-spring';

import { useOvermind } from 'app/overmind';

import {
  Container,
  Folder,
  FolderName,
  Form,
  Name,
  NameInput,
  Main,
  TemplateBadge,
} from './elements';

const noop = () => undefined;
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

  const sandboxName = getSandboxName(currentSandbox) || 'Untitled';

  const updateSandboxInfo = () => {
    sandboxInfoUpdated();
    setUpdatingName(false);
  };

  const submitNameChange = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  const folderName = currentSandbox.collection
    ? basename(currentSandbox.collection.path) ||
      (currentSandbox.team ? currentSandbox.team.name : 'My Sandboxes')
    : 'My Sandboxes';

  const spring = useSpring({
    opacity: updatingName ? 0 : 1,
    pointerEvents: updatingName ? 'none' : 'initial',
  });
  const { customTemplate, owned } = currentSandbox;

  return (
    <Main>
      <Container>
        {!customTemplate && owned && (
          <animated.div style={spring}>
            <Folder>
              {isLoggedIn ? (
                <FolderName
                  onClick={() => modalOpened({ modal: 'moveSandbox' })}
                >
                  {folderName}
                </FolderName>
              ) : (
                'Anonymous '
              )}
              /{' '}
            </Folder>
          </animated.div>
        )}

        {updatingName ? (
          <Form onSubmit={submitNameChange}>
            <NameInput
              autoFocus
              innerRef={(el: HTMLInputElement) => {
                if (el) {
                  el.focus();
                }
              }}
              onBlur={handleBlur}
              onChange={handleInputUpdate}
              onKeyUp={handleKeyUp}
              placeholder={name}
              value={value}
            />
          </Form>
        ) : (
          <Name onClick={owned ? handleNameClick : noop} owned={owned}>
            {sandboxName}
          </Name>
        )}

        {currentSandbox.customTemplate ? (
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
      </Container>
    </Main>
  );
};
