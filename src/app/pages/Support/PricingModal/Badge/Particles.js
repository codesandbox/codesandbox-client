import React from 'react';
import styled, {keyframes} from 'styled-components';

import badges from './badge-info';

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
    transform: rotate(${deg}deg) translateY(${200 + (i % 2) * 50}px) scale3d(0, 0, 0);
  }
`

const Particle = styled.div`
  animation: ${props => particleAnimation(props.deg, props.i)} 700ms ease;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => badges[props.badge].color};
  box-shadow: 0 0 5px ${props => badges[props.badge].color};
`;

const createParticles = (amount: number, badge) => (
  Array(amount).fill(0).map((_, i) =>
    <Particle className={`${badge}-particle particle hide`} i={i} deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)} badge={badge} />
  )
)

type Props = {
  badge: 'ruby' | 'sapphire' | 'rupee' | 'diamond',
};

export default class Particles extends React.PureComponent {
  props: Props;

  shouldComponentUpdate(nextProps) {
    if (nextProps.badge !== this.props.badge) {
      const particleSelector = document.getElementsByClassName(`${nextProps.badge}-particle`);

      Array.forEach(particleSelector, hideElement);

      requestAnimationFrame(() => {
        Array.forEach(particleSelector, showElement);
      })
    }
    return false;
  }

  render() {
    return (
      <div>
        {Object.keys(badges).map(badge => (
          createParticles(badges[badge].particleCount, badge)
        ))}
      </div>
    )
  }
}
