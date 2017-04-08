// @flow
import React from 'react';
import styled from 'styled-components';
import MenuIconSVG from 'react-icons/lib/md/menu';

import type { Sandbox } from 'app/store/entities/sandboxes/entity';
import ModeIcons from 'app/components/sandbox/ModeIcons';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  background-color: ${props => props.theme.background};
`;

const MenuIcon = styled(MenuIconSVG)`
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 1rem;
  cursor: pointer;
`;

type Props = {
  sandbox: Sandbox,
  showEditor: boolean,
  showPreview: boolean,
  setEditorView: () => void,
  setPreviewView: () => void,
  setMixedView: () => void,
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
    } = this.props;
    return (
      <Container>
        <MenuIcon />
        <span>{sandbox.title || sandbox.id}</span>
        <ModeIcons
          showEditor={showEditor}
          showPreview={showPreview}
          setEditorView={setEditorView}
          setPreviewView={setPreviewView}
          setMixedView={setMixedView}
        />
      </Container>
    );
  }
}
