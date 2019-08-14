import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import { LikeHeart } from './elements';

export const LikeButton = inject('store')(
  hooksObserver(({ store: { editor: { currentSandbox } } }) => (
    <LikeHeart
      colorless
      text={currentSandbox.likeCount}
      sandbox={currentSandbox}
      disableTooltip
      highlightHover
    />
  ))
);
