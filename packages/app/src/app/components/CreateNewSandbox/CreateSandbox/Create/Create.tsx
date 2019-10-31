import React from 'react';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { useOvermind } from 'app/overmind';
import { LinkButton } from 'app/components/LinkButton';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
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
            <SandboxCard
              key={template.name}
              title={template.niceName}
              iconUrl={template.name}
              environment={template.name}
              owner="CodeSandbox"
              url={sandboxUrl({ id: template.shortid, alias: null })}
              official
              color={template.color}
              mine={false}
              templateId="" // TODO
              sandboxId={template.shortid}
            />
          ))}
        </Grid>
      </Scrollable>
    </>
  );
};
