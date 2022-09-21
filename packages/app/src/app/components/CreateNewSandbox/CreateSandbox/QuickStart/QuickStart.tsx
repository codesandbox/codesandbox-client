import React, { useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useAppState, useActions } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from '../elements';
import { CenteredMessage } from './elements';

import { PersonalTemplates } from './PersonalTemplates';
import { getTemplateInfosFromAPI } from '../utils/api';

interface QuickStartProps {
  collectionId?: string;
}

export const QuickStart: React.FC<QuickStartProps> = ({ collectionId }) => {
  const { hasLogIn } = useAppState();
  const actions = useActions();
  const [officialTemplates, setOfficialTemplates] = React.useState([]);

  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'create' });
  }, []);

  // ❗️ HERE (these are here to stay, move them up probably)
  useEffect(() => {
    getTemplateInfosFromAPI('/api/v1/sandboxes/templates/official').then(x => {
      setOfficialTemplates(x);
    });
  }, []);

  return (
    <>
      {/* ❗️ TODO: Move header to CreateSandbox component */}
      <Header>
        <span>Start from a template</span>
      </Header>
      <Scrollable>
        {/* ❗️ TODO: This message should be moved UP probably */}
        {!hasLogIn && (
          <CenteredMessage>
            <div>
              <LinkButton onClick={() => actions.signInClicked()}>
                Sign in
              </LinkButton>{' '}
              to create and bookmark templates for later use.
            </div>
          </CenteredMessage>
        )}

        {/* ❗️ TODO: Rename to official templates or move component content to this component */}
        <PersonalTemplates
          officialTemplates={officialTemplates}
          collectionId={collectionId}
        />
      </Scrollable>
    </>
  );
};
