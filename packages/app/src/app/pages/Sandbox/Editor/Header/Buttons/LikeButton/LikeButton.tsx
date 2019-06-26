import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'app/store';
import { LikeHeart } from './elements';

export const LikeButton = observer(() => {
  const store = useStore();
  const {
    editor: { currentSandbox },
  } = store;

  return (
    <LikeHeart
      colorless
      text={currentSandbox.likeCount}
      sandbox={currentSandbox}
      disableTooltip
      highlightHover
    />
  );
});
