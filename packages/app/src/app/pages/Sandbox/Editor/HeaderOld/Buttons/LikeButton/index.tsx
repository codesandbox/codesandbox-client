import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

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
      sandbox={currentSandbox || ({ id: null, userLiked: false } as any)}
      text={currentSandbox ? currentSandbox.likeCount : 0}
    />
  );
};
