import {
  CommentWithRepliesFragment,
  PreviewReferenceMetadata,
} from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
import * as React from 'react';
import { Icon } from '@codesandbox/components';
import styled, { createGlobalStyle } from 'styled-components';

const BUBBLE_SIZE = 16;

const Wrapper = styled.div({
  height: '100%',
  position: 'relative',
  zIndex: 2,
});

const Screenshot = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: 1,
  backgroundSize: 'cover',
  width: '100%',
  height: '100%',
});

const BorderOverlay = styled.div<{ showCommentCursor: boolean }>(props => ({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  border: '4px solid #FFF',
  color: '#FF3B30',
  zIndex: 2,
  cursor: props.showCommentCursor
    ? `url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16H0V8Z" fill="%23FF3B30"/></svg>'), auto`
    : 'inherit',
}));

const PreviewBubble = styled(Icon)<{ active: boolean }>({
  position: 'absolute',
  width: BUBBLE_SIZE,
  height: BUBBLE_SIZE,
  color: '#FF3B30',
  zIndex: 2,
  cursor: 'inherit',
});

function getPreviewReference(
  comment: CommentWithRepliesFragment | null
): PreviewReferenceMetadata | null {
  if (
    comment &&
    comment.anchorReference &&
    comment.anchorReference.type === 'preview'
  ) {
    return comment.anchorReference.metadata as PreviewReferenceMetadata;
  }

  return null;
}

type Props = {
  children: any;
  scale: number;
};

const FlashAnimationGlobalStyle = createGlobalStyle`
  @keyframes screenshot-flash {
    0% { opacity: 0 }
    25% { opacity: 1 }
    35% { opacity: 1 }
    100% { opacity: 0 }
  }
  .screenshot-flash {
    animation: screenshot-flash 0.5s linear;
  }
`;

const useFlash = (
  ref: React.MutableRefObject<HTMLElement>,
  activate: boolean
) => {
  React.useEffect(() => {
    if (ref.current && activate) {
      const flashEl = document.createElement('div');
      flashEl.style.position = 'absolute';
      flashEl.style.left = '0';
      flashEl.style.top = '0';
      flashEl.style.width = '100%';
      flashEl.style.height = '100%';
      flashEl.style.opacity = '0';
      flashEl.style.zIndex = '999999';
      flashEl.style.backgroundColor = 'white';
      flashEl.className = 'screenshot-flash';

      const disposer = () => {
        if (ref.current) {
          flashEl.removeEventListener('animationend', onAnimationEnd);
          if (flashEl.parentNode) {
            flashEl.parentNode.removeChild(flashEl);
          }
        }
      };
      const onAnimationEnd = disposer;
      flashEl.addEventListener('animationend', onAnimationEnd);
      ref.current.appendChild(flashEl);

      return disposer;
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, activate]);
};

export const PreviewCommentWrapper = ({ children, scale }: Props) => {
  const state = useAppState();
  const actions = useActions();
  const wrapperRef = React.useRef(null);
  const previewReference = getPreviewReference(state.comments.currentComment);
  const isAddingPreviewComment =
    state.preview.mode === 'add-comment' ||
    state.preview.mode === 'responsive-add-comment';
  const hasSource = Boolean(state.preview.screenshot.source);

  useFlash(wrapperRef, isAddingPreviewComment && hasSource);

  return (
    <Wrapper ref={wrapperRef}>
      <FlashAnimationGlobalStyle />
      {children}
      {isAddingPreviewComment ? (
        <>
          <Screenshot
            style={
              state.preview.screenshot.source
                ? {
                    backgroundImage: `url(${state.preview.screenshot.source})`,
                  }
                : {
                    backgroundColor: state.preview.screenshot.isLoading
                      ? 'rgba(0,0,0,0.5)'
                      : 'rgba(0,0,0,0)',
                  }
            }
          />
          <BorderOverlay
            style={{
              transition: 'opacity 0.125s ease-in',
              opacity: state.preview.screenshot.source ? 1 : 0,
            }}
            onClick={event => {
              if (state.preview.screenshot.isLoading) {
                return;
              }

              const parentBounds = (event.target as any).parentNode.getBoundingClientRect();

              actions.comments.addOptimisticPreviewComment({
                x: event.clientX - parentBounds.left,
                y: event.clientY - parentBounds.top,
                screenshot: state.preview.screenshot.source,
                scale,
              });
            }}
            showCommentCursor={hasSource}
          >
            {previewReference ? (
              <PreviewBubble
                id="preview-comment-bubble"
                name="comment"
                active
                style={{
                  top: Math.round(previewReference.y) + 'px',
                  left: Math.round(previewReference.x) + 'px',
                }}
              />
            ) : null}
          </BorderOverlay>
        </>
      ) : null}
    </Wrapper>
  );
};
