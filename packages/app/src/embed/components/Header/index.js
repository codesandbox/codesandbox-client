import * as React from 'react';

import ModeIcons from 'app/components/ModeIcons';
import EditorLink from '../EditorLink';

import { Container, MenuIcon, RightAligned, Title } from './elements';

function Header({
  sandbox,
  showEditor,
  showPreview,
  setEditorView,
  setPreviewView,
  setMixedView,
  toggleSidebar,
}) {
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
