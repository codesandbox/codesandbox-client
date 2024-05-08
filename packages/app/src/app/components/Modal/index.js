import React from 'react';
import Modal from 'react-modal';
import { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';
import { Text, Element, IconButton } from '@codesandbox/components';

const CLOSE_TIMEOUT_MS = 300;

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
} else if (document.getElementById('___gatsby')) {
  Modal.setAppElement('#___gatsby');
}

const GlobalStyles = createGlobalStyle`
.ReactModal__Content {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  opacity: 0;
  transform: scale(0.9) translateY(5px);
  overflow-y: hidden;
  width: 950px; 
  
  @media screen and (max-width: 950px) {
    width: 95%;
  }
  
  @media screen and (max-width: 756px) {
    width: 100%;
    border: 0;
    border-radius: 0;
  }
}

.ReactModal__Overlay {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  transition-property: opacity, transform;
  z-index: 10;
  opacity: 0;
}

.ReactModal__Overlay--after-open {
  transition: all ${CLOSE_TIMEOUT_MS}ms ease;
  z-index: 10;
  opacity: 1;
  max-height: 100vh;
}

.ReactModal__Html--open {
  overflow-y: hidden;
}

.ReactModal__Content--after-open {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.ReactModal__Overlay--before-close {
  opacity: 0;
}

.ReactModal__Content--before-close {
  opacity: 0;
  transform: scale(0.9) translateY(0);
}
`;

class ModalComponent extends React.Component {
  getStyles = (width = 400, top = 20, fullWidth = false) => ({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      overflowY: 'auto',
      zIndex: 10,
      transform: 'translate3d(0, 0, 0)',
    },
    content: {
      position: 'relative',
      padding: 0,
      maxWidth: width,
      top: fullWidth ? 0 : `${top}vh`,
      bottom: fullWidth ? 0 : 40,
      left: 0,
      right: 0,
      margin: `0 auto`,
      fontFamily: "'Inter', sans-serif",
      outline: 'none',
    },
  });

  render() {
    const {
      isOpen,
      width,
      top,
      onClose,
      children,
      title,
      fullWidth,
      ...props
    } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <>
        <GlobalStyles />
        <Modal
          isOpen={isOpen}
          onRequestClose={e => {
            onClose(e.type === 'keydown');
          }}
          contentLabel={title || 'Modal'}
          css={css({
            border: '1px solid',
            borderColor: 'sideBar.border',
            borderRadius: fullWidth ? 0 : '8px',
            backgroundColor: '#151515',
            boxShadow: 2,
            color: 'sideBar.foreground',
            lineHeight: 1.2,
          })}
          style={this.getStyles(width, top, fullWidth)}
          closeTimeoutMS={CLOSE_TIMEOUT_MS}
          htmlOpenClassName="ReactModal__Html--open"
          {...props}
        >
          <Element css={{ position: 'relative' }}>
            {title && (
              <Text weight="bold" block size={4} paddingBottom={2}>
                {title}
              </Text>
            )}
            <IconButton
              onClick={() => {
                onClose();
              }}
              css={{ position: 'absolute', right: '12px', top: '12px' }}
              name="cross"
              title="Close"
              size={16}
              variant="square"
            />
            <div>{children}</div>
          </Element>
        </Modal>
      </>
    );
  }
}

export default ModalComponent;
