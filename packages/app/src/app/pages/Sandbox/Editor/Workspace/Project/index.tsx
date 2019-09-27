import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  githubRepoUrl,
  patronUrl,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { PrivacyStatus } from 'app/components/PrivacyStatus';
import { Stats } from 'app/pages/common/Stats';
import React, { ChangeEvent, FunctionComponent } from 'react';
import TeamIcon from 'react-icons/lib/md/people';

import { useOvermind } from 'app/overmind';

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
import { Keywords } from './Keywords';
import { SandboxConfig } from './SandboxConfig';
import { Title } from './Title';

type Props = {
  editable?: boolean;
};
export const Project: FunctionComponent<Props> = ({ editable }) => {
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

      {team && (
        <Tooltip appendTo="parent" content="This sandbox is owned by this team">
          <Item style={{ color: 'white', display: 'flex' }}>
            <TeamIcon style={{ fontSize: '1.125em', marginRight: '.5rem' }} />

            <div>{team.name}</div>
          </Item>
        </Tooltip>
      )}

      {git && (
        <Item>
          <GithubBadge
            branch={git.branch}
            commitSha={git.commitSha}
            repo={git.repo}
            url={githubRepoUrl(git)}
            username={git.username}
          />
        </Item>
      )}

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
