import React from 'react';

import badges from 'common/utils/badges/patron-info';
import { Particle } from './elements';

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

const createParticles = (amount: number, badge) =>
  Array(amount)
    .fill(0)
    .map((_, i) => (
      <Particle
        className={`${badge}-particle particle hide`}
        i={i}
        deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
        badge={badge}
      />
    ));

export default class Particles extends React.PureComponent {
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
        `${nextProps.badge}-particle`
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
          createParticles(badges[badge].particleCount, badge)
        )}
      </div>
    );
  }
}
