import { ThemeProvider } from '@codesandbox/components';
import Modal from 'app/components/Modal';
import { useAppState, useActions } from 'app/overmind';
import { DELETE_ME_COLLECTION } from 'app/overmind/namespaces/dashboard/types';
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { COLUMN_MEDIA_THRESHOLD, CreateSandbox } from './CreateSandbox';

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

const collectionPathRegex = /^.*dashboard\/sandboxes/;

const useHasNavigated = ({ pathname }: ReturnType<typeof useLocation>) => {
  const previousLocationRef = useRef<string>();

  useEffect(() => {
    previousLocationRef.current = pathname;
  }, [pathname]);

  if (previousLocationRef.current === pathname) {
    return true;
  }

  return false;
};

export const CreateSandboxModal = () => {
  const { modals, dashboard } = useAppState();
  const { modals: modalsActions } = useActions();
  const location = useLocation();
  const hasNavigated = useHasNavigated(location);

  const implicitCollection = getImplicitCollectionIdFromFolder(
    location.pathname,
    dashboard.allCollections
  );

  useEffect(() => {
    if (hasNavigated) {
      modalsActions.newSandboxModal.close();
    }
  }, [hasNavigated, modalsActions.newSandboxModal]);

  return (
    <ThemeProvider>
      <Modal
        isOpen={modals.newSandboxModal.isCurrent}
        onClose={() => modalsActions.newSandboxModal.close()}
        width={window.outerWidth > COLUMN_MEDIA_THRESHOLD ? 1200 : 950}
        fullWidth={window.screen.availWidth < 800}
      >
        <CreateSandbox
          isModal
          collectionId={
            modals.newSandboxModal.collectionId || implicitCollection?.id
          }
          initialTab={modals.newSandboxModal.initialTab}
        />
      </Modal>
    </ThemeProvider>
  );
};
