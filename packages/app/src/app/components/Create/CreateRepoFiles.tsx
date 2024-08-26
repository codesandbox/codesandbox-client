import { useActions } from 'app/overmind';
import { useEffect } from 'react';

export function CreateRepoFiles() {
  const actions = useActions();

  useEffect(() => {
    window.addEventListener('message', event => {
      if (event.data.type === 'create-repo-files') {
        actions
          .createRepoFiles(event.data.sandbox)
          .then(data => {
            window.parent.postMessage(
              { type: 'create-repo-files-success', message: data },
              '*'
            );
          })
          .catch(error => {
            window.parent.postMessage(
              {
                type: 'create-repo-files-error',
                message: 'Could not create - ' + String(error),
              },
              '*'
            );
          });
      }
    });

    window.parent.postMessage({ type: 'create-repo-files-ready' }, '*');
  }, []);

  return null;
}
