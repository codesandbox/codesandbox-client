import React from 'react';

import ErrorIcon from 'react-icons/lib/md/error';

import { RedIcon, SVGIcon } from './elements';

const getIcon = (type, error, width, height) => {
  if (error) {
    return (
      <RedIcon>
        <ErrorIcon width={width} height={height} />
      </RedIcon>
    );
  }

  return <SVGIcon type={type} width={width} height={height} />;
};

function EntryIcon({ type, width = 16, height = 16, error }) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {getIcon(type, error, width, height)}
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};

export default EntryIcon;
