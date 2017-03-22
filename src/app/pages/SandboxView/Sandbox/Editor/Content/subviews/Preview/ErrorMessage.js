import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

const Container = styled.div`
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
  background-color: ${props => props.theme.redBackground};
  color: ${props => props.theme.red};
  height: 100%;
  width: 100%;
  padding: 1rem;
`;

type Props = {
  sandboxId: string,
  error: { type: string, title: string, message: string },
  sandboxActions: typeof sandboxActionCreators,
};

const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
});

class ErrorMessage extends React.PureComponent {
  props: Props;

  addDependency = name =>
    async () => {
      const { sandboxId, sandboxActions } = this.props;
      await sandboxActions.addNPMDependency(sandboxId, name);
      sandboxActions.fetchDependenciesBundle(sandboxId);
    };

  getMessage = () => {
    const { error } = this.props;
    if (error.type === 'dependency-not-found') {
      return (
        <div>

          Could not find the dependency {"'"}
          {error.message}
          {"'"}
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={this.addDependency(error.message)} small>
              ADD DEPENDENCY TO PROJECT
            </Button>
          </div>
        </div>
      );
    }
    return <div>{error.title}: {error.message}</div>;
  };

  render() {
    return (
      <Container>
        {this.getMessage()}
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(ErrorMessage);
