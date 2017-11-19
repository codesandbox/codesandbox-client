import React from 'react';
import styled from 'styled-components';

import Margin from 'common/components/spacing/Margin';
import Input from 'app/components/Input';
import Button from 'app/components/buttons/Button';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

import ExportGitHubModal from './modals/ExportToGithub';

const Container = Margin.extend`
  color: rgba(255, 255, 255, 0.8);
`;

const Error = styled.div`
  margin: 1rem;
  color: ${({ theme }) => theme.red};
  font-size: 0.875rem;
`;

type Props = {
  sandboxId: string,
  title: string,
  exportToGithub: (id: string, name: string) => void,
  modulesNotSaved: boolean,
  openModal: Function,
  closeModal: Function,
};

export default class CreateRepo extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sandboxTitle: props.title || '',
    };
  }

  updateSandboxTitle = e => {
    this.setState({ error: null, sandboxTitle: e.target.value });
  };

  createRepo = () => {
    if (!this.state.sandboxTitle) {
      this.setState({ error: 'Repo name cannot be empty' });
      return;
    }
    if (/\s/.test(this.state.sandboxTitle.trim())) {
      this.setState({ error: 'Repo name cannot contain spaces' });
      return;
    }
    if (this.props.modulesNotSaved) {
      this.setState({ error: 'All files need to be saved' });
      return;
    }

    const promise = this.props.exportToGithub(
      this.props.sandboxId,
      this.state.sandboxTitle
    );

    this.props.openModal({
      Body: (
        <ExportGitHubModal
          promise={promise}
          closeModal={this.props.closeModal}
        />
      ),
      width: 600,
    });
  };

  render() {
    const { modulesNotSaved } = this.props;

    return (
      <div>
        <Container margin={1}>Export your sandbox to GitHub</Container>
        {modulesNotSaved && (
          <Error>Save your files first before exporting.</Error>
        )}
        {this.state.error && <Error>{this.state.error}</Error>}

        <WorkspaceSubtitle>Repository Name</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <Input
            onChange={this.updateSandboxTitle}
            value={this.state.sandboxTitle}
          />
        </WorkspaceInputContainer>
        <Margin horizontal={1} bottom={1}>
          <Button
            disabled={
              this.state.error || !this.state.sandboxTitle || modulesNotSaved
            }
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
