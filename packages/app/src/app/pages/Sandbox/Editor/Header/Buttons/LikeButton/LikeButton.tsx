import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { LikeHeart } from './elements';

export const LikeButton: FunctionComponent = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  return (
    <LikeHeart
      colorless
      text={currentSandbox.likeCount}
      sandbox={currentSandbox}
      disableTooltip
      highlightHover
    />
  );
};
