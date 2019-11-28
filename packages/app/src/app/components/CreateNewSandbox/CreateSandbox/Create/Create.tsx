import React from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useOvermind } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from 'app/utils/history';
import { SandboxCard } from '../SandboxCard';
import { Header, SubHeader, Grid } from '../elements';
import { CenteredMessage } from './elements';
import { all } from '../availableTemplates';

import { PersonalTemplates } from './PersonalTemplates';
import { SearchBox } from '../SearchBox';

export const Create = () => {
  const { state, actions } = useOvermind();
  const [filter, setFilter] = React.useState('');

  return (
    <>
      <Header>
        <span>Create Sandbox</span>

        {state.hasLogIn && (
          <div>
            <SearchBox
              onChange={evt => setFilter(evt.target.value)}
              value={filter}
              placeholder="Filter Templates"
            />
          </div>
        )}
      </Header>
      <Scrollable>
        {state.hasLogIn ? (
          <PersonalTemplates filter={filter} />
        ) : (
          <CenteredMessage>
            <div>
              <LinkButton onClick={actions.signInGithubClicked}>
                Sign in
              </LinkButton>{' '}
              to create templates or bookmark templates for later use.
            </div>
          </CenteredMessage>
        )}

        {!filter && (
          // TODO: redo all of this once we have move our templates over to the new system
          <>
            <SubHeader>Official Templates</SubHeader>
            <Grid columnCount={2}>
              {all.map(template => (
                <SandboxCard
                  key={template.shortid}
                  title={template.niceName}
                  iconUrl={template.name}
                  environment={template.name}
                  detailText="CodeSandbox"
                  color={template.color()}
                  onClick={() => {
                    history.push(
                      sandboxUrl({ id: template.shortid, alias: null })
                    );
                  }}
                />
              ))}
            </Grid>
          </>
        )}
      </Scrollable>
    </>
  );
};
