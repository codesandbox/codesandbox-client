// @flow
import React from 'react';
import styled from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';

import type { Sandbox } from 'common/types';
import ModeIcons from 'app/components/sandbox/ModeIcons';
import EditorLink from './EditorLink';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2.darken(0.3)};
  background-color: ${props => props.theme.background2};
`;

const MenuIcon = styled(MenuIconSVG)`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 1rem;
  cursor: pointer;
  z-index: 10;
`;

const RightAligned = styled.div`
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  justify-content: center;
`;

type Props = {
  sandbox: Sandbox,
  showEditor: boolean,
  showPreview: boolean,
  setEditorView: () => void,
  setPreviewView: () => void,
  setMixedView: () => void,
  toggleSidebar: () => void,
};

export default class Header extends React.PureComponent {
  props: Props;

  render() {
    const {
      sandbox,
      showEditor,
      showPreview,
      setEditorView,
      setPreviewView,
      setMixedView,
      toggleSidebar,
    } = this.props;
    return (
      <Container>
        <MenuIcon onClick={toggleSidebar} />
        <span>{sandbox.title || sandbox.id}</span>
        <ModeIcons
          showEditor={showEditor}
          showPreview={showPreview}
          setEditorView={setEditorView}
          setPreviewView={setPreviewView}
          setMixedView={setMixedView}
        />
        <RightAligned>
          <EditorLink small id={sandbox.id} />
        </RightAligned>
      </Container>
    );
  }
}
