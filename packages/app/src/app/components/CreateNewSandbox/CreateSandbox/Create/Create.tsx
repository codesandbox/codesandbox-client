import React, { useEffect } from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useOvermind } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from '../elements';
import { CenteredMessage } from './elements';

import { PersonalTemplates } from './PersonalTemplates';
import { SearchBox } from '../SearchBox';
import { getTemplateInfosFromAPI } from '../utils/api';

export const Create = () => {
  const { state, actions } = useOvermind();
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
        <div>
          <SearchBox
            onChange={evt => setFilter(evt.target.value)}
            value={filter}
            placeholder="Filter Templates"
          />
        </div>
      </Header>
      <Scrollable>
        {!state.hasLogIn && (
          <CenteredMessage>
            <div>
              <LinkButton onClick={actions.signInGithubClicked}>
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
        />
      </Scrollable>
    </>
  );
};
