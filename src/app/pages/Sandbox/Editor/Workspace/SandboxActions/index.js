import React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';
import Button from 'app/components/buttons/Button';

import WorkspaceInputContainer from '../WorkspaceInputContainer';

import WorkspaceSubtitle from '../WorkspaceSubtitle';

type Props = {
  id: string,
  deleteSandbox: (id: string) => void,
  newSandboxUrl: () => void,
  setSandboxPrivacy: (id: string, privacy: number) => void,
  isPatron: boolean,
  privacy: 0 | 1 | 2,
  t: Function,
};

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

class SandboxSettings extends React.PureComponent {
  props: Props;
  state = {
    loading: false,
  };

  handleDeleteSandbox = async () => {
    const { t } = this.props;
    const really = confirm(t('actions.deleteSandboxConfirm')); // TODO: confirm???
    if (really) {
      await this.props.deleteSandbox(this.props.id);
      await this.props.newSandboxUrl();
    }
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
    const { isPatron, privacy, t } = this.props;
    return (
      <div>
        {isPatron &&
          <div>
            <WorkspaceSubtitle>
              {t('actions.title.privacy')}
            </WorkspaceSubtitle>
            <WorkspaceInputContainer>
              <PrivacySelect
                value={privacy}
                onChange={this.updateSandboxPrivacy}
              >
                <option value={0}>
                  {t('actions.privacyLevel.public')}
                </option>
                <option value={1}>
                  {t('actions.privacyLevel.unlisted')}
                </option>
                <option value={2}>
                  {t('actions.privacyLevel.private')}
                </option>
              </PrivacySelect>
            </WorkspaceInputContainer>
          </div>}
        <WorkspaceSubtitle>
          {t('actions.title.delete')}
        </WorkspaceSubtitle>
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
            {t('actions.title.delete')}
          </Button>
        </WorkspaceInputContainer>
      </div>
    );
  }
}

export default translate('workspace')(SandboxSettings);
