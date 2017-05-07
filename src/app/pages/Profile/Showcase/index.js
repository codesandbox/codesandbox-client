// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { Sandbox } from 'common/types';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';
import { singleSandboxSelector } from 'app/store/entities/sandboxes/selectors';
import Column from 'app/components/flex/Column';
import Centered from 'app/components/flex/Centered';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';
import Margin from '../../../components/spacing/Margin';

type Props = {
  id: string,
  sandboxActions: typeof sandboxActionCreators,
  sandbox: Sandbox,
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
});
class Showcase extends React.PureComponent {
  props: Props;

  componentDidMount() {
    const { id, sandbox, sandboxActions } = this.props;

    if (!sandbox && id) {
      sandboxActions.getById(id);
    }
  }

  render() {
    const { sandbox, id } = this.props;

    if (!id) {
      return (
        <Centered vertical horizontal>
          <Margin top={4}>
            <ErrorTitle>This user doesn{"'"}t have a sandbox yet</ErrorTitle>
          </Margin>
        </Centered>
      );
    }
    if (!sandbox) return <div />;

    return (
      <Column alignItems="inherit" style={{ marginTop: '2rem' }}>
        <div style={{ flex: 2 }}><ShowcasePreview sandbox={sandbox} /></div>
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
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Showcase);
