import * as React from 'react';
import { Animate } from 'react-show';
import { sortBy } from 'lodash';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import FileIcon from 'react-icons/lib/md/insert-drive-file';

import { File, Path, FileName, Actions, AnimatedChevron } from './elements';
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
            <FileIcon
              onClick={e => {
                e.stopPropagation();
                this.openFile(file);
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
