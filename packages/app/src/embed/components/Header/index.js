// @flow
import * as React from 'react';
import type { Sandbox } from 'common/types';
import ModeIcons from 'app/components/ModeIcons';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import Logo from 'common/components/Logo';
import { sandboxUrl, embedUrl } from 'common/utils/url-generator';

import LinkIcon from './Link';

import {
  Button,
  Container,
  MenuIcon,
  Title,
  RightAligned,
  CenterAligned,
  LeftAligned,
  OnlyShowWideText,
  CodeSandboxButton,
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
        {toggleLike && (
          <Button
            hideSmall={640}
            bgColor="rgba(255, 122, 122, 0.11)"
            color="rgb(254, 122, 122)"
            onClick={toggleLike}
          >
            {liked ? <FullHeartIcon /> : <HeartIcon />}
            <OnlyShowWideText hideOn={726}>
              {liked ? 'Undo Like' : 'Like'}
            </OnlyShowWideText>
          </Button>
        )}
        <Button
          onClick={() =>
            copyToClipboard(`https://codesandbox.io${embedUrl(sandbox)}`)
          }
          hideSmall={960}
        >
          <LinkIcon />
          <OnlyShowWideText>Copy Link</OnlyShowWideText>
        </Button>

        <CodeSandboxButton
          target="_blank"
          rel="noreferrer noopener"
          small
          href={`${sandboxUrl(sandbox)}?from-embed`}
        >
          <Logo width={'1.125em'} height={'1.125em'} />
          <OnlyShowWideText hideOn={510}>Open in Editor</OnlyShowWideText>
        </CodeSandboxButton>
      </RightAligned>
    </Container>
  );
}

export default Header;
