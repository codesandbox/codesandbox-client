import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  patronUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { PrivacyStatus } from 'app/components/PrivacyStatus';
import { useOvermind } from 'app/overmind';
import { Stats } from 'app/pages/common/Stats';

// import { Alias } from './Alias';
import { Author } from './Author';
import { Description } from './Description';
import {
  BasicInfo,
  BundlerLink,
  Container,
  Explanation,
  Group,
  Icon,
  Item,
  PrivacyContainer,
  PrivacySelect,
  PropertyName,
  PropertyValue,
  StatsContainer,
  TemplateStyledLink,
} from './elements';
import { Frozen } from './Frozen';
import { Git } from './Git';
import { Keywords } from './Keywords';
import { SandboxConfig } from './SandboxConfig';
import { Team } from './Team';
import { Title } from './Title';

type Props = {
  editable?: boolean;
};
export const Project: FunctionComponent<Props> = ({ editable = false }) => {
  const {
    actions: {
      workspace: { sandboxPrivacyChanged },
    },
    state: {
      editor: {
        currentSandbox,
        currentSandbox: {
          author,
          forkedFromSandbox,
          forkedTemplateSandbox,
          git,
          privacy,
          team,
          template,
        },
      },
      isPatron,
    },
  } = useOvermind();
  const { url } = getTemplateDefinition(template);

  return (
    <Container>
      <BasicInfo>
        <Title editable={editable} />

        <Description editable={editable} />

        {/* Disable until we also moved SSE over */}
        {/* {isPatron && <Alias editable={editable} />} */}
      </BasicInfo>

      {!team && author && <Author />}

      {team && <Team/>}

      {git && <Git />}

      <StatsContainer>
        <Stats sandbox={currentSandbox} />
      </StatsContainer>

      <Keywords editable={editable} />

      <Group>
        <Item>
          <PropertyName>Privacy</PropertyName>

          <PropertyValue>
            <PrivacyContainer>
              {editable ? (
                <PrivacySelect
                  disabled={!isPatron}
                  onChange={({
                    target: { value },
                  }: ChangeEvent<HTMLSelectElement>) =>
                    sandboxPrivacyChanged(Number(value) as 0 | 1 | 2)
                  }
                  value={privacy}
                >
                  <option value={0}>Public</option>

                  {isPatron && (
                    <option value={1}>Unlisted (only available by url)</option>
                  )}

                  {isPatron && <option value={2}>Private</option>}
                </PrivacySelect>
              ) : (
                <PrivacyStatus privacy={privacy} />
              )}
            </PrivacyContainer>
          </PropertyValue>
        </Item>

        {!isPatron && (
          <Explanation style={{ marginTop: '-1rem' }}>
            You can change privacy of a sandbox as a{' '}
            <a href={patronUrl()} rel="noopener noreferrer" target="_blank">
              patron
            </a>
            .
          </Explanation>
        )}

        {editable && <Frozen />}

        {(forkedFromSandbox || forkedTemplateSandbox) && (
          <Item>
            <PropertyName>
              {forkedTemplateSandbox ? 'Template' : 'Forked From'}
            </PropertyName>

            <PropertyValue>
              <TemplateStyledLink
                to={sandboxUrl(forkedFromSandbox || forkedTemplateSandbox)}
              >
                {getSandboxName(forkedFromSandbox || forkedTemplateSandbox)}
              </TemplateStyledLink>
            </PropertyValue>
          </Item>
        )}

        <Item>
          <PropertyName>
            Environment{' '}
            <Tooltip
              boundary="viewport"
              content={
                <>
                  The environment determines how a sandbox is executed, you can
                  find more info{' '}
                  <a href="/docs/environment" target="_blank">
                    here
                  </a>
                  .
                </>
              }
              interactive
            >
              <Icon />
            </Tooltip>
          </PropertyName>

          <PropertyValue>
            <BundlerLink href={url}>{template}</BundlerLink>
          </PropertyValue>
        </Item>
      </Group>

      {editable && <SandboxConfig />}
    </Container>
  );
};
