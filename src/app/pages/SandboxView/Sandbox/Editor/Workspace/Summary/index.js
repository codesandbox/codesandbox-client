import React from 'react';
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  title: string,
  description: string,
};

export default class Summary extends React.PureComponent {
  props: Props;

  render() {
    return (
      <div>
        <WorkspaceSubtitle>Title</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <input type="text" />
        </WorkspaceInputContainer>
        <WorkspaceSubtitle>Description</WorkspaceSubtitle>
        <WorkspaceInputContainer>
          <textarea type="text" />
        </WorkspaceInputContainer>
      </div>
    );
  }
}
