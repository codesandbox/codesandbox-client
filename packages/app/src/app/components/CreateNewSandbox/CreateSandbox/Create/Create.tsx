import { Scrollable } from '@codesandbox/common/es/components/Scrollable';
import track from '@codesandbox/common/es/utils/analytics';
import { LinkButton } from 'app/components/LinkButton';
import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';

import { Header } from '../elements';
import { SearchBox } from '../SearchBox';
import { getTemplateInfosFromAPI } from '../utils/api';
import { CenteredMessage } from './elements';
import { PersonalTemplates } from './PersonalTemplates';

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
