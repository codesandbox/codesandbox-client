import * as React from 'react';

import ChevronRight from 'react-icons/lib/md/chevron-right';
import ChevronLeft from 'react-icons/lib/fa/angle-double-left';
import WarningIcon from 'react-icons/lib/md/warning';
import ErrorIcon from 'react-icons/lib/md/error';
import { LogType } from '../types';

type Props = {
    type: string;
    logType: LogType;
};

const MessageIcon: React.SFC<Props> = ({ type, logType }) => {
    if (type === 'command') {
        return <ChevronRight />;
    }

    if (type === 'return') {
        return <ChevronLeft />;
    }

    switch (logType) {
        case 'warning':
        case 'warn':
            return <WarningIcon />;
        case 'error':
            return <ErrorIcon />;
        default:
            return null;
    }
};

export default MessageIcon;
