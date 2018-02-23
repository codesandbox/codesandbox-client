// @flow
import * as React from 'react';

import type { Sandbox } from 'common/types';

import ModeIcons from 'app/components/ModeIcons';
import EditorLink from '../EditorLink';

import { Container, MenuIcon, RightAligned, Title } from './elements';

type Props = {
  sandbox: Sandbox,
  showEditor: boolean,
  showPreview: boolean,
  setEditorView: () => void,
  setPreviewView: () => void,
  setMixedView: () => void,
  toggleSidebar: () => void,
};

function Header({
  sandbox,
  showEditor,
  showPreview,
  setEditorView,
  setPreviewView,
  setMixedView,
  toggleSidebar,
}: Props) {
  return (
    <Container>
      <MenuIcon onClick={toggleSidebar} />
      <Title>{sandbox.title || sandbox.id}</Title>
      <ModeIcons
        showEditor={showEditor}
        showPreview={showPreview}
        setEditorView={setEditorView}
        setPreviewView={setPreviewView}
        setMixedView={setMixedView}
      />
      <RightAligned>
        <EditorLink small sandbox={sandbox} />
      </RightAligned>
    </Container>
  );
}

export default Header;
