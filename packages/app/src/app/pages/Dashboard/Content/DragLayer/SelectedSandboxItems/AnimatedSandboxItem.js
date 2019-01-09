import React from 'react';
import { Spring, animated, interpolate } from 'react-spring';

import {
  Container,
  SandboxImageContainer,
  SandboxImage,
  SandboxInfo,
} from './elements';

type Props = {
  id: string,
  i: number,
  x: number,
  y: number,
  scale: number,
  isLast: boolean,
  selectedSandboxes: Array<string>,
};

export default class AnimatedSandboxItem extends React.Component<Props> {
  state = { render: true };
  componentWillMount() {
    const sandboxBrotherItem = document.getElementById(this.props.id);

    if (sandboxBrotherItem) {
      this.pos = sandboxBrotherItem.getBoundingClientRect();
    }

    if (this.props.i !== 0 && !this.props.isLast) {
      this.timeout = setTimeout(() => {
        this.setState({ render: false });
      }, 200);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { id, x, y, scale, i, isLast, selectedSandboxes } = this.props;

    if (!this.state.render || !this.pos) {
      return null;
    }

    return (
      <Spring
        native
        immediate={i === 0 ? el => el !== 'scale' : false}
        from={{ x: this.pos.x, y: this.pos.y, shadow: 2, scale: 1 }}
        to={{ scale, x, y, shadow: isLast ? 16 : 2 }}
        key={id}
      >
        {({ x: newX, y: newY, scale: newScale, shadow: newShadow }) => (
          <animated.div
            style={{
              position: 'absolute',
              willChange: 'transform',
              boxShadow:
                this.props.i === 0 || this.props.isLast
                  ? newShadow.interpolate(
                      s => `0 ${s}px ${s * 2}px rgba(0, 0, 0, 0.3)`
                    )
                  : 'inherit',
              transform: interpolate(
                [newX, newY, newScale],
                (xx, yy, zz) =>
                  `translate3d(${xx}px, ${yy}px, 0px) scale3d(${zz}, ${zz}, ${zz})`
              ),
              zIndex: i === 0 ? 20 : 10,
            }}
          >
            <Container i={i} isLast={isLast}>
              <SandboxImageContainer>
                <SandboxImage
                  style={{
                    backgroundImage: `url(${`https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`})`,
                  }}
                />
              </SandboxImageContainer>
              <SandboxInfo>
                {selectedSandboxes.length}{' '}
                {selectedSandboxes.length === 1 ? 'Sandbox' : 'Sandboxes'}
              </SandboxInfo>
            </Container>
          </animated.div>
        )}
      </Spring>
    );
  }
}
