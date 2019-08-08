import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import { useStore } from 'app/store';
import { LikeHeart } from './elements';

export const LikeButton = inject('store')(
  hooksObserver(({ store: { editor: { currentSandbox } } }) => {
    return (
      <LikeHeart
        colorless
        text={currentSandbox.likeCount}
        sandbox={currentSandbox}
        disableTooltip
        highlightHover
      />
    );
  })
);
