import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const NotFoundBranchModal: FunctionComponent = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  useEffect(() => {
    window.setTimeout(() => {
      redirectUser();
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectUser = () => {
    const pathname = window.location.pathname;
    const { branch, repo, username } = currentSandbox.baseGit;

    location.replace(
      pathname.replace(pathname, `/s/github/${username}/${repo}/tree/${branch}`)
    );
  };

  return (
    <Alert
      title={`We couldn't find your branch`}
      description={
        <>
          Seems the branch this sandbox was connected to does not exist anymore.
          You will be redirected in 5 seconds, lease click the button to go back
          to the <b>{currentSandbox.baseGit.branch}</b> branch if nothing
          happens
        </>
      }
      onPrimaryAction={redirectUser}
      confirmMessage="Redirect"
    />
  );
};
