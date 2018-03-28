import * as React from 'react';
import { connect } from 'app/fluent';

import Margin from 'common/components/spacing/Margin';
import Input from 'common/components/Input';
import Button from 'app/components/Button';

import { WorkspaceSubtitle, WorkspaceInputContainer } from '../elements';

import { Container, Error } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    isAllModulesSynced: state.editor.isAllModulesSynced,
    repoTitle: state.git.repoTitle,
    error: state.git.error,
    repoTitleChanged: signals.git.repoTitleChanged,
    createRepoClicked: signals.git.createRepoClicked
  }))
  .toClass(props =>
    class CreateRepo extends React.Component<typeof props> {
      updateRepoTitle = e => {
        this.props.repoTitleChanged({ title: e.target.value });
      };

      createRepo = () => {
        this.props.createRepoClicked();
      };

      render() {
        const { isAllModulesSynced, repoTitle, error } = this.props;
        const modulesNotSaved = !isAllModulesSynced;

        return (
          <div>
            <Container margin={1} top={0.5}>
              Export Sandbox to GitHub
            </Container>
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
                disabled={Boolean(error) || !repoTitle || modulesNotSaved}
                onClick={this.createRepo}
                block
                small
              >
                Create Repository
              </Button>
            </Margin>
          </div>
        );
      }
    }
  )
