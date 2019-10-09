import React from 'react';
import { Spring } from 'react-spring/renderprops';
import { inject, observer } from 'app/componentConnectors';
import { ThemeProvider } from 'styled-components';
import history from 'app/utils/history';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import theme from '@codesandbox/common/lib/theme';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Portal from '@codesandbox/common/lib/components/Portal';
import { CreateSandbox } from './CreateSandbox';
import {
  ButtonsContainer,
  Container,
  AnimatedModalContainer,
  ContainerLink,
  DarkBG,
} from './elements';

class CreateNewSandbox extends React.PureComponent {
  state = {
    creating: false,
    closingCreating: false,
    forking: false,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.keydownListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydownListener);
  }

  createSandbox = template => {
    this.setState({ forking: true }, () => {
      if (!this.props.collectionId) {
        setTimeout(() => {
          history.push(sandboxUrl({ id: template.shortid }));
        }, 300);
      } else {
        this.props.signals.dashboard.createSandboxClicked({
          sandboxId: template.shortid,
          body: {
            collectionId: this.props.collectionId,
          },
        });
      }
    });
  };

  close = () => {
    this.setState({ closingCreating: true }, () => {
      setTimeout(() => {
        this.setState({ creating: false, closingCreating: false });
      }, 500);
    });
  };

  keydownListener = e => {
    if (e.keyCode === ESC) {
      this.close();
    }
  };

  handleClick = () => {
    this.setState({ creating: true });
  };

  render() {
    const { style, collectionId, mostUsedSandboxTemplate } = this.props;

    const fromRects = this.ref ? this.ref.getBoundingClientRect() : {};
    const toRects = this.toRef ? this.toRef.getBoundingClientRect() : {};

    let usedRects = [
      {
        position: 'fixed',
        top: toRects.y,
        left: toRects.x,
        height: toRects.height,
        width: toRects.width,
        overflow: 'hidden',
      },
      {
        position: 'fixed',
        left: fromRects.x,
        top: fromRects.y,
        width: fromRects.width + 32,
        height: fromRects.height + 32,
        overflow: 'hidden',
      },
    ];

    if (!this.state.closingCreating) {
      usedRects = usedRects.reverse();
    }

    let mostUsedSandboxComponent;

    if (mostUsedSandboxTemplate) {
      const buttonName = `Create ${mostUsedSandboxTemplate.niceName} Sandbox`;
      if (collectionId) {
        mostUsedSandboxComponent = (
          <Container
            ref={node => {
              this.ref = node;
            }}
            onClick={() => this.createSandbox(mostUsedSandboxTemplate)}
            color={mostUsedSandboxTemplate.color}
            tabIndex="0"
            role="button"
          >
            {buttonName}
          </Container>
        );
      } else {
        mostUsedSandboxComponent = (
          <ContainerLink
            to={sandboxUrl({ id: mostUsedSandboxTemplate.shortid })}
            color={mostUsedSandboxTemplate.color}
          >
            {buttonName}
          </ContainerLink>
        );
      }
    }

    return (
      <>
        {this.state.creating && (
          <>
            <Portal>
              <DarkBG
                onClick={this.close}
                closing={this.state.closingCreating}
              />
            </Portal>
            <Portal>
              <ThemeProvider theme={theme}>
                <Spring native from={usedRects[0]} to={usedRects[1]}>
                  {newStyle => (
                    <AnimatedModalContainer
                      tabIndex="-1"
                      aria-modal="true"
                      aria-labelledby="new-sandbox"
                      forking={
                        this.state.forking ? this.state.forking : undefined
                      }
                      style={
                        this.state.forking
                          ? {
                              position: 'fixed',
                              left: 0,
                              top: 0,
                              right: 0,
                              bottom: 0,
                            }
                          : newStyle
                      }
                    >
                      <CreateSandbox
                        width={toRects.width}
                        forking={this.state.forking}
                        closing={this.state.closingCreating}
                        createSandbox={this.createSandbox}
                      />
                    </AnimatedModalContainer>
                  )}
                </Spring>
              </ThemeProvider>
            </Portal>
          </>
        )}

        <div style={style}>
          <ButtonsContainer>
            <Container
              ref={node => {
                this.ref = node;
              }}
              onClick={this.handleClick}
              tabIndex="0"
              role="button"
              hide={this.state.creating}
              onKeyDown={e => {
                if (e.keyCode === ENTER) {
                  this.handleClick();
                }
              }}
            >
              Create Sandbox
            </Container>
            {mostUsedSandboxComponent}
          </ButtonsContainer>
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

                margin: '0 auto 15vh',
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
      </>
    );
  }
}

export default inject('signals')(observer(CreateNewSandbox));
