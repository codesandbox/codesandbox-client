// @flow
import * as React from 'react';
import type { Sandbox } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { embedUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';

import {
  Button,
  Container,
  Title,
  RightAligned,
  CenterAligned,
  LeftAligned,
  MenuIcon,
  HeartButton,
  HeartIcon,
  LinkIcon,
  EditorViewIcon,
  SplitViewIcon,
  PreviewViewIcon,
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

const copyToClipboard = str => {
  track('Embed - Copy URL');
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function Header({
  sandbox,
  showEditor,
  showPreview,
  setEditorView,
  setPreviewView,
  setMixedView,
  toggleSidebar,
  toggleLike,
  liked,
}: Props) {
  const sandboxTitle = getSandboxName(sandbox);

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
        <Button
          onClick={() =>
            copyToClipboard(`https://codesandbox.io${embedUrl(sandbox)}`)
          }
        >
          <LinkIcon />
        </Button>

        {toggleLike && (
          <HeartButton onClick={toggleLike} liked={liked}>
            <HeartIcon liked={liked} />
          </HeartButton>
        )}
      </RightAligned>
    </Container>
  );
}

function ModeIcons({
  showEditor,
  showPreview,
  setEditorView,
  setMixedView,
  setPreviewView,
}) {
  return (
    <>
      <EditorViewIcon
        active={showEditor && !showPreview}
        onClick={setEditorView}
      />
      <SplitViewIcon
        active={showEditor && showPreview}
        onClick={setMixedView}
      />
      <PreviewViewIcon
        active={showPreview && !showEditor}
        onClick={setPreviewView}
      />
    </>
  );
}

export default Header;
