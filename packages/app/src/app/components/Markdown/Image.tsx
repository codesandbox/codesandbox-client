import React, { useState } from 'react';
import { useOvermind } from 'app/overmind';
import Modal from 'react-modal';
import { Text, Element, Button, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';

export const Image: React.FC<{
  src: string
  alt: string
  ignorePrivateSandboxRestriction?: boolean
}> = props => {
  const { state } = useOvermind();
  const [modalOpen, setModalOpen] = useState(false);
  const privateSandbox =
    state.editor.currentSandbox.privacy === 1 ||
    state.editor.currentSandbox.privacy === 2;
  return props.ignorePrivateSandboxRestriction || privateSandbox ? (
    <>
      <Button
        padding={0}
        margin={0}
        marginTop={2}
        variant="link"
        onClick={() => setModalOpen(true)}
        css={css({
          maxWidth: '100%',
          maxHeight: '100%',
          border: 'none',
          height: 'auto',
        })}
      >
        <img
          src={props.src}
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
        borderRadius: 'small',
      })}
    >
      <Text size={3} variant="muted" block align="center">
        Images are not shown in public sandboxes
      </Text>
    </Element>
  );
};
