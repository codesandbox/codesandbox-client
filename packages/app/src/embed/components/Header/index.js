// @flow
import * as React from 'react';
import type { Sandbox } from 'common/types';
import ModeIcons from 'app/components/ModeIcons';
import EditorLink from '../EditorLink';

import {
  Container,
  MenuIcon,
  Title,
  RightAligned,
  CenterAligned,
  LeftAligned,
} from './elements';

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
  const sandboxTitle = sandbox.title || sandbox.id;

  return (
    <Container>
      <LeftAligned>
        <MenuIcon onClick={toggleSidebar} />
        <Title title={sandboxTitle}>{sandboxTitle}</Title>
      </LeftAligned>
      <CenterAligned>
        <ModeIcons
          showEditor={showEditor}
          showPreview={showPreview}
          setEditorView={setEditorView}
          setPreviewView={setPreviewView}
          setMixedView={setMixedView}
        />
      </CenterAligned>
      <RightAligned>
        <EditorLink small sandbox={sandbox} />
      </RightAligned>
    </Container>
  );
}

export default Header;
