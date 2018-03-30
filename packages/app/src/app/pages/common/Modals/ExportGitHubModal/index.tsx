import * as React from 'react';

import GitProgress from 'app/components/GitProgress';

export type Props = {
    isExported: boolean;
};

const ExportGitHubModal: React.SFC<Props> = ({ isExported }) => {
    return <GitProgress result={isExported ? <div>Exported to GitHub!</div> : null} message="Creating Repository..." />;
};

export default ExportGitHubModal;
