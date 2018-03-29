import * as React from 'react';

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

type Props = {
  type: string
  width?: number
  height?: number
  error: boolean
}

const EntryIcon: React.SFC<Props> = ({ type, width = 16, height = 16, error }) => {
  return (
    <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {getIcon(type, error, width, height)}
    </div>
  );
}

export default EntryIcon;
