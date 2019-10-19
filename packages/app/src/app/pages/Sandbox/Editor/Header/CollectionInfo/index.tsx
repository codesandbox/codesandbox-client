import { Sandbox } from '@codesandbox/common/lib/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxName as getSandboxNameBase } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { basename } from 'path';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';
import Media from 'react-media';
import { Spring } from 'react-spring/renderprops';

import { useOvermind } from 'app/overmind';

import {
  Container,
  FolderName,
  SandboxForm,
  SandboxInput,
  SandboxName,
} from './elements';

type Props = {
  sandbox: Sandbox;
};
export const CollectionInfo: FunctionComponent<Props> = ({ sandbox }) => {
  const {
    actions: {
      modalOpened,
      workspace: { sandboxInfoUpdated, valueChanged },
    },
    state: { isLoggedIn },
  } = useOvermind();
  const [nameValue, setNameValue] = useState('');
  const [updatingName, setUpdatingName] = useState(false);

  const getSandboxName = () => getSandboxNameBase(sandbox) || 'Untitled';
  const updateSandboxInfo = () => {
    sandboxInfoUpdated();

    setUpdatingName(false);
  };

  const submitNameChange = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateSandboxInfo();

    track('Change Sandbox Name From Header');
  };
  const handleKeyUp = ({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
    if (keyCode === ESC) {
      updateSandboxInfo();
    }
  };
  const handleBlur = () => {
    updateSandboxInfo();
  };
  const handleInputUpdate = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    valueChanged({ field: 'title', value });

    setNameValue(value);
  };
  const handleNameClick = () => {
    setNameValue(getSandboxName());
    setUpdatingName(true);
  };

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
                  <div style={{ ...style, overflow: 'hidden' }}>
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
                  {getSandboxName()}
                </SandboxName>
              )}
            </Container>
          )}
        />
      )}
    </Spring>
  );
};
