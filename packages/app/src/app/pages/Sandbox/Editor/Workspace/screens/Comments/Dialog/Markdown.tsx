import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useOvermind } from 'app/overmind';
import Modal from 'react-modal';
import {
  Text,
  Element,
  Link,
  Button,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Code } from './Code';

export const Markdown = ({ source }) => {
  const { state } = useOvermind();
  const [modalOpen, setModalOpen] = useState(false);
  const privateSandbox =
    state.editor.currentSandbox.privacy === 1 ||
    state.editor.currentSandbox.privacy === 2;

  const image = props =>
    privateSandbox ? (
      <>
        <Button
          padding={0}
          margin={0}
          marginTop={2}
          variant="link"
          onClick={() => setModalOpen(true)}
          css={css({
            maxWidth: '100%',
            border: 'none',
          })}
        >
          <img
            {...props}
            alt={props.alt}
            css={css({
              maxWidth: '100%',
              borderRadius: 'small',
            })}
          />
        </Button>
        <Modal
          isOpen={modalOpen}
          style={{
            content: {
              border: 'none',
              padding: 0,
              background: 'transparent',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
            overlay: {
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
          contentLabel={props.alt}
          onRequestClose={() => setModalOpen(false)}
        >
          <IconButton
            name="cross"
            size={10}
            title="Close Modal"
            onClick={() => setModalOpen(false)}
            css={{
              position: 'absolute',
              right: 4,
              top: 4,
              color: 'white',
            }}
          />
          <img
            {...props}
            alt={props.alt}
            css={css({
              maxWidth: '100%',
              borderRadius: 'small',
              maxHeight: '80vh',
            })}
          />
        </Modal>
      </>
    ) : (
      <Element
        paddingY={4}
        marginY={2}
        css={css({
          backgroundColor: 'sideBar.border',
        })}
      >
        <Text size={3} variant="muted" block align="center">
          Images are not shown in public sandboxes
        </Text>
      </Element>
    );

  return (
    <Element
      css={css({
        'ul, ol': {
          paddingLeft: 0,
          fontSize: 13,
        },
        'ol li': {
          counterIncrement: 'counter',
        },
        'ol li::before': {
          color: 'mutedForeground',
          content: "counter(counter) '. '",
        },
        p: {
          margin: 0,
        },
        li: {
          listStyle: 'none',
        },
        'li:before': {
          content: "'•'",
          color: 'mutedForeground',
          paddingRight: '0.5em',
        },
      })}
    >
      <ReactMarkdown
        source={source}
        renderers={{
          text: ({ children }) => (
            <Text variant="muted" size={3}>
              {children}
            </Text>
          ),
          heading: ({ children }) => (
            <Text block variant="muted" size={3}>
              {children}
            </Text>
          ),
          code: props => <Code {...props} />,
          link: props => <Link {...props}>{props.children}</Link>,
          linkReference: props => <Link {...props}>{props.children}</Link>,
          image: props => image(props),
          imageReference: props => image(props),
          thematicBreak: () => null,
          inlineCode: props => (
            <Element
              as="span"
              css={css({
                backgroundColor: 'grays.200',
                paddingX: '2px',
                borderRadius: 'small',
              })}
            >
              <Text
                css={css({
                  color: 'reds.500',
                })}
                size={3}
                as="code"
              >
                {props.children}
              </Text>
            </Element>
          ),
        }}
      />
    </Element>
  );
};
