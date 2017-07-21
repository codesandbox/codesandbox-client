import React from 'react';
import styled, { css, keyframes } from 'styled-components';

import badges from 'app/utils/badges/patron-info';

const classNameRegex = /\shide/g;
function showElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', el.className.baseVal.replace(classNameRegex, ''));
  } else {
    el.className = el.className.replace(classNameRegex, ''); // eslint-disable-line no-param-reassign
  }
}

function hideElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', `${el.className.baseVal} hide`);
  } else {
    el.className += ' hide'; // eslint-disable-line no-param-reassign
  }
}

const particleAnimation = (deg: number, i: number) => keyframes`
  0% {
    transform: rotate(${deg}deg) translateY(50px) scale3d(1, 1, 1);
  }

  100% {
    transform: rotate(${deg}deg) translateY(${200 +
  Math.random() * 100}px) scale3d(0, 0, 0);
  }
`;

const Particle = styled.div`
  animation: ${props => particleAnimation(props.deg, props.i)} 700ms ease;
  position: absolute;
  top: 0;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  ${props => {
    const color =
      badges[props.badge].colors[props.i % badges[props.badge].colors.length];

    return css`
    background-color: ${color};
    box-shadow: 0 0 5px ${color};
    `;
  }};
`;

const createParticles = (amount: number, badge) =>
  Array(amount)
    .fill(0)
    .map((_, i) =>
      <Particle
        className={`${badge}-particle particle hide`}
        i={i}
        deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
        badge={badge}
      />,
    );

type Props = {
  makeItRain: boolean,
  badge: 'patron-1' | 'patron-2' | 'patron-3' | 'patron-4',
};

export default class Particles extends React.PureComponent {
  props: Props;

  makeItRain = () => {
    const particleSelector = document.getElementsByClassName('particle');
    Array.forEach(particleSelector, hideElement);

    requestAnimationFrame(() => {
      Array.forEach(particleSelector, showElement);
    });
  };

  timeout: ?number;

  shouldComponentUpdate(nextProps) {
    if (nextProps.badge !== this.props.badge) {
      const particleSelector = document.getElementsByClassName(
        `${nextProps.badge}-particle`,
      );

      Array.forEach(particleSelector, hideElement);

      requestAnimationFrame(() => {
        Array.forEach(particleSelector, showElement);
      });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        const allParticleSelector = document.getElementsByClassName('particle');
        Array.forEach(allParticleSelector, hideElement);
      }, 700);
    }

    if (!this.props.makeItRain && nextProps.makeItRain) {
      this.makeItRain();
    }

    return false;
  }

  render() {
    return (
      <div>
        {Object.keys(badges).map(badge =>
          createParticles(badges[badge].particleCount, badge),
        )}
      </div>
    );
  }
}
