import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';
import modalActionCreators from 'app/store/modal/actions';

import SearchDependencies from './SearchDependencies';

const ButtonContainer = styled.div`margin: 0.5rem 1rem;`;

type State = {
  name: string,
  version: string,
};

type Props = {
  addDependency: (dependency: string, version: string) => Promise<boolean>,
  modalActions: typeof modalActionCreators,
  processing: boolean,
};

const initialState = {
  name: '',
  version: '',
};

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

class AddVersion extends React.PureComponent {
  state = initialState;

  state: State;
  props: Props;

  addDependency = async () => {
    this.props.modalActions.openModal({
      width: 600,
      Body: <SearchDependencies />,
    });
    if (this.state.name) {
      await this.props.addDependency(this.state.name, this.state.version);
      this.setState(initialState);
    }
  };

  render() {
    const { replacing } = this.state;
    const { processing } = this.props;
    return (
      <div style={{ position: 'relative' }}>
        <ButtonContainer>
          <Button
            disabled={processing}
            block
            small
            onClick={this.addDependency}
          >
            {replacing ? 'Replace' : 'Add'} Package
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(AddVersion);
