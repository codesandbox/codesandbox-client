import React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import Input from 'app/components/Input';
import Button from 'app/components/Button';
import Modal from 'app/components/Modal';

import { WorkspaceSubtitle, WorkspaceInputContainer } from '../elements';
import ExportGitHubModal from './ExportToGithub';

import { Container, Error } from './elements';

class CreateRepo extends React.Component {
  updateRepoTitle = e => {
    this.props.signals.git.repoTitleChanged({ title: e.target.value });
  };

  createRepo = () => {
    this.props.signals.git.createRepoClicked();
  };

  render() {
    const { store } = this.props;
    const modulesNotSaved = !store.editor.isAllModulesSynced;
    const repoTitle = store.git.repoTitle;
    const error = store.git.error;

    return (
      <div>
        <Container margin={1}>Export your sandbox to GitHub</Container>
        {modulesNotSaved && (
          <Error>Save your files first before exporting.</Error>
        )}
        {error && <Error>{error}</Error>}

        <WorkspaceSubtitle>Repository Name</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <Input onChange={this.updateRepoTitle} value={repoTitle} />
        </WorkspaceInputContainer>
        <Margin horizontal={1} bottom={1}>
          <Button
            disabled={error || !repoTitle || modulesNotSaved}
            onClick={this.createRepo}
            block
            small
          >
            Create Repository
          </Button>
        </Margin>
        <Modal isOpen={store.git.showExportedModal} width={600}>
          <ExportGitHubModal isExported={store.git.isExported} />
        </Modal>
      </div>
    );
  }
}

export default inject('signals', 'store')(observer(CreateRepo));
