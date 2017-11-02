import React from 'react';
import styled from 'styled-components';

import { TimelineMax, Elastic } from 'gsap';

import * as templates from 'common/templates';

import Cube from '../../components/Cube';

const Container = styled.div`
  flex: 2;
  position: relative;
`;

const MultipleCubes = styled.div`
  display: flex;
  flex-direction: row;
`;

const SmallCube = styled.div`
  /* transition: 0.8s ease all; */
  position: absolute;

  left: ${({ left }) => left}px;
  bottom: ${({ bottom }) => bottom}px;

  cursor: pointer;
  transform: scale(0.4, 0.4);

  &:hover {
    transform: scale(0.6, 0.6);
  }
`;

export default class Cubes extends React.PureComponent {
  state = {
    templates: Object.keys(templates)
      .filter(k => k !== 'default' && k !== '__esModule')
      .map((tem, i) => {
        const radius = 300;
        const angle = Math.PI * 2 / 5 * i;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return {
          template: templates[tem],
          x,
          y,
          offset: Math.random() * 120,
        };
      }),
    templateIndex: 0,
  };
  els = {};

  componentDidMount() {
    requestAnimationFrame(() => {
      this.growCube(this.props.template).add(this.updateCubePos, '-=.6');
    });

    window.onresize = () => {
      this.updateCubePos();
    };
  }

  updateCubePos = () => {
    if (this.props.canvas) {
      const pos = this.els[this.props.template.name].getBoundingClientRect();
      this.props.canvas.setCubePos(pos.x + 50, pos.y + 70);
    }
  };

  componentWillReceiveProps(nextProps) {
    const nextTemplate = nextProps.template;
    const currentTemplate = this.state.templates.find(
      t => t.template === this.props.template
    );

    if (nextTemplate !== currentTemplate.template) {
      this.shrinkCube(currentTemplate);
      this.growCube(nextTemplate, nextProps.canvas);
    }
  }

  growCube = (template, canvas) => {
    const el = this.els[template.name];
    const rgb = template.color.lighten(0)()
      .match(/rgb\((.*)\)/)[1]
      .split(',');

    return new TimelineMax()
      .to(el, 0.8, { bottom: -50, left: 250 })
      .to(
        el,
        0.7,
        {
          scale: 1,
          ease: Elastic.easeOut,
        },
        '-=.2'
      )
      .add(() => {
        if (canvas) {
          canvas.makeWave(canvas.cubeX, canvas.cubeY, rgb);
        }
      }, '-=.8');
  };

  shrinkCube(template) {
    const el = this.els[template.template.name];
    new TimelineMax()
      .to(el, 0.8, { bottom: -50 + template.y, left: 250 + template.x })
      .to(el, 0.7, { scale: 0.4, ease: Elastic.easeOut });
  }

  render() {
    const { template } = this.props;
    return (
      <Container>
        <MultipleCubes>
          {this.state.templates.map((t, i) => {
            const selected = template === t.template;

            return (
              <SmallCube
                innerRef={el => {
                  this.els[t.template.name] = el;
                }}
                key={t.template.name}
                bottom={t.y - 50}
                left={t.x + 250}
                selected={selected}
                i={i}
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
        </MultipleCubes>
      </Container>
    );
  }
}
