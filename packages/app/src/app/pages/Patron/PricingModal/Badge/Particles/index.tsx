import React from 'react';
import { forEach } from 'lodash-es';

import { PatronBadge } from '@codesandbox/common/lib/types';
import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import { Particle } from './elements';

const classNameRegex = /\shide/g;

function showElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute(
      'class',
      el.getAttribute('class').replace(classNameRegex, '')
    );
  } else {
    el.className = el.className.replace(classNameRegex, ''); // eslint-disable-line no-param-reassign
  }
}

function hideElement(el: HTMLElement) {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', `${el.getAttribute('class')} hide`);
  } else {
    el.className += ' hide'; // eslint-disable-line no-param-reassign
  }
}

const createParticles = (amount: number, badge) =>
  Array(amount)
    .fill(0)
    .map((_, i) => (
      <Particle
        // eslint-disable-next-line
        key={`${i}_${badge}`}
        i={i}
        className={`${badge}-particle particle hide`}
        deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
        badge={badge}
      />
    ));

type ParticlesProps = {
  badge: PatronBadge;
  makeItRain: boolean;
};

export class Particles extends React.Component<ParticlesProps> {
  makeItRain = () => {
    const particleSelector = document.getElementsByClassName('particle');
    forEach(particleSelector, hideElement);

    requestAnimationFrame(() => {
      forEach(particleSelector, showElement);
    });
  };

  timeout?: NodeJS.Timeout;

  shouldComponentUpdate(nextProps: ParticlesProps) {
    if (nextProps.badge !== this.props.badge) {
      const particleSelector = document.getElementsByClassName(
        `${nextProps.badge}-particle`
      );

      forEach(particleSelector, hideElement);

      requestAnimationFrame(() => {
        forEach(particleSelector, showElement);
      });

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        const allParticleSelector = document.getElementsByClassName('particle');
        forEach(allParticleSelector, hideElement);
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
