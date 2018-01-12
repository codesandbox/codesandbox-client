import React from 'react';
import { inject, observer } from 'mobx-react';

import TagsComponent from 'app/components/Tags';

const Tags = ({ store }) => {
  const tags = store.editor.currentSandbox.tags;

  return (
    <div>
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
          <TagsComponent tags={tags} />
        </div>
      </div>
    </div>
  );
};
export default inject('store')(observer(Tags));
