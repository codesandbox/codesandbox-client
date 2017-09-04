import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';

import modalActionCreators from 'app/store/modal/actions';
import Alert from 'app/components/Alert';

import WorkspaceInputContainer from '../WorkspaceInputContainer';

import WorkspaceSubtitle from '../WorkspaceSubtitle';

const PrivacySelect = styled.select`
  background-color: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  margin: 0.25rem;
  margin-bottom: 1rem;
  height: 2rem;
  width: 100%;
  border: none;
  box-sizing: border-box;
`;

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

type Props = {
  id: string,
  deleteSandbox: (id: string) => void,
  newSandboxUrl: () => void,
  setSandboxPrivacy: (id: string, privacy: number) => void,
  isPatron: boolean,
  privacy: 0 | 1 | 2,
  modalActions: typeof modalActionCreators,
};

class SandboxSettings extends React.PureComponent {
  props: Props;
  state = {
    loading: false,
  };

  handleDeleteSandbox = () => {
    const { modalActions } = this.props;

    modalActions.openModal({
      Body: (
        <Alert
          title="Delete File"
          body={<span>Are you sure you want to delete this sandbox?</span>}
          onCancel={modalActions.closeModal}
          onDelete={() => {
            this.props.deleteSandbox(this.props.id);
            this.props.newSandboxUrl();
            modalActions.closeModal();
          }}
        />
      ),
    });
  };

  updateSandboxPrivacy = async e => {
    this.setState({ loading: true });

    try {
      const privacy = +e.target.value;

      if (!Number.isNaN(privacy)) {
        await this.props.setSandboxPrivacy(this.props.id, privacy);
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ loading: false });
  };

  render() {
    const { isPatron, privacy } = this.props;
    return (
      <div>
        {isPatron && (
          <div>
            <WorkspaceSubtitle>Sandbox Privacy</WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <PrivacySelect
                value={privacy}
                onChange={this.updateSandboxPrivacy}
              >
                <option value={0}>Public</option>
                <option value={1}>Unlisted (only findable with url)</option>
                <option value={2}>Private</option>
              </PrivacySelect>
            </WorkspaceInputContainer>
          </div>
        )}
        <WorkspaceSubtitle>Delete Sandbox</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <Button
            small
            block
            style={{
              margin: '0.5rem 0.25rem',
              boxSizing: 'border-box',
            }}
            onClick={this.handleDeleteSandbox}
          >
            Delete Sandbox
          </Button>
        </WorkspaceInputContainer>
      </div>
    );
  }
}

export default connect(undefined, mapDispatchToProps)(SandboxSettings);
