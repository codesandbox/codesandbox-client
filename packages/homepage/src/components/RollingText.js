import React from 'react';

import { TimelineMax, TweenMax } from 'gsap';

export default class RollingText extends React.Component {
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
    this.fadeInTL = new TimelineMax({ paused: true });
    this.fadeInTL.fromTo(
      this.fadein,
      0.8,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 }
    );

    this.fadeOutTL = new TimelineMax({ paused: true });
    this.fadeOutTL.fromTo(
      this.fadeout,
      0.8,
      { opacity: 1, y: 0 },
      { opacity: 0, y: -20 }
    );

    TweenMax.set(this.fadein, { opacity: 1, y: 0 });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.oldChildren = this.props.children;
      this.fadeInTL.restart();
      this.fadeOutTL.restart();
    }
  }

  render() {
    const { children, className, style } = this.props;
    const oldChildren = this.oldChildren;

    return (
      <div
        className={className}
        style={{ display: 'inline-block', position: 'relative', ...style }}
      >
        <div
          style={{ position: 'absolute', left: 0 }}
          ref={el => {
            this.fadeout = el;
          }}
        >
          {oldChildren}
        </div>
        <div
          style={{ display: 'inline-block', width: 'inherit' }}
          ref={el => {
            this.fadein = el;
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
