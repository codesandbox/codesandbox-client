import React from 'react';

import Progress from '../../Git/Progress';

function ExportToGithub({ isExported }) {
  return (
    <Progress
      result={isExported ? <div>Exported to GitHub!</div> : null}
      message="Creating Repository..."
    />
  );
}

export default ExportToGithub;
