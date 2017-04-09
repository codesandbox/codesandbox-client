// @flow

import React from 'react';
import styled from 'styled-components';
import FunctionIconSvg from 'react-icons/lib/fa/code';
import DirectoryIconSvg from 'react-icons/lib/go/file-directory';
import Entry from 'app/pages/Sandbox/Editor/Workspace/EntryContainer';

type Props = {
  id: string,
  title: 'module' | 'directory',
  type: string,
  setCurrentModule: (id: string) => void,
  depth: number,
  active?: boolean,
  alternative?: boolean,
};
const LeftOffset = styled.div`
  padding-left: ${props => props.depth}rem;
`;

export default class File extends React.PureComponent {
  props: Props;

  getIcon = () => {
    const { type } = this.props;

    const Icon = type === 'directory' ? DirectoryIconSvg : FunctionIconSvg;
    const StyledIcon = styled(Icon)`
      margin-right: 0.5rem;
      vertical-align: middle;
    `;

    return <StyledIcon />;
  };

  setCurrentModule = () => {
    const { id, setCurrentModule } = this.props;

    setCurrentModule(id);
  };

  render() {
    const { title, depth, active, alternative } = this.props;
    return (
      <div>
        <Entry
          alternative={alternative}
          active={active}
          onClick={this.setCurrentModule}
        >
          <LeftOffset depth={depth}>{this.getIcon()} {title}</LeftOffset>
        </Entry>
      </div>
    );
  }
}
