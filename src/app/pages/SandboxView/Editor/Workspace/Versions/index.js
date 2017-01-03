// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import DotIcon from 'react-icons/lib/go/primitive-dot';

import WorkspaceTitle from '../WorkspaceTitle';
import versionEntity from '../../../../../store/entities/versions';
import type { Sandbox } from '../../../../../store/entities/sandboxes/index';
import type { Version } from '../../../../../store/entities/versions/index';
import { versionsBySandboxSelector } from '../../../../../store/entities/versions/selector';

import EntryContainer from '../EntryContainer';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import Button from '../../../../../components/buttons/Button';

type Props = {
  sandbox: Sandbox;
  versions: Array<Version>;
};

const Description = styled.p`
  color: ${props => props.theme.background.lighten(2)};
  margin-top: 0;
  padding: 0 1rem;
  line-height: 1.2;
  font-size: .875rem;
`;

const VersionTitle = styled.span`
  padding-left: 0.5rem;
  vertical-align: middle;
`;

const VersionDate = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;

const Icon = styled.span`
  vertical-align: middle;
`;

const mapDispatchToProps = dispatch => ({
  versionActions: bindActionCreators(versionEntity.actions, dispatch),
});
const mapStateToProps = (state, props: Props) => ({
  versions: versionsBySandboxSelector(state, { sandbox: props.sandbox }),
});
class Versions extends React.PureComponent {
  props: Props;

  render() {
    const { versions } = this.props;
    return (
      <div>
        <WorkspaceTitle>Versions</WorkspaceTitle>
        <Description>
          You can publish versions of your sandbox to make your sandbox available
          for others to use as a dependency.
        </Description>

        <WorkspaceInputContainer>
          <input placeholder="0" style={{ textAlign: 'center', flex: 1 }} />
          <input placeholder="0" style={{ textAlign: 'center', flex: 1 }} />
          <input placeholder="0" style={{ textAlign: 'center', flex: 1 }} />
          <Button small style={{ flex: 5, marginLeft: '0.25rem' }}>Publish</Button>
        </WorkspaceInputContainer>

        {versions.map(v => (
          <EntryContainer key={v.version}>
            <Icon><DotIcon /></Icon>
            <VersionTitle>{v.version}</VersionTitle>
            <VersionDate>{moment(v.insertedAt).format('lll')}</VersionDate>
          </EntryContainer>
        ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Versions);
