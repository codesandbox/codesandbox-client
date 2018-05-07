import React from 'react';
import Tests from 'app/components/Preview/DevTools/Tests';

import VerticalAlign from 'app/src/app/components/Preview/Navigator/VerticalAlign';
import HorizontalAlign from 'app/src/app/components/Preview/Navigator/HorizontalAlign';

import Navigator from './Navigator';

export default ({ alignRight, alignBottom }) => {
  const actions = [
    {
      title: 'Align To Bottom',
      onClick: alignBottom,
      Icon: HorizontalAlign,
    },
    {
      title: 'Align To Right',
      onClick: alignRight,
      Icon: VerticalAlign,
    },
  ];
  return (
    <div>
      <Navigator title="Tests" actions={actions} />
      <Tests.Content standalone />
    </div>
  );
};
