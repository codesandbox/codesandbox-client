import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import TeamIcon from 'react-icons/lib/md/people';
import {
  sandboxUrl,
  githubRepoUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import getTemplate from '@codesandbox/common/lib/templates';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import Stats from 'app/pages/common/Stats';
import { useSignals, useStore } from 'app/store';
import { Title } from './Title';
import { Description } from './Description';
// import AliasComponent from './Alias';
import { Author } from './Author';
import { Keywords } from './Keywords';
import { Frozen } from './Frozen';
import { SandboxConfig } from './SandboxConfig';
import {
  Container,
  BasicInfo,
  Item,
  Group,
  StatsContainer,
  PrivacyContainer,
  PropertyValue,
  PropertyName,
  PrivacySelect,
  Icon,
  TemplateStyledLink,
  BundlerLink,
} from './elements';

interface IProjectProps {
  editable?: boolean;
}

export const Project = observer(({ editable }: IProjectProps) => {
  const { editor, isPatron } = useStore();
  const {
    workspace: { sandboxPrivacyChanged },
  } = useSignals();
  const isServer = getTemplate(editor.currentSandbox.template).isServer;
  const sandbox = editor.currentSandbox;
  const template = getTemplateDefinition(sandbox.template);

  return (
    <Container>
      <BasicInfo>
        <Title editable={editable} />
        <Description editable={editable} />
        {/* Disable until we also moved SSE over */}
        {/* <Alias editable={editable} /> */}
      </BasicInfo>
      {!sandbox.team && sandbox.author && <Author author={sandbox.author} />}
      {sandbox.team && (
        <Tooltip content="This sandbox is owned by this team">
          <Item style={{ color: 'white', display: 'flex' }}>
            <TeamIcon style={{ fontSize: '1.125em', marginRight: '.5rem' }} />
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
          <PropertyName>
            Privacy{' '}
            {!isPatron && (
              <Tooltip
                content={
                  'Having private and unlisted Sandboxes is available as Patron.'
                }
              >
                <Icon />
              </Tooltip>
            )}
          </PropertyName>
          <PropertyValue>
            <PrivacyContainer>
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
                  <option value={1}>Unlisted (only available by url)</option>
                )}
                {!isServer && isPatron && <option value={2}>Private</option>}
              </PrivacySelect>
            </PrivacyContainer>
          </PropertyValue>
        </Item>
        {editable && <Frozen isFrozen={sandbox.isFrozen} />}
        {sandbox.forkedFromSandbox && (
          <Item>
            <PropertyName>Forked From</PropertyName>
            <PropertyValue>
              <TemplateStyledLink to={sandboxUrl(sandbox.forkedFromSandbox)}>
                {sandbox.forkedFromSandbox.title ||
                  sandbox.forkedFromSandbox.id}
              </TemplateStyledLink>
            </PropertyValue>
          </Item>
        )}
        {/* NOTE: We should only show Bundler for Client Sandboxes, since Containers use node */}
        {!isServer && (
          <Item>
            <PropertyName>Bundler</PropertyName>
            <PropertyValue>
              <BundlerLink href={template.url}>{sandbox.template}</BundlerLink>
            </PropertyValue>
          </Item>
        )}
      </Group>
      {editable && <SandboxConfig />}
    </Container>
  );
});
