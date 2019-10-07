import React from 'react';
import styled from 'styled-components';
import { TimelineMax, Power2 } from 'gsap';

import Relative from '@codesandbox/common/lib/components/Relative';

import browserSvg from './browser.svg';
import codesandboxSvg from './codesandbox.svg';
import eggheadSvg from './egghead.svg';
import mediumSvg from './medium.svg';
import vueSvg from './vue.svg';

const AbsoluteImage = styled.img`
  position: absolute;
  left: 0;
`;

export default class EmbedAnimation extends React.PureComponent {
  componentDidMount() {
    const DELAY_TIME = 1.5;
    const ANIMATION_TIME = 0.8;

    this.tl = new TimelineMax({ repeat: -1 })
      .to(this.codesandbox, ANIMATION_TIME, {
        scale: 0.4,
        y: 10,
        delay: DELAY_TIME,
        ease: Power2.easeInOut,
      })
      .to(this.medium, ANIMATION_TIME, {
        delay: DELAY_TIME,
        autoAlpha: 0,
        ease: Power2.easeInOut,
      })
      .to(
        this.codesandbox,
        ANIMATION_TIME,
        {
          x: -45,
          y: -5,
          scale: 0.5,
          ease: Power2.easeInOut,
        },
        `-=${ANIMATION_TIME}`
      )
      .to(this.egghead, ANIMATION_TIME, {
        delay: DELAY_TIME,
        autoAlpha: 0,
        ease: Power2.easeInOut,
      })
      .to(
        this.codesandbox,
        ANIMATION_TIME,
        {
          x: 0,
          y: 10,
          scale: 0.385,
          ease: Power2.easeInOut,
        },
        `-=${ANIMATION_TIME}`
      )
      .to(this.codesandbox, ANIMATION_TIME, {
        delay: DELAY_TIME,
        x: 0,
        y: 0,
        scale: 1,
        ease: Power2.easeInOut,
      });
  }

  render() {
    return (
      <Relative>
        <img
          alt="Browser"
          style={{ boxShadow: '0 5px 8px rgba(0, 0, 0, 0.3)' }}
          src={browserSvg}
          loading="lazy"
        />
        <AbsoluteImage
          ref={el => {
            this.vue = el;
          }}
          src={vueSvg}
          alt="VueJS"
        />
        <AbsoluteImage
          ref={el => {
            this.egghead = el;
          }}
          src={eggheadSvg}
          alt="Egghead.io"
        />
        <AbsoluteImage
          ref={el => {
            this.medium = el;
          }}
          src={mediumSvg}
          alt="Medium"
        />
        <AbsoluteImage
          ref={el => {
            this.codesandbox = el;
          }}
          src={codesandboxSvg}
          alt="CodeSandbox Editor"
        />
      </Relative>
    );
  }
}
