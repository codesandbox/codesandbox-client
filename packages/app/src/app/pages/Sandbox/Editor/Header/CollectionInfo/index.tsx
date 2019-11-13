import React, { useCallback, useState } from 'react';
import { basename } from 'path';
import { useOvermind } from 'app/overmind';
import Media from 'react-media';

import { Spring } from 'react-spring/renderprops';

import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Sandbox } from '@codesandbox/common/lib/types';
import {
  Container,
  SandboxName,
  SandboxForm,
  SandboxInput,
  FolderName,
} from './elements';

interface ICollectionInfoProps {
  sandbox: Sandbox;
  isLoggedIn: boolean;
}

const CollectionInfo: React.FC<ICollectionInfoProps> = ({
  sandbox,
  isLoggedIn,
}) => {
  const [updatingName, setUpdatingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged },
      modalOpened,
    },
  } = useOvermind();

  const sandboxName = useCallback(() => getSandboxName(sandbox) || 'Untitled', [
    sandbox,
  ]);

  const updateSandboxInfo = useCallback(() => {
    sandboxInfoUpdated();
    setUpdatingName(false);
  }, [sandboxInfoUpdated]);

  const submitNameChange = useCallback(
    e => {
      e.preventDefault();
      updateSandboxInfo();

      track('Change Sandbox Name From Header');
    },
    [updateSandboxInfo]
  );

  const handleNameClick = useCallback(() => {
    setUpdatingName(true);
    setNameValue(sandboxName());
  }, [sandboxName]);

  const handleKeyUp = useCallback(
    e => {
      if (e.keyCode === ESC) {
        updateSandboxInfo();
      }
    },
    [updateSandboxInfo]
  );

  const handleBlur = useCallback(() => {
    updateSandboxInfo();
  }, [updateSandboxInfo]);

  const handleInputUpdate = useCallback(
    e => {
      valueChanged({
        field: 'title',
        value: e.target.value,
      });

      setNameValue(e.target.value);
    },
    [valueChanged]
  );

  const value = nameValue !== 'Untitled' && updatingName ? nameValue : '';

  const folderName = sandbox.collection
    ? basename(sandbox.collection.path) ||
      (sandbox.team ? sandbox.team.name : 'My Sandboxes')
    : 'My Sandboxes';

  return (
    <Spring<{ opacity: number; pointerEvents: 'none' | 'initial' }>
      from={{
        opacity: 1,
      }}
      to={
        updatingName
          ? {
              opacity: 0,
              pointerEvents: 'none',
            }
          : {
              opacity: 1,
              pointerEvents: 'initial',
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
                  <div
                    style={{
                      ...style,
                      overflow: 'hidden',
                    }}
                  >
                    {isLoggedIn ? (
                      <FolderName
                        onClick={() => {
                          modalOpened({
                            modal: 'moveSandbox',
                          });
                        }}
                      >
                        {folderName}
                      </FolderName>
                    ) : (
                      'Anonymous '
                    )}
                    /{' '}
                  </div>
                )}
              />
              {updatingName ? (
                <SandboxForm onSubmit={submitNameChange}>
                  <SandboxInput
                    autoFocus
                    innerRef={el => {
                      if (el) {
                        el.focus();
                      }
                    }}
                    onKeyUp={handleKeyUp}
                    onBlur={handleBlur}
                    onChange={handleInputUpdate}
                    placeholder={nameValue}
                    value={value}
                  />
                </SandboxForm>
              ) : (
                <SandboxName onClick={handleNameClick}>
                  {sandboxName()}
                </SandboxName>
              )}
            </Container>
          )}
        />
      )}
    </Spring>
  );
};

export { CollectionInfo };
