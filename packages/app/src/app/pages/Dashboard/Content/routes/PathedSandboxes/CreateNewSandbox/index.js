import React from 'react';
import { Spring, animated } from 'react-spring';
import { inject } from 'mobx-react';
import { ThemeProvider } from 'styled-components';

import theme from 'common/theme';
import Portal from 'app/components/Portal';
import { Container } from './elements';

import Modal from './Modal';

class CreateNewSandbox extends React.PureComponent {
  state = {
    creating: false,
    closingCreating: false,
    forking: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.mouseListener);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.mouseListener);
  }

  createSandbox = template => {
    this.setState({ forking: true }, () => {
      this.props.signals.dashboard.createSandboxClicked({
        sandboxId: template.shortid,
        body: {
          collectionId: this.props.collectionId,
        },
      });
    });
  };

  mouseListener = e => {
    if (!e.defaultPrevented && this.state.creating) {
      this.setState({ closingCreating: true }, () => {
        setTimeout(() => {
          this.setState({ creating: false, closingCreating: false });
        }, 500);
      });
    }
  };

  handleClick = () => {
    this.setState({ creating: true });
  };

  render() {
    const { style } = this.props;

    const fromRects = this.ref ? this.ref.getBoundingClientRect() : {};
    const toRects = this.toRef ? this.toRef.getBoundingClientRect() : {};

    let usedRects = [
      {
        position: 'fixed',
        top: toRects.y,
        left: toRects.x,
        height: toRects.height,
        width: toRects.width,
      },
      {
        position: 'fixed',
        left: fromRects.x,
        top: fromRects.y,
        width: fromRects.width,
        height: fromRects.height,
      },
    ];

    if (!this.state.closingCreating) {
      usedRects = usedRects.reverse();
    }

    if (this.state.forking) {
      usedRects[1] = {
        position: 'fixed',
        left: 0,
        top: 0,
        width: 2000,
        height: 2000,
      };
    }

    return (
      <React.Fragment>
        {this.state.creating && (
          <Portal>
            <ThemeProvider theme={theme}>
              <Spring native from={usedRects[0]} to={usedRects[1]}>
                {newStyle => (
                  <animated.div style={newStyle}>
                    <Modal
                      width={toRects.width}
                      forking={this.state.forking}
                      closing={this.state.closingCreating}
                      createSandbox={this.createSandbox}
                    />
                  </animated.div>
                )}
              </Spring>
            </ThemeProvider>
          </Portal>
        )}

        <div
          ref={node => {
            this.ref = node;
          }}
          style={style}
          onClick={this.handleClick}
          tabIndex="0"
          role="button"
        >
          <Container hide={this.state.creating}>Create Sandbox</Container>
          <Portal>
            <div
              style={{
                opacity: 0,
                zIndex: 0,
                pointerEvents: 'none',
                position: 'fixed',
                top: '25vh',
                bottom: 0,
                right: 0,
                left: 0,

                margin: '0 auto 20vh',
                height: 'auto',
                width: 950,
              }}
            >
              <div
                ref={node => {
                  this.toRef = node;
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </Portal>
        </div>
      </React.Fragment>
    );
  }
}

export default inject('signals')(CreateNewSandbox);
