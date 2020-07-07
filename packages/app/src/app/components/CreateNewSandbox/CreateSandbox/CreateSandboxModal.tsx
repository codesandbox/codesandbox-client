import * as React from 'react';
import Modal from 'app/components/Modal';
import { useOvermind } from 'app/overmind';
import { ThemeProvider } from '@codesandbox/components';
import { useLocation } from 'react-router-dom';
import { DELETE_ME_COLLECTION } from 'app/overmind/namespaces/dashboard/types';
import { CreateSandbox, COLUMN_MEDIA_THRESHOLD } from './CreateSandbox';

/**
 * If you have the dashboard open, in a collection path, we want to create new sandboxes
 * in that folder. That's why we get that path from the url.
 */
function getImplicitCollectionIdFromFolder(
  pathname: string,
  collections: DELETE_ME_COLLECTION[] | null
): DELETE_ME_COLLECTION | null {
  if (!collectionPathRegex.test(location.pathname)) {
    return null;
  }

  if (!collections) {
    return null;
  }

  const collectionPath = decodeURIComponent(
    pathname.replace(collectionPathRegex, '')
  );

  const collection = collections.find(c => c.path === collectionPath);

  return collection;
}

const collectionPathRegex = /^.*dashboard\/all/;
export const CreateSandboxModal = () => {
  const {
    state: { modals, dashboard },
    actions: { modals: modalsActions },
  } = useOvermind();

  const location = useLocation();
  const implicitCollection = getImplicitCollectionIdFromFolder(
    location.pathname,
    dashboard.allCollections
  );

  return (
    <ThemeProvider>
      <Modal
        isOpen={modals.newSandboxModal.isCurrent}
        onClose={() => modalsActions.newSandboxModal.close()}
        width={window.outerWidth > COLUMN_MEDIA_THRESHOLD ? 1200 : 950}
      >
        <CreateSandbox
          collectionId={
            modals.newSandboxModal.collectionId || implicitCollection?.id
          }
        />
      </Modal>
    </ThemeProvider>
  );
};
