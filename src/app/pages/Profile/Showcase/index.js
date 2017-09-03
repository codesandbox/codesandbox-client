// @flow
import * as React from 'react';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { Sandbox } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import { singleSandboxSelector } from 'app/store/entities/sandboxes/selectors';
import modalActionCreators from 'app/store/modal/actions';
import Column from 'app/components/flex/Column';
import Centered from 'app/components/flex/Centered';
import Margin from 'app/components/spacing/Margin';
import Button from 'app/components/buttons/Button';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';
import SelectSandbox from './SelectSandbox';

type Props = {
  id: string,
  sandboxActions: typeof sandboxActionCreators,
  modalActions: typeof modalActionCreators,
  sandbox: Sandbox,
  isCurrentUser: boolean,
};

type State = {
  loading: boolean,
};

const ErrorTitle = styled.div`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
`;

const mapStateToProps = (state, props) => ({
  sandbox: singleSandboxSelector(state, props),
});
const mapDispatchToProps = dispatch => ({
  sandboxActions: bindActionCreators(sandboxActionCreators, dispatch),
  modalActions: bindActionCreators(modalActionCreators, dispatch),
});
class Showcase extends React.PureComponent<Props, State> {
  state = {
    loading: false,
  };

  fetchSandbox(id: string) {
    const { sandboxActions } = this.props;

    if (!this.state.loading) {
      this.setState({ loading: true }, () => {
        sandboxActions
          .getById(id)
          .then(() => this.setState({ loading: false }));
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { id } = this.props;

    if (prevProps.id !== id) {
      this.fetchSandbox(id);
    }
  }

  componentDidMount() {
    const { id, sandbox } = this.props;

    if (!sandbox && id) {
      this.fetchSandbox(id);
    }
  }

  openModal = () => {
    const { modalActions, sandbox } = this.props;
    modalActions.openModal({
      title: 'Select Showcase Sandbox',
      width: 600,
      Body: <SelectSandbox showcaseSandboxId={sandbox.id} />,
    });
  };

  render() {
    const { sandbox, id, isCurrentUser } = this.props;

    const { loading } = this.state;

    if (!id) {
      return (
        <Centered vertical horizontal>
          <Margin top={4}>
            {!id && (
              <ErrorTitle>This user doesn{"'"}t have a sandbox yet</ErrorTitle>
            )}
          </Margin>
        </Centered>
      );
    }
    if (!sandbox) return <div />;

    return (
      <Column alignItems="center">
        <Margin top={1}>
          {isCurrentUser && (
            <Button small onClick={this.openModal}>
              Change Sandbox
            </Button>
          )}
        </Margin>
        {!loading && (
          <Margin top={2} style={{ width: '100%' }}>
            <Column alignItems="initial">
              <div style={{ flex: 2 }}>
                <ShowcasePreview sandbox={sandbox} />
              </div>
              <div style={{ flex: 1 }}>
                <SandboxInfo
                  title={sandbox.title || 'Untitled'}
                  description={sandbox.description}
                  likeCount={sandbox.likeCount}
                  viewCount={sandbox.viewCount}
                  forkCount={sandbox.forkCount}
                  id={id}
                />
              </div>
            </Column>
          </Margin>
        )}
      </Column>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcase);
