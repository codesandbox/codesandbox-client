import React, { FunctionComponent, useEffect } from 'react';

import { useAppState } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const NotFoundBranchModal: FunctionComponent = () => {
  const { currentSandbox } = useAppState().editor;

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
          You will be redirected in 5 seconds to the{' '}
          <b>{currentSandbox.baseGit.branch}</b> branch.
        </>
      }
      onPrimaryAction={redirectUser}
      confirmMessage={`Send me to the ${currentSandbox.baseGit.branch} branch`}
    />
  );
};
