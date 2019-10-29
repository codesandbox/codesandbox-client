import React from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useOvermind } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import { SandboxCard } from '../SandboxCard';
import { Header } from '../elements';
import { SubHeader, Grid, CenteredMessage } from './elements';
import { all } from '../availableTemplates';

import { PersonalTemplates } from './PersonalTemplates';

export const Create = () => {
  const { state, actions } = useOvermind();

  return (
    <>
      <Header>
        <span>Create Sandbox</span>
      </Header>
      <Scrollable>
        {state.hasLogIn ? (
          <PersonalTemplates />
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

        <SubHeader>Official Templates</SubHeader>
        <Grid>
          {all.map(template => (
            <SandboxCard official key={template.niceName} template={template} />
          ))}
        </Grid>
      </Scrollable>
    </>
  );
};
