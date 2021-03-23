import React, { useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useAppState, useActions } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from '../elements';
import { CenteredMessage, SearchWrapper } from './elements';

import { PersonalTemplates } from './PersonalTemplates';
import { SearchBox } from '../SearchBox';
import { getTemplateInfosFromAPI } from '../utils/api';

interface CreateProps {
  collectionId?: string;
}

export const Create: React.FC<CreateProps> = ({ collectionId }) => {
  const state = useAppState();
  const actions = useActions();
  const [filter, setFilter] = React.useState('');
  const [officialTemplateInfos, setOfficialTemplates] = React.useState([]);

  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: 'create' });
  }, []);

  useEffect(() => {
    getTemplateInfosFromAPI('/api/v1/sandboxes/templates/official').then(x => {
      setOfficialTemplates(x);
    });
  }, []);

  return (
    <>
      <Header>
        <span>Create Sandbox</span>
        <SearchWrapper>
          <SearchBox
            onChange={evt => setFilter(evt.target.value)}
            value={filter}
            placeholder="Filter Templates"
          />
        </SearchWrapper>
      </Header>
      <Scrollable>
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
          filter={filter}
          hasLogIn={state.hasLogIn}
          officialTemplateInfos={officialTemplateInfos}
          collectionId={collectionId}
        />
      </Scrollable>
    </>
  );
};
