import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  sandboxUrl,
  githubRepoUrl,
  patronUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import TeamIcon from 'react-icons/lib/md/people';
import Stats from 'app/pages/common/Stats';
import { PrivacyStatus } from 'app/components/PrivacyStatus';
// import AliasComponent from './Alias';
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

interface IProjectProps {
  editable?: boolean;
  store: any;
  signals: any;
}

export const Project = inject('store', 'signals')(
  hooksObserver(
    ({
      editable,
      store: { editor, isPatron },
      signals: {
        workspace: { sandboxPrivacyChanged },
      },
    }: IProjectProps) => {
      const sandbox = editor.currentSandbox;
      const template = getTemplateDefinition(sandbox.template);
      const isServer = template.isServer;

      return (
        <Container>
          <BasicInfo>
            <Title editable={editable} />
            <Description editable={editable} />
            {/* Disable until we also moved SSE over */}
            {/* <Alias editable={editable} /> */}
          </BasicInfo>

          {!sandbox.team && sandbox.author && (
            <Author author={sandbox.author} />
          )}

          {sandbox.team && (
            <Tooltip
              appendTo="parent"
              content="This sandbox is owned by this team"
            >
              <Item style={{ color: 'white', display: 'flex' }}>
                <TeamIcon
                  style={{ fontSize: '1.125em', marginRight: '.5rem' }}
                />
                <div>{sandbox.team.name}</div>
              </Item>
            </Tooltip>
          )}

          {sandbox.git && (
            <Item>
              <GithubBadge
                url={githubRepoUrl(sandbox.git)}
                username={sandbox.git.username}
                repo={sandbox.git.repo}
                branch={sandbox.git.branch}
              />
            </Item>
          )}

          <StatsContainer>
            <Stats sandbox={sandbox} />
          </StatsContainer>

          <Keywords editable={editable} />

          <Group>
            <Item>
              <PropertyName>Privacy</PropertyName>
              <PropertyValue>
                <PrivacyContainer>
                  {editable ? (
                    <>
                      <PrivacySelect
                        value={sandbox.privacy}
                        disabled={!isPatron}
                        onChange={event =>
                          sandboxPrivacyChanged({
                            privacy: Number(event.target.value),
                          })
                        }
                      >
                        <option value={0}>Public</option>
                        {isPatron && (
                          <option value={1}>
                            Unlisted (only available by url)
                          </option>
                        )}
                        {!isServer && isPatron && (
                          <option value={2}>Private</option>
                        )}
                      </PrivacySelect>
                    </>
                  ) : (
                    <PrivacyStatus privacy={sandbox.privacy} />
                  )}
                </PrivacyContainer>
              </PropertyValue>
            </Item>

            {!isPatron && (
              <Explanation style={{ marginTop: '-1rem' }}>
                You can change privacy of a sandbox as a{' '}
                <a href={patronUrl()} target="_blank">
                  patron
                </a>
                .
              </Explanation>
            )}

            {editable && <Frozen isFrozen={sandbox.isFrozen} />}

            {sandbox.forkedFromSandbox && (
              <Item>
                <PropertyName>Forked From</PropertyName>
                <PropertyValue>
                  <TemplateStyledLink
                    to={sandboxUrl(sandbox.forkedFromSandbox)}
                  >
                    {getSandboxName(sandbox.forkedFromSandbox)}
                  </TemplateStyledLink>
                </PropertyValue>
              </Item>
            )}

            <Item>
              <PropertyName>
                Environment{' '}
                <Tooltip
                  boundary="viewport"
                  interactive
                  content={
                    <>
                      The environment determines how a sandbox is executed, you
                      can find more info{' '}
                      <a target="_blank" href="/docs/environment">
                        here
                      </a>
                      .
                    </>
                  }
                >
                  <Icon />
                </Tooltip>
              </PropertyName>
              <PropertyValue>
                <BundlerLink href={template.url}>
                  {sandbox.template}
                </BundlerLink>
              </PropertyValue>
            </Item>
          </Group>

          {editable && <SandboxConfig />}
        </Container>
      );
    }
  )
);
