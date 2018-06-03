import React from 'react';
import { inject, observer } from 'mobx-react';
import { TweenMax, Elastic } from 'gsap';
import { throttle } from 'lodash';
import test from 'react-spring';

import { Container } from './elements';

const ROTATIONS = [-4, 7, -7];

class SelectedSandboxItems extends React.Component {
  // constructor() {
  //   super();
  //   this.animate = throttle(this.animate, 50);
  // }

  // getStyles = i => {
  //   return {
  //     ...this.props.transformStyles,
  //     position: 'absolute',
  //     transform: `${this.props.transformStyles.transform} rotateZ(${
  //       ROTATIONS[i]
  //     }deg)`,
  //     zIndex: 3 - i,
  //   };
  // };

  // componentWillUpdate() {
  //   this.animate();
  // }

  getSelectedIds = () => [
    this.props.id,
    ...this.props.store.dashboard.selectedSandboxes
      .filter(x => x !== this.props.id)
      .slice(0, 2),
  ];

  // animate = (id: string, i: number, styles) => {
  //   const { selectedSandboxes } = this.props.store.dashboard;
  //   const selectedIds = this.getSelectedIds();

  //   requestAnimationFrame(() => {
  //     return selectedIds.forEach((id, i) => {
  //       if (i === 0) {
  //         return;
  //       }

  //       const styles = this.getStyles(i);

  //       TweenMax.to(`#draglayer-preview-item-${id}`, 0.8 - i * 0.05, {
  //         ...styles,
  //         ease: Elastic.easeOut.config(1, 0.4),
  //       });
  //     });
  //   });
  // };

  render() {
    const { x, y } = this.props;
    const { selectedSandboxes } = this.props.store.dashboard;
    const selectedIds = this.getSelectedIds();

    return selectedIds.map((id, i) => {
      const styles = { x, y };

      return (
        <Spring to={styles} key={id}>
          {({ x, y }) => (
            <Container
              i={i}
              isLast={i === selectedIds.length - 1}
              id={`draglayer-preview-item-${id}`}
              style={{
                position: 'absolute',
                transform: `translate3d(${x}px, ${y}px, 8px)`,
              }}
            >
              {selectedSandboxes.length}
            </Container>
          )}
        </Spring>
      );
    });
  }
}

export default inject('store', 'signals')(observer(SelectedSandboxItems));
