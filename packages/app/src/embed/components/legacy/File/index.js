// @flow
import * as React from 'react';
import { EntryContainer as Entry } from 'app/pages/Sandbox/Editor/Workspace/elements';
import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import EntryTitle from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryTitle';

import { LeftOffset } from './elements';

type Props = {
  title: string,
  depth: number,
  type: string,
  active?: boolean,
  alternative?: boolean,
  onClick?: () => void,
};

export default class File extends React.PureComponent<Props> {
  static defaultProps = {
    active: false,
    alternative: false,
  };

  render() {
    const { title, depth, type, active, alternative, onClick } = this.props;
    return (
      <div>
        <Entry
          alternative={alternative}
          active={active}
          type={type}
          onClick={onClick}
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
