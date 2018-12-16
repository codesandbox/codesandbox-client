import React from 'react';
import Console from 'app/components/Preview/DevTools/Console';

import VerticalAlign from 'app/src/app/components/Preview/Navigator/VerticalAlign';
import HorizontalAlign from 'app/src/app/components/Preview/Navigator/HorizontalAlign';

import Navigator from './Navigator';

export default ({ alignRight, alignBottom }) => {
  const actions = [
    ...Console.actions,
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
    <div
      css={`
        height: 100%;
      `}
    >
      <Navigator title="Console" actions={actions} />
      <Console.Content />
    </div>
  );
};
