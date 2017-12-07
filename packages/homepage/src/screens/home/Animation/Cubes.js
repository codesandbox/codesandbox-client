import React from 'react';
import styled from 'styled-components';

import { TimelineMax, TweenMax, Power2, Power3, Elastic } from 'gsap';
import fadeIn from 'common/utils/animation/fade-in';

import Cube from '../../../components/Cube';
import media from '../../../utils/media';
import getScrollPos from '../../../utils/scroll';

const RADIUS = 250;
const Container = styled.div`
  flex: 2;
  position: relative;
  transform: translateX(${RADIUS}px) translateY(125px);

  ${fadeIn(0)};

  ${media.tablet`
    flex: 2;
    width: 100%;

    transform: translateX(${RADIUS}px) translateY(400px);

    justify-content: center;
    align-items: center;
  `};
`;

const SmallCube = styled(
  class SmallCubeInner extends React.Component {
    shouldComponentUpdate() {
      return false;
    }

    render() {
      const { cubeRef, ...props } = this.props;
      return (
        <div style={{ willChange: 'transform' }} ref={cubeRef} {...props} />
      );
    }
  }
)`
  position: absolute;

  cursor: pointer;
  transform: scale(0.4, 0.4);
  will-change: transform;
`;

const OFFSETS = [84, 32, 54, 110];

// eslint-disable-next-line react/no-multi-comp
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
          offset: OFFSETS[i],
        };
      }),
      canvas: null,
    };
  }

  animate = () => {
    const delta = Date.now() - this.lastTick;

    if (delta < 0.3) {
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
        isLastTemplate ? 0.8 : 0.3,
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
        '-=.7'
      );
    });

    this.lastTick = Date.now();
    this.time = 0;

    this.animating = false && window.innerWidth > 1600;

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
    const { templates } = this.state;
    const currentTemplate =
      templates[templates.map(t => t.template).indexOf(this.props.template)];

    if (nextTemplate !== currentTemplate.template) {
      this.shrinkCube(currentTemplate);
      this.growCube(nextTemplate, nextProps.canvas);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  growTimelines = {};
  shrinkTimelines = {};

  growCube = (template, canvas) => {
    const el = this.els[template.name];
    const rgb = template.color
      .lighten(0)()
      .match(/rgb\((.*)\)/)[1]
      .split(',');
    const { x, y } = this.state.templates[
      this.state.templates.map(({ template: t }) => t).indexOf(template)
    ];

    this.growTimelines[template.name] =
      this.growTimelines[template.name] ||
      new TimelineMax({ paused: true })
        .to(el, 0.8, { x: -x, y, ease: Power3.easeIn })
        .to(el, 0.7, {
          scale: 1,
          ease: Elastic.easeOut,
        })
        .add(() => {
          if (canvas) {
            canvas.makeWave(canvas.cubeX, canvas.cubeY, rgb);
          }
        }, '-=.8');

    return this.growTimelines[template.name].restart();
  };

  shrinkCube = template => {
    const el = this.els[template.template.name];

    if (this.animating) {
      new TimelineMax().to(el, 0.7, { scale: 0.4, ease: Power2.easeOut });
    } else {
      this.shrinkTimelines[template.template.name] =
        this.shrinkTimelines[template.template.name] ||
        new TimelineMax()
          .to(el, 0.8, { x: 0, y: 0 })
          .to(el, 0.7, { scale: 0.4, ease: Power2.easeOut }, '-=0.7');

      return this.shrinkTimelines[template.template.name].restart();
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

    if (typeof window === 'undefined') {
      return null;
    }

    return (
      <Container>
        {this.state.templates.map((t, i) => {
          const selected = template === t.template;

          return (
            <SmallCube
              title={t.template.niceName}
              cubeRef={el => {
                this.els[t.template.name] = el;
              }}
              style={{ bottom: t.y, left: t.x }}
              key={t.template.name}
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
