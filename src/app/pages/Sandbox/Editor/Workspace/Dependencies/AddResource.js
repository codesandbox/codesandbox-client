import React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';

import Button from 'app/components/buttons/Button';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

const ButtonContainer = styled.div`margin: 0.5rem 1rem;`;

type State = {
  name: string,
};

type Props = {
  addResource: (resource: string) => Promise<boolean>,
  t: Function,
};

const initialState = {
  name: '',
};

class AddVersion extends React.PureComponent {
  state = initialState;

  state: State;
  props: Props;

  setName = (e: KeyboardEvent) => {
    const name = e.target.value;
    this.setState({ name });
  };

  addResource = async () => {
    if (this.state.name) {
      await this.props.addResource(this.state.name);
      this.setState(initialState);
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.addResource();
    }
  };

  render() {
    const { t } = this.props;
    const { name } = this.state;
    const isValid = name !== '';
    return (
      <div style={{ position: 'relative' }}>
        <WorkspaceInputContainer>
          <input
            placeholder="https://cdn.com/bootstrap.css"
            value={name}
            onChange={this.setName}
            onKeyUp={this.handleKeyUp}
          />
        </WorkspaceInputContainer>
        <ButtonContainer>
          <Button disabled={!isValid} block small onClick={this.addResource}>
            {t('dependencies.button.addResource')}
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}

export default translate('workspace')(AddVersion);
