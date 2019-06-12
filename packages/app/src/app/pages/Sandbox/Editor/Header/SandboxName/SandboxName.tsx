import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { basename } from 'path';
import Media from 'react-media';
import { Spring } from 'react-spring/renderprops';
import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useSignals, useStore } from 'app/store';
import {
  Container,
  Folder,
  FolderName,
  Form,
  Name,
  NameInput,
  TemplateBadge,
} from './elements';

export const SandboxName = observer(() => {
  const [updatingName, setUpdatingName] = useState(false);
  const [name, setName] = useState('');
  const {
    modalOpened,
    workspace: { sandboxInfoUpdated, valueChanged },
  } = useSignals();
  const {
    isLoggedIn,
    editor: { currentSandbox },
  } = useStore();

  const sandboxName = () => getSandboxName(currentSandbox) || 'Untitled';

  const updateSandboxInfo = () => {
    sandboxInfoUpdated();
    setUpdatingName(false);
  };

  const submitNameChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSandboxInfo();
    track('Change Sandbox Name From Header');
  };

  const handleNameClick = () => {
    setUpdatingName(true);
    setName(sandboxName());
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ESC) {
      updateSandboxInfo();
    }
  };

  const handleBlur = () => {
    updateSandboxInfo();
  };

  const handleInputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Spring
      from={{
        opacity: 1,
      }}
      to={
        updatingName
          ? {
              opacity: 0,
              // pointerEvents is an enum so we have to use 'as'
              // here to skip the string type inference
              pointerEvents: 'none' as 'none',
            }
          : {
              opacity: 1,
              pointerEvents: 'initial' as 'initial',
            }
      }
    >
      {style => (
        <Media
          query="(min-width: 826px)"
          render={() => (
            <Container>
              <Media
                query="(min-width: 950px)"
                render={() => (
                  <Folder style={style}>
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
                )}
              />
              {updatingName ? (
                <Form onSubmit={submitNameChange}>
                  <NameInput
                    autoFocus
                    innerRef={(el: HTMLInputElement) => {
                      if (el) {
                        el.focus();
                      }
                    }}
                    onKeyUp={handleKeyUp}
                    onBlur={handleBlur}
                    onChange={handleInputUpdate}
                    placeholder={name}
                    value={value}
                  />
                </Form>
              ) : (
                <Name onClick={handleNameClick}>{sandboxName()}</Name>
              )}
              {currentSandbox.customTemplate ? (
                <TemplateBadge color={currentSandbox.customTemplate.color}>
                  Template
                </TemplateBadge>
              ) : null}
            </Container>
          )}
        />
      )}
    </Spring>
  );
});
