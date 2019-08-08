import React from 'react';
import { basename } from 'path';
import { inject, observer } from 'app/componentConnectors';
import Media from 'react-media';

import { Spring } from 'react-spring/renderprops';

import track from '@codesandbox/common/lib/utils/analytics';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { Container, SandboxName, SandboxInput, FolderName } from './elements';

class CollectionInfo extends React.Component {
  state = {
    updatingName: false,
    nameValue: '',
    collectionNameWidth: undefined,
  };

  sandboxName = () => getSandboxName(this.props.sandbox) || 'Untitled';

  updateSandboxInfo = () => {
    this.props.signals.workspace.sandboxInfoUpdated();

    this.setState({
      updatingName: false,
    });
  };

  submitNameChange = e => {
    e.preventDefault();
    this.updateSandboxInfo();

    track('Change Sandbox Name From Header');
  };

  handleNameClick = () => {
    this.setState({
      updatingName: true,
      nameValue: this.sandboxName(),
    });
  };

  handleKeyUp = e => {
    if (e.keyCode === ESC) {
      this.updateSandboxInfo();
    }
  };

  handleBlur = () => {
    this.updateSandboxInfo();
  };

  handleInputUpdate = e => {
    this.props.signals.workspace.valueChanged({
      field: 'title',
      value: e.target.value,
    });

    this.setState({
      nameValue: e.target.value,
    });
  };

  initializeWidth = el => {
    this.collectionNameEl = this.collectionNameEl || el;
    if (this.collectionNameEl) {
      const width = this.collectionNameEl.getBoundingClientRect().width;

      this.setState({ collectionNameWidth: width });
    }
  };

  render() {
    const { sandbox, isLoggedIn, signals } = this.props;
    const { nameValue, updatingName } = this.state;

    const value = nameValue !== 'Untitled' && updatingName ? nameValue : '';

    const folderName = sandbox.collection
      ? basename(sandbox.collection.path) ||
        (sandbox.team ? sandbox.team.name : 'My Sandboxes')
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
                      ref={this.initializeWidth}
                      style={{ ...style, overflow: 'hidden' }}
                    >
                      {isLoggedIn ? (
                        <FolderName
                          onClick={() => {
                            signals.modalOpened({
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
                  <form
                    css={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onSubmit={this.submitNameChange}
                  >
                    <SandboxInput
                      autoFocus
                      innerRef={el => {
                        if (el) {
                          el.focus();
                        }
                      }}
                      onKeyUp={this.handleKeyUp}
                      onBlur={this.handleBlur}
                      onChange={this.handleInputUpdate}
                      placeholder={nameValue}
                      value={value}
                    />
                  </form>
                ) : (
                  <SandboxName onClick={this.handleNameClick}>
                    {this.sandboxName()}
                  </SandboxName>
                )}
              </Container>
            )}
          />
        )}
      </Spring>
    );
  }
}

export default inject('signals')(observer(CollectionInfo));
