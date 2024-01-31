import React from 'react';

import { Element } from '../Element';
import { IconButton } from '../IconButton';

interface BannerProps {
  children: React.ReactNode;
  onDismiss?: () => void;
}

export const Banner = ({ children, onDismiss }: BannerProps) => {
  return (
    <Element
      css={{
        position: 'relative',
        padding: [7, 8, 8],
        backgroundColor: '#252525',
        borderRadius: '4px',
      }}
    >
      {children}

      {onDismiss ? (
        <Element
          css={{ position: 'absolute', right: [1, 2, 4], top: [1, 2, 4] }}
        >
          <IconButton
            name="cross"
            variant="square"
            title="Dismiss"
            onClick={onDismiss}
          />
        </Element>
      ) : null}
    </Element>
  );
};
