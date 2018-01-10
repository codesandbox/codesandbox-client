import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';
import TagsComponent from 'app/components/Tags';

import { WorkspaceInputContainer } from '../elements';
import { PlusIcon } from './elements';

class Tags extends React.Component {
  state = {
    editing: false,
  };

  startEditing = () => {
    this.setState({ editing: true });
  };

  addTag = () => {
    this.props.signals.workspace.tagAdded();
  };

  render() {
    const { store, signals } = this.props;

    const tags = store.editor.currentSandbox.tags;
    const isOwner = store.editor.currentSandbox.owned;

    return (
      <div>
        {tags.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                fontSize: '.875rem',
                alignItems: 'center',
                margin: '.75rem',
                marginTop: 0,
              }}
            >
              <TagsComponent
                tags={tags}
                removeTag={isOwner && signals.workspace.tagRemoved}
              />
              {tags.length < 5 &&
                isOwner && <PlusIcon onClick={this.startEditing}>+</PlusIcon>}
            </div>
          </div>
        )}

        {isOwner &&
          this.state.editing && (
            <WorkspaceInputContainer>
              <input
                ref={el => {
                  if (el) {
                    el.focus();
                  }
                }}
                onChange={event => {
                  signals.workspace.tagChanged({
                    tagName: event.target.value,
                  });
                }}
                value={store.workspace.tags.tagName}
                onKeyUp={event => {
                  if (event.keyCode === 13) {
                    this.addTag();
                  }
                }}
                placeholder="Tag name"
              />
              <Button
                onClick={this.addTag}
                disabled={tags.length >= 5}
                block
                small
                style={{ width: 64 }}
              >
                Add
              </Button>
            </WorkspaceInputContainer>
          )}
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(Tags));
