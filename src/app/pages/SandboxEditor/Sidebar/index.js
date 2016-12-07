// @flow
import React from 'react';
import styled from 'styled-components';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import ModulesContainer from './ModulesContainer';
import DeleteTarget from './DeleteTarget';
import SandboxTitle from './SandboxTitle';

import type { Sandbox } from '../../../store/entities/sandboxes/';
import { editModuleUrl } from '../../../utils/url-generator';

const Container = styled.div`
  position: relative;
  background-color: ${props => props.theme.background};
  overflow: auto;
  min-width: 16rem;
`;

type Props = {
  sandbox: ?Sandbox;
  deleteModule: (id: string) => void;
  renameSandbox: (id: string, title: string) => void;
}
class Sidebar extends React.PureComponent { // eslint-disable-line
  props: Props;
  handleRenameSandbox = (title: string) => {
    const { sandbox, renameSandbox } = this.props;
    if (sandbox && sandbox.id) {
      const moduleUrl = document.location.pathname.replace(/.*?module\/?/, '');
      renameSandbox(sandbox.id, title);
      // Go to direct url of sandbox, so we don't have any problems with
      // changing the url
      this.context.router.transitionTo(`${editModuleUrl(sandbox, null)}/${moduleUrl}`);
    }
  }

  render() {
    const { sandbox, deleteModule } = this.props;
    return (
      <Container>
        <SandboxTitle renameSandbox={this.handleRenameSandbox} title={sandbox && sandbox.title} />
        {sandbox && <ModulesContainer sandbox={sandbox} />}
        <DeleteTarget deleteModule={deleteModule} />
      </Container>
    );
  }
}
Sidebar.contextTypes = {
  router: React.PropTypes.object,
};

export default DragDropContext(HTML5Backend)(Sidebar);
