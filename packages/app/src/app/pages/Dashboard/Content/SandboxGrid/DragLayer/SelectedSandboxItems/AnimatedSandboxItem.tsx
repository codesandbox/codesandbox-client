import React, { useState, useEffect, FunctionComponent } from 'react';
import { Spring, animated, interpolate } from 'react-spring/renderprops';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
} from './elements';

type Props = {
  id: string;
  index: number;
  isLast: boolean;
  scale: number;
  selectedSandboxes: string[];
  x: number;
  y: number;
};
export const AnimatedSandboxItem: FunctionComponent<Props> = ({
  id,
  index,
  isLast,
  scale,
  selectedSandboxes,
  x,
  y,
}) => {
  const [render, setRender] = useState(true);
  const [position, setPosition] = useState<DOMRect>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const sandboxBrotherItem = document.getElementById(id);

    if (sandboxBrotherItem) {
      setPosition(sandboxBrotherItem.getBoundingClientRect() as DOMRect);
    }

    if (index !== 0 && !isLast) {
      timeout = global.setTimeout(() => {
        setRender(false);
      }, 200);
    }

    return () => {
      if (timeout) {
        global.clearTimeout(timeout);
      }
    };
  }, [id, index, isLast]);

  if (!render || !position) {
    return null;
  }

  return (
    <Spring
      native
      immediate={index === 0 ? el => el !== 'scale' : false}
      from={{ x: position.x, y: position.y, shadow: 2, scale: 1 }}
      to={{ scale, x, y, shadow: isLast ? 16 : 2 }}
      key={id}
    >
      {({ x: newX, y: newY, scale: newScale, shadow: newShadow }) => (
        <animated.div
          style={{
            position: 'absolute',
            willChange: 'transform',
            boxShadow:
              index === 0 || isLast
                ? interpolate(
                    [newShadow],
                    s => `0 ${s}px ${s * 2}px rgba(0, 0, 0, 0.3)`
                  )
                : 'inherit',
            transform: interpolate(
              [newX, newY, newScale],
              (xx, yy, zz) =>
                `translate3d(${xx}px, ${yy}px, 0px) scale3d(${zz}, ${zz}, ${zz})`
            ),
            zIndex: index === 0 ? 20 : 10,
          }}
        >
          <Container>
            <SandboxImageContainer>
              <SandboxImage
                style={{
                  backgroundImage: `url(https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png)`,
                }}
              />
            </SandboxImageContainer>

            <SandboxInfo>
              {`${selectedSandboxes.length} ${
                selectedSandboxes.length === 1 ? 'Sandbox' : 'Sandboxes'
              }`}
            </SandboxInfo>
          </Container>
        </animated.div>
      )}
    </Spring>
  );
};
