import React from 'react';

import Preview from 'app/components/sandbox/Preview';

export default class ShowcasePreview extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div
        style={{
          height: 500,
          marginBottom: '2rem',
          boxShadow: '0 3px 3px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Preview />
      </div>
    );
  }
}
