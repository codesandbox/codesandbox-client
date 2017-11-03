import React from 'react';
import styled from 'styled-components';

import { TimelineMax, TweenMax, Power2, Power3, Elastic } from 'gsap';

import Cube from '../../components/Cube';
import media from '../../utils/media';
import getScrollPos from '../../utils/scroll';

const RADIUS = 300;

const Container = styled.div`
  flex: 2;
  position: relative;
  transform: translateX(${RADIUS}px) translateY(${125}px);

  ${media.tablet`
    flex: 1;
    transform: none;
    height: 200px;
  `};
`;

const SmallCube = styled.div`
  position: absolute;

  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;

  cursor: pointer;
  transform: scale(0.4, 0.4);

  ${media.tablet`
    ${({ selected }) => !selected && 'visibility: hidden'}
  `};
`;

export default class Cubes extends React.PureComponent {
  els = {};

  constructor(props) {
    super(props);

    this.state = {
      templates: props.templates.map((tem, i) => {
        const angle = Math.PI * 2 / props.templates.length * i;
        const x = RADIUS * Math.cos(angle);
        const y = RADIUS * Math.sin(angle);

        return {
          template: tem,
          x,
          y,
          offset: Math.random() * 120,
        };
      }),
      canvas: null,
    };
  }

  animate = () => {
    const delta = Date.now() - this.lastTick;

    if (delta < 0.15) {
      requestAnimationFrame(this.animate);
      return;
    }

    this.lastTick = Date.now();
    this.time = this.time + delta / 16000;

    this.state.templates.forEach((template, i) => {
      if (template.template === this.props.template) {
        return;
      }

      const angle = Math.PI * 2 / this.state.templates.length * i + this.time;
      const x = RADIUS * Math.cos(angle);
      const y = RADIUS * Math.sin(angle);

      const isLastTemplate = this.state.lastTemplate === template;

      TweenMax.to(
        this.els[template.template.name],
        isLastTemplate ? 0.8 : 0.15,
        {
          left: x,
          bottom: y,
        }
      );
    });

    requestAnimationFrame(this.animate);
  };

  componentDidMount() {
    requestAnimationFrame(() => {
      this.growCube(this.props.template, this.props.canvas).add(
        this.updateCubePos,
        '-=.6'
      );
    });

    window.onresize = () => {
      this.updateCubePos();
    };

    this.lastTick = Date.now();
    this.time = 0;

    this.animating = true;

    if (this.animating) {
      this.animate();
    }
  }

  updateCubePos = () => {
    if (this.props.canvas) {
      const pos = this.els[this.props.template.name].getBoundingClientRect();
      this.props.canvas.setCubePos(pos.x + 50, pos.y + 70 + getScrollPos().y);
    }
  };

  componentWillReceiveProps(nextProps) {
    const nextTemplate = nextProps.template;
    const currentTemplate = this.state.templates.find(
      t => t.template === this.props.template
    );

    if (nextTemplate !== currentTemplate.template) {
      this.shrinkCube(currentTemplate);
      this.setState({ lastTemplate: currentTemplate });
      setTimeout(() => {
        this.setState({ lastTemplate: null });
      }, 800);

      this.growCube(nextTemplate, nextProps.canvas);
    }
  }

  growCube = (template, canvas) => {
    const el = this.els[template.name];
    const rgb = template.color.lighten(0)()
      .match(/rgb\((.*)\)/)[1]
      .split(',');

    return new TimelineMax()
      .to(el, 0.8, { bottom: 0, left: 0, ease: Power3.easeIn })
      .to(el, 0.7, {
        scale: 1,
        ease: Elastic.easeOut,
      })
      .add(() => {
        if (canvas) {
          canvas.makeWave(canvas.cubeX, canvas.cubeY, rgb);
        }
      }, '-=.7');
  };

  shrinkCube = template => {
    const el = this.els[template.template.name];

    if (this.animating) {
      new TimelineMax().to(el, 0.7, { scale: 0.4, ease: Power2.easeOut });
    } else {
      new TimelineMax()
        .to(el, 0.8, { left: template.x, bottomy: template.y })
        .to(el, 0.7, { scale: 0.4, ease: Power2.easeOut }, '-=0.7');
    }
  };

  hoverCube = template => {
    const el = this.els[template.template.name];

    if (template.template === this.props.template) {
      return;
    }

    TweenMax.to(el, 0.3, {
      scale: 0.5,
    });
  };

  unhoverCube = template => {
    const el = this.els[template.template.name];

    if (template.template === this.props.template) {
      return;
    }

    TweenMax.to(el, 0.3, {
      scale: 0.4,
    });
  };

  render() {
    const { template } = this.props;
    return (
      <Container>
        {this.state.templates.map((t, i) => {
          const selected = template === t.template;

          return (
            <SmallCube
              innerRef={el => {
                this.els[t.template.name] = el;
              }}
              key={t.template.name}
              bottom={t.y}
              left={t.x}
              selected={selected}
              i={i}
              onMouseEnter={() => this.hoverCube(t)}
              onMouseLeave={() => this.unhoverCube(t)}
              onClick={() => this.props.setTemplate(t.template)}
            >
              <Cube
                color={t.template.color}
                offset={t.offset}
                speed={120}
                size={170}
              />
            </SmallCube>
          );
        })}
      </Container>
    );
  }
}
