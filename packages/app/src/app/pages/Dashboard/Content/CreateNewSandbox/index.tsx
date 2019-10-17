import React, { useState, useEffect, useRef } from 'react';
import { Spring } from 'react-spring/renderprops';
import { ThemeProvider } from 'styled-components';
import history from 'app/utils/history';
import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import theme from '@codesandbox/common/lib/theme';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import Portal from '@codesandbox/common/lib/components/Portal';
import { useOvermind } from 'app/overmind';

import {
  ButtonsContainer,
  Container,
  AnimatedModalContainer,
  ContainerLink,
  DarkBG,
} from './elements';

import { NewSandboxModal } from './NewSandboxModal';

interface CreateNewSandboxProps {
  style: React.CSSProperties;
  collectionId?: string;
  mostUsedSandboxTemplate: {
    [key: string]: any;
  };
}

const CreateNewSandbox: React.SFC<CreateNewSandboxProps> = ({
  style,
  collectionId,
  mostUsedSandboxTemplate,
}) => {
  const {
    actions: {
      dashboard: { createSandboxClicked },
    },
  } = useOvermind();

  const [creating, setCreating] = useState(false);
  const [closingCreating, setClosingCreating] = useState(false);
  const [forking, setForking] = useState(false);

  const ref = useRef(null);
  const toRef = useRef(null);

  const close = () => {
    setClosingCreating(true);
    setTimeout(() => {
      setClosingCreating(false);
      setCreating(false);
    }, 500);
  };

  useEffect(() => {
    const keydownListener = e => {
      if (e.keyCode === ESC) {
        close();
      }
    };
    document.addEventListener('keydown', keydownListener);
    return () => {
      document.removeEventListener('keydown', keydownListener);
    };
  }, []);

  const createSandbox = (template: { [key: string]: any }) => {
    setForking(true);
    if (!collectionId) {
      setTimeout(() => {
        history.push(sandboxUrl({ id: template.shortid }));
      }, 300);
    } else {
      createSandboxClicked({
        sandboxId: template.shortid,
        body: {
          collectionId,
        },
      });
    }
  };

  const handleClick = () => {
    setCreating(true);
  };

  const fromRects = ref.current ? ref.current.getBoundingClientRect() : {};
  const toRects = toRef.current ? toRef.current.getBoundingClientRect() : {};

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

  if (!closingCreating) {
    usedRects = usedRects.reverse();
  }

  let mostUsedSandboxComponent;
  if (mostUsedSandboxTemplate) {
    const buttonName = `Create ${mostUsedSandboxTemplate.niceName} Sandbox`;
    if (collectionId) {
      mostUsedSandboxComponent = (
        <Container
          ref={ref}
          onClick={() => createSandbox(mostUsedSandboxTemplate)}
          color={mostUsedSandboxTemplate.color}
          tabIndex={0}
          role="button"
          hide={false}
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
      {creating && (
        <>
          <Portal>
            <DarkBG onClick={close} closing={closingCreating} />
          </Portal>
          <Portal>
            <ThemeProvider theme={theme}>
              <Spring native from={usedRects[0]} to={usedRects[1]}>
                {newStyle => (
                  <AnimatedModalContainer
                    tabIndex={-1}
                    aria-modal="true"
                    aria-labelledby="new-sandbox"
                    forking={forking || undefined}
                    // @ts-ignore
                    style={
                      forking
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
                    <NewSandboxModal
                      width={toRects.width}
                      forking={forking}
                      closing={closingCreating}
                      createSandbox={createSandbox}
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
            ref={ref}
            onClick={handleClick}
            tabIndex={0}
            role="button"
            hide={creating}
            onKeyDown={e => {
              if (e.keyCode === ENTER) {
                handleClick();
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
            <div ref={toRef} style={{ width: '100%', height: '100%' }} />
          </div>
        </Portal>
      </div>
    </>
  );
};

export default CreateNewSandbox;
