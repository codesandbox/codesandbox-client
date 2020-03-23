import React, { FunctionComponent } from 'react';
import { GitProgress } from 'app/components/GitProgress';

type Props = {
  isExported?: boolean;
};
const ExportGitHubModal: FunctionComponent<Props> = ({
  isExported = false,
}) => (
  <GitProgress
    result={isExported ? <div>Exported to GitHub!</div> : null}
    message="Creating Repository..."
  />
);

export default ExportGitHubModal;
