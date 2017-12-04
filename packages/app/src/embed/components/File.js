// @flow

import * as React from 'react';
import styled from 'styled-components';
import Entry from 'app/pages/Sandbox/Editor/Workspace/EntryContainer';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import EntryTitle from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryTitle';

type Props = {
  id: string,
  shortid: string,
  title: string,
  type: 'directory-open' | string,
  setCurrentModule: (shortid: string, id: string) => void,
  depth: number,
  active?: boolean,
  alternative?: boolean,
};
const LeftOffset = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding-left: ${props => props.depth}rem;
`;

export default class File extends React.PureComponent<Props> {
  static defaultProps = {
    active: false,
    alternative: false,
  };

  setCurrentModule = () => {
    const { id, shortid, setCurrentModule } = this.props;

    setCurrentModule(id, shortid);
  };

  render() {
    const { title, depth, type, active, alternative } = this.props;
    return (
      <div>
        <Entry
          alternative={alternative}
          active={active}
          onClick={this.setCurrentModule}
          type={type}
        >
          <LeftOffset depth={depth}>
            <EntryIcons type={type} />
            <EntryTitle title={title} />
          </LeftOffset>
        </Entry>
      </div>
    );
  }
}
