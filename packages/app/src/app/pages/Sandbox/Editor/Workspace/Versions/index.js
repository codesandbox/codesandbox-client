// @flow
import * as React from 'react';
import styled from 'styled-components';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import EntryContainer from '../EntryContainer';
import PublishFields from './PublishFields';

type Props = {
  // sandbox: Sandbox,
  // versions: Array<Version>,
  // versionActions: typeof versionEntity.actions,
};

const Description = styled.p`
  color: ${props => props.theme.background.lighten(2)};
  margin-top: 0;
  padding: 0 1rem;
  line-height: 1.2;
  font-size: 0.875rem;
`;

const VersionDate = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;

// eslint-disable-next-line
export default class Versions extends React.PureComponent<Props> {
  render() {
    return (
      <div>
        <Description>
          You can publish versions of your sandbox to make your sandbox
          available for others to use as a dependency.
        </Description>

        <PublishFields />

        <WorkspaceSubtitle>Published versions</WorkspaceSubtitle>
        {[].map(v => (
          <EntryContainer key={v.version}>
            <span>{v.version}</span>
            <VersionDate>
              {/* moment(v.insertedAt).format('lll') */}
            </VersionDate>
          </EntryContainer>
        ))}
      </div>
    );
  }
}
