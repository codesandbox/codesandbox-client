import * as React from 'react';

import { WorkspaceSubtitle, EntryContainer } from '../elements';
import PublishFields from './PublishFields';

import { Description, VersionDate } from './elements';

export default class Versions extends React.PureComponent {
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
