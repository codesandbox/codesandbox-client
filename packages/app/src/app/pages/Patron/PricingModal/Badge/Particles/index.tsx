import * as React from 'react';

import badges from 'common/utils/badges/patron-info';
import { Particle } from './elements';

const classNameRegex = /\shide/g;

function showElement(el: SVGElement) {
    if (el.nodeName === 'svg') {
        el.setAttribute('class', el.className.baseVal.replace(classNameRegex, ''));
    } else {
        el.setAttribute('class', el.className.replace(classNameRegex, ''));
    }
}

function hideElement(el: SVGElement) {
    if (el.nodeName === 'svg') {
        el.setAttribute('class', `${el.className.baseVal} hide`);
    } else {
        el.setAttribute('class', el.className + ' hide');
    }
}

const createParticles = (amount: number, badge) =>
    Array(amount).fill(0).map((_, i) => (
        <Particle
            key={`${i}_${badge}`} // eslint-disable-line
            className={`${badge}-particle particle hide`}
            i={i}
            deg={180 + (Math.floor(amount / 2) + i) * (360 / amount)}
            badge={badge}
        />
    ));

type Props = {
    badge: string;
    makeItRain: boolean;
};

export default class Particles extends React.Component<Props> {
    timeout?: NodeJS.Timer;

    makeItRain = () => {
        const particleSelector = document.getElementsByClassName('particle');

        Array.prototype.forEach.call(particleSelector, hideElement);

        requestAnimationFrame(() => {
            Array.prototype.forEach.call(particleSelector, showElement);
        });
    };

    shouldComponentUpdate(nextProps) {
        if (nextProps.badge !== this.props.badge) {
            const particleSelector = document.getElementsByClassName(`${nextProps.badge}-particle`);

            Array.prototype.forEach.call(particleSelector, hideElement);

            requestAnimationFrame(() => {
                Array.prototype.forEach.call(particleSelector, showElement);
            });

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(() => {
                const allParticleSelector = document.getElementsByClassName('particle');
                Array.prototype.forEach.call(allParticleSelector, hideElement);
            }, 700);
        }

        if (!this.props.makeItRain && nextProps.makeItRain) {
            this.makeItRain();
        }

        return false;
    }

    render() {
        return <div>{Object.keys(badges).map((badge) => createParticles(badges[badge].particleCount, badge))}</div>;
    }
}
