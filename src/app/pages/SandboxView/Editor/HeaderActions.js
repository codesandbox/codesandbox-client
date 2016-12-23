// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';

import CloudIcon from 'react-icons/lib/md/cloud';
import ForkIcon from 'react-icons/lib/go/repo-clone';

import type { Sandbox } from '../../../store/entities/sandboxes/';
import sandboxEntity from '../../../store/entities/sandboxes';
import moduleEntity from '../../../store/entities/modules';
import directoryEntity from '../../../store/entities/directories';
import { singleSandboxBySlugSelector } from '../../../store/entities/sandboxes/selector';
import { forkSandboxUrl } from '../../../utils/url-generator';

const Actions = styled.div`
  height: 100%;
`;

const Action = styled.div`
  transition: 0.3s ease all;
  display: inline-block;
  font-size: 1rem;
  color: ${props => props.theme.background.lighten(2.5)};
  border-right: 1px solid ${props => props.theme.background.darken(0.2)};
  vertical-align: middle;
  cursor: pointer;

  height: 100%;
  line-height: 3rem;
  padding: 0 2rem;
  margin: 0rem;
  svg {
    font-size: 1.1rem;
  }
  span {
    padding-left: 0.5rem;
    vertical-align: middle;
  }

  &:hover {
    box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.2);
    color: ${props => props.theme.primaryText};
    border-right: 1px solid ${props => props.theme.primary.darken(0.2)};
    background-color: ${props => props.theme.primary};
  }
`;

type Props = {
  sandbox: ?Sandbox;
  moduleActions: typeof moduleEntity.actions;
  params: {
    id: ?string;
    slug: ?string;
    username: ?string;
  };
};
const mapStateToProps = (state, props) => ({
  sandbox: singleSandboxBySlugSelector(state, props.params),
});
const mapDispatchToProps = dispatch => ({
  moduleActions: bindActionCreators(moduleEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
  directoryActions: bindActionCreators(directoryEntity.actions, dispatch),
});
class HeaderActions extends React.PureComponent { // eslint-disable-line
  props: Props;

  handleSaveProject = () => {
    const { moduleActions, sandbox } = this.props;
    if (sandbox) {
      moduleActions.saveAllModules(sandbox.id);
    }
  }

  render() {
    const { sandbox } = this.props;
    if (sandbox == null) return false;

    return (
      <Actions>
        <Action onClick={this.handleSaveProject}>
          <CloudIcon />
          <span>Save Project</span>
        </Action>
        <Link to={forkSandboxUrl(this.props.sandbox)}>
          <Action>
            <ForkIcon />
            <span>Fork</span>
          </Action>
        </Link>
      </Actions>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HeaderActions);

