import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';
import modalActionCreators from 'app/store/modal/actions';

import SearchDependencies from './SearchDependencies';

const ButtonContainer = styled.div`
  margin: 0.5rem 1rem;
`;

type Props = {
  addDependency: (dependency: string, version: string) => Promise<boolean>,
  modalActions: typeof modalActionCreators,
};

type State = {
  processing: boolean,
};

const initialState: State = {
  processing: false,
};

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});

class AddVersion extends React.PureComponent {
  props: Props;
  state = initialState;

  addDependency = async (name, version) => {
    if (name) {
      this.props.modalActions.closeModal();
      this.setState({ processing: true });
      await this.props.addDependency(name, version);
      this.setState({ processing: false });
    }
  };

  openModal = () => {
    this.props.modalActions.openModal({
      width: 600,
      Body: <SearchDependencies onConfirm={this.addDependency} />,
    });
  };

  render() {
    const { processing } = this.state;
    return (
      <div style={{ position: 'relative' }}>
        <ButtonContainer>
          <Button disabled={processing} block small onClick={this.openModal}>
            Add Package
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(AddVersion);
