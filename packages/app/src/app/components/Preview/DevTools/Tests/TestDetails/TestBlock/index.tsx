import * as React from 'react';
import FileIcon from 'react-icons/lib/md/insert-drive-file';
import Tooltip from 'common/components/Tooltip';

import { BlockHeader, Container, Actions } from './elements';
import TestName from './TestName';
import ErrorDetails from '../ErrorDetails';

import { Test } from 'app/components/Preview/DevTools/Tests/types';

type Props = {
    test: Test;
    openFile?: (path: string) => void;
};

const TestBlock: React.SFC<Props> = ({ test, openFile }) => (
    <Container>
        <BlockHeader>
            <TestName test={test} />
            <Actions>
                {openFile && (
                    <Tooltip title="Open File">
                        <FileIcon onClick={openFile} />
                    </Tooltip>
                )}
                <div>{test.duration != null ? `${test.duration}ms` : ''}</div>
            </Actions>
        </BlockHeader>
        {test.errors &&
            test.errors.length !== 0 &&
            test.errors.map((error) => <ErrorDetails error={error} path={test.path} key={error.message} />)}
    </Container>
);

export default TestBlock;
