import Portal from '@codesandbox/common/lib/components/Portal';
import theme from '@codesandbox/common/lib/theme';
import { Template } from '@codesandbox/common/lib/types';
import { ENTER, ESC } from '@codesandbox/common/lib/utils/keycodes';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import React, {
  FunctionComponent,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spring } from 'react-spring/renderprops';
import { ThemeProvider } from 'styled-components';

import { useOvermind } from 'app/overmind';
import history from 'app/utils/history';

import {
  AnimatedModalContainer,
  ButtonsContainer,
  Container,
  ContainerLink,
  DarkBG,
} from './elements';
import { NewSandboxModal } from './NewSandboxModal';

const DEFAULT_RECT = { height: 0, width: 0, x: 0, y: 0 };

type Props = {
  collectionId?: string;
  mostUsedSandboxTemplate: Template;
} & Pick<HTMLAttributes<HTMLDivElement>, 'style'>;
export const CreateNewSandbox: FunctionComponent<Props> = ({
  collectionId,
  mostUsedSandboxTemplate,
  style,
}) => {
  const {
    actions: {
      dashboard: { createSandboxClicked },
    },
  } = useOvermind();
  const [closingCreating, setClosingCreating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [forking, setForking] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keydownListener = ({ keyCode }: KeyboardEvent) => {
      if (keyCode === ESC) {
        close();
      }
    };

    document.addEventListener('keydown', keydownListener);

    return () => document.removeEventListener('keydown', keydownListener);
  }, []);

  const close = () => {
    setClosingCreating(true);

    setTimeout(() => {
      setClosingCreating(false);
      setCreating(false);
    }, 500);
  };
  const createSandbox = ({ shortid }: Template) => {
    setForking(true);

    if (collectionId) {
      createSandboxClicked({ body: { collectionId }, sandboxId: shortid });
    } else {
      setTimeout(() => {
        history.push(sandboxUrl({ id: shortid }));
      }, 300);
    }
  };
  const handleClick = () => {
    setCreating(true);
  };

  const buttonName = `Create ${mostUsedSandboxTemplate.niceName} Sandbox`;
  const mostUsedSandboxComponent = collectionId ? (
    <Container
      color={mostUsedSandboxTemplate.color}
      onClick={() => createSandbox(mostUsedSandboxTemplate)}
      ref={ref}
      role="button"
      tabIndex={0}
    >
      {buttonName}
    </Container>
  ) : (
    <ContainerLink
      color={mostUsedSandboxTemplate.color}
      to={sandboxUrl({ id: mostUsedSandboxTemplate.shortid })}
    >
      {buttonName}
    </ContainerLink>
  );

  const fromRectDOM = ref.current
    ? ref.current.getBoundingClientRect()
    : DEFAULT_RECT;
  const fromRect = {
    position: 'fixed',
    left: fromRectDOM.x,
    top: fromRectDOM.y,
    width: fromRectDOM.width + 32,
    height: fromRectDOM.height + 32,
    overflow: 'hidden',
  };
  const toRectDOM = toRef.current
    ? toRef.current.getBoundingClientRect()
    : DEFAULT_RECT;
  const toRect = {
    position: 'fixed',
    top: toRectDOM.y,
    left: toRectDOM.x,
    height: toRectDOM.height,
    width: toRectDOM.width,
    overflow: 'hidden',
  };

  return (
    <>
      {creating && (
        <>
          <Portal>
            <DarkBG closing={closingCreating} onClick={close} />
          </Portal>

          <Portal>
            <ThemeProvider theme={theme}>
              <Spring
                from={closingCreating ? toRect : fromRect}
                native
                to={closingCreating ? fromRect : toRect}
              >
                {newStyle => (
                  <AnimatedModalContainer
                    aria-labelledby="new-sandbox"
                    aria-modal="true"
                    forking={forking}
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
                    tabIndex={-1}
                  >
                    <NewSandboxModal
                      closing={closingCreating}
                      createSandbox={createSandbox}
                      forking={forking}
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
            hide={creating}
            onClick={handleClick}
            onKeyDown={({ keyCode }: React.KeyboardEvent<HTMLDivElement>) => {
              if (keyCode === ENTER) {
                handleClick();
              }
            }}
            ref={ref}
            role="button"
            tabIndex={0}
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
            <div ref={toRef} style={{ height: '100%', width: '100%' }} />
          </div>
        </Portal>
      </div>
    </>
  );
};
