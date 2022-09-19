import React, { useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useAppState, useActions } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from '../elements';
import { CenteredMessage /* , SearchWrapper */ } from './elements';

import { PersonalTemplates } from './PersonalTemplates';
// import { SearchBox } from '../SearchBox';
import { getTemplateInfosFromAPI } from '../utils/api';

interface QuickStartProps {
  collectionId?: string;
}

export const QuickStart: React.FC<QuickStartProps> = ({ collectionId }) => {
  const state = useAppState();
  const actions = useActions();
  // const [filter, setFilter] = React.useState('');
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
      <Header>
        <span>Start from a template</span>
        {/* ❗️ Header and Searlch will be moved to CreateSandbox */}
        {/* <SearchWrapper>
          <SearchBox
            onChange={evt => setFilter(evt.target.value)}
            value={filter}
            placeholder="Filter Templates"
          />
        </SearchWrapper> */}
      </Header>
      <Scrollable>
        {/* ❗️ TODO: Login should be moved UP probably */}
        {!state.hasLogIn && (
          <CenteredMessage>
            <div>
              <LinkButton onClick={() => actions.signInClicked()}>
                Sign in
              </LinkButton>{' '}
              to create and bookmark templates for later use.
            </div>
          </CenteredMessage>
        )}

        <PersonalTemplates
          // filter={filter}
          hasLogIn={state.hasLogIn}
          officialTemplates={officialTemplates}
          collectionId={collectionId}
        />
      </Scrollable>
    </>
  );
};
