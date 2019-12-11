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
      disableTooltip
      highlightHover
      sandbox={currentSandbox}
      text={currentSandbox.likeCount}
    />
  );
};
