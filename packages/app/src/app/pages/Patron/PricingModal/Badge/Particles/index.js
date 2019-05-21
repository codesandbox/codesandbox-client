import badges from '@codesandbox/common/lib/utils/badges/patron-info';
import React, { useEffect, useRef } from 'react';

import { Particle } from './elements';

const classNameRegex = /\shide/g;

const showElement = (el: HTMLElement) => {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', el.className.baseVal.replace(classNameRegex, ''));
  } else {
    el.className = el.className.replace(classNameRegex, ''); // eslint-disable-line no-param-reassign
  }
};

const hideElement = (el: HTMLElement) => {
  if (el.nodeName === 'svg') {
    el.setAttribute('class', `${el.className.baseVal} hide`);
  } else {
    el.className += ' hide'; // eslint-disable-line no-param-reassign
  }
};

const createParticles = (amount: number, badge) =>
  Array(amount)
    .fill(0)
    .map((_, i) => (
      <Particle
        key={`${i}_${badge}`} // eslint-disable-line
        className={`${badge}-particle particle hide`}
        i={i}
        deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
        badge={badge}
      />
    ));

const makeItRainFn = () => {
  const particleSelector = [...document.getElementsByClassName('particle')];

  particleSelector.forEach(hideElement);

  requestAnimationFrame(() => {
    particleSelector.forEach(showElement);
  });
};

const Particles = ({ badge, makeItRain }) => {
  const timeout = useRef(null);

  useEffect(() => {
    const particleSelector = [
      ...document.getElementsByClassName(`${badge}-particle`),
    ];

    particleSelector.forEach(hideElement);

    requestAnimationFrame(() => {
      particleSelector.forEach(showElement);
    });

    clearTimeout(timeout.current);

    timeout.current = setTimeout(() => {
      const allParticleSelector = document.getElementsByClassName('particle');

      [...allParticleSelector].forEach(hideElement);
    }, 700);
  }, [badge]);

  useEffect(() => {
    if (makeItRain) {
      makeItRainFn();
    }
  }, [makeItRain]);

  return (
    <div>
      {Object.entries(badges).map(([name, { particleCount }]) =>
        createParticles(particleCount, name)
      )}
    </div>
  );
};

export default Particles;
