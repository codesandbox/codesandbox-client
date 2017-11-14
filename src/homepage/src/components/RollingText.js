import React from 'react';
import styled from 'styled-components';

import { TimelineLite } from 'gsap';

const FadeOut = styled.span`
  position: absolute;
  left: 0;
`;

const FadeIn = styled.div`
  display: inline-block;
  width: inherit;
`;

export default class RollingText extends React.PureComponent {
  state = {
    oldChildren: null,
  };

  shouldComponentUpdate(nextProps) {
    return (
      !this.props.updateCheck ||
      nextProps.updateCheck !== this.props.updateCheck
    );
  }

  componentDidMount() {
    this.fadeInTL = new TimelineLite({ paused: true });
    this.fadeInTL.fromTo(
      this.fadein,
      0.8,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 }
    );

    this.fadeOutTL = new TimelineLite({ paused: true });
    this.fadeOutTL.fromTo(
      this.fadeout,
      0.8,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -20 }
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.oldChildren = this.props.children;
      this.fadeInTL.restart();
      this.fadeOutTL.restart();
    }
  }

  render() {
    const { children, className, style, ...props } = this.props;
    const oldChildren = this.oldChildren;

    return (
      <div
        className={className}
        style={{ display: 'inline-block', position: 'relative', ...style }}
        {...props}
      >
        <FadeOut
          innerRef={el => {
            this.fadeout = el;
          }}
        >
          {oldChildren}
        </FadeOut>
        <FadeIn
          innerRef={el => {
            this.fadein = el;
          }}
        >
          {children}
        </FadeIn>
      </div>
    );
  }
}
