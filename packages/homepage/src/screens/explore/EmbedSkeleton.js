import React from 'react';
import { Header, NavigationBar, StatusBar } from './_EmbedSkeleton.elements';

export default ({ id, screenshotUrl, style }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      zIndex: 10,
      ...style,
    }}
  >
    <Header />
    <NavigationBar />

    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          // TODO CHANGE THIS TO THE URL GIVEn TO THE SANDBOX SO IT CAN BE PReCHACED
          backgroundImage: `url("${screenshotUrl ||
            `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
          transform: 'scale(1.025, 1.025)',
          width: '100%',
          height: '100%',
          filter: 'blur(2px)',
        }}
      />
    </div>
    <StatusBar />
  </div>
);
