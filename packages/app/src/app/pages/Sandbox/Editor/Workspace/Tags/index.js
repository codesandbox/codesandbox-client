import React from 'react';
import { inject, observer } from 'mobx-react';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/buttons/Button';
import TagsComponent from 'app/components/sandbox/Tags';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

function Tags({ store, signals }) {
  const tags = store.editor.currentSandbox.tags;
  const isOwner = store.editor.currentSandbox.owned;

  return (
    <div>
      {tags.length > 0 && (
        <div>
          <WorkspaceSubtitle>Tags</WorkspaceSubtitle>
          <div style={{ fontSize: '.875rem' }}>
            <TagsComponent
              tags={tags}
              removeTag={isOwner && signals.editor.workspace.tagRemoved}
            />
          </div>
        </div>
      )}

      {isOwner && (
        <div>
          <WorkspaceSubtitle>Add up to 5 tags</WorkspaceSubtitle>
          <WorkspaceInputContainer>
            <input
              onChange={event => {
                signals.editor.workspace.tagChanged({
                  tagName: event.target.value,
                });
              }}
              value={store.editor.workspace.tags.tagName}
              onKeyUp={event => {
                if (event.keyCode === 13) {
                  signals.editor.workspace.tagAdded();
                }
              }}
              placeholder="Add a tag"
            />
          </WorkspaceInputContainer>
          <Margin horizontal={1} vertical={0.5}>
            <Button
              onClick={() => {
                signals.editor.workspace.tagAdded();
              }}
              disabled={tags.length >= 5}
              block
              small
            >
              Add Tag
            </Button>
          </Margin>
        </div>
      )}
    </div>
  );
}

export default inject('store', 'signals')(observer(Tags));
