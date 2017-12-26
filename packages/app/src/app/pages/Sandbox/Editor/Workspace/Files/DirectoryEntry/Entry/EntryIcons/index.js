import React from 'react';

import ErrorIcon from 'react-icons/lib/md/error';

import { RedIcon, SVGIcon } from './elements';

const getIcon = (type, error) => {
  if (error) {
    return (
      <RedIcon>
        <ErrorIcon />
      </RedIcon>
    );
  }

  return <SVGIcon type={type} />;
};

function EntryIcon({ type, error }) {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {getIcon(type, error)}
    </div>
  );
}

EntryIcon.defaultProps = {
  isOpen: false,
};

export default EntryIcon;
