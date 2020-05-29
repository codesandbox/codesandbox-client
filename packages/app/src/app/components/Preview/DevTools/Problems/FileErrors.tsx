import Tooltip from '@codesandbox/common/es/components/Tooltip';
import { actions, dispatch } from 'codesandbox-api';
import { sortBy } from 'lodash';
import React from 'react';
import { MdInsertDriveFile } from 'react-icons/md';
import { Animate } from 'react-show';

import { Actions, AnimatedChevron, File, FileName, Path } from './elements';
import { ProblemMessage } from './Message';
import { MessageType } from '.';

export interface Props {
  file: string;
  corrections: MessageType[];
}

const severityToNumber = {
  error: 1,
  warning: 2,
  notice: 3,
};

export function FileErrors({ file, corrections }: Props) {
  const [show, setShow] = React.useState(true);
  const splittedPath = file.split('/');
  const fileName = splittedPath.pop();

  const sortedCorrections = React.useMemo(
    () => sortBy(corrections, s => severityToNumber[s.severity]),
    [corrections]
  );

  return (
    <div key={file}>
      <File onClick={() => setShow(!show)}>
        <AnimatedChevron show={show} />

        <Path>{splittedPath.join('/')}/</Path>
        <FileName>{fileName}</FileName>
        <Actions>
          <Tooltip content="Open File">
            <MdInsertDriveFile
              onClick={e => {
                e.stopPropagation();
                dispatch(actions.editor.openModule(file));
              }}
            />
          </Tooltip>
        </Actions>
      </File>

      <Animate
        style={{
          height: 'auto',
          overflow: 'hidden',
        }}
        start={{
          height: 0, // The starting style for the component.
          // If the 'leave' prop isn't defined, 'start' is reused!
        }}
        show={show}
      >
        {sortedCorrections.map(message => (
          <ProblemMessage
            key={message.message + (message.line || 0) + (message.column || 0)}
            message={message}
          />
        ))}
      </Animate>
    </div>
  );
}
