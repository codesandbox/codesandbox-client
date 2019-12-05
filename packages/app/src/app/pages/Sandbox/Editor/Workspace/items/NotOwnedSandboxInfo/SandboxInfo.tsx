import React from 'react';
import { Sandbox, Template } from '@codesandbox/common/lib/types';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import getTemplateDefinition from '@codesandbox/common/lib/templates';

import { Icons } from '@codesandbox/template-icons';
import getIcon from '@codesandbox/common/lib/templates/icons';

import { UserWithAvatar } from '@codesandbox/common/lib/components/UserWithAvatar';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { Stats } from 'app/pages/common/Stats';
import { PrivacyStatus } from 'app/components/PrivacyStatus';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import {
  sandboxUrl,
  githubRepoUrl,
  profileUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import GithubBadge from '@codesandbox/common/lib/components/GithubBadge';
import {
  Container,
  Title,
  Description,
  HeaderInfo,
  TemplateIconContainer,
  Environment,
  Item,
  PropertyName,
  PropertyValue,
  Group,
  StyledLink,
} from './elements';

export interface ISandboxInfoProps {
  sandbox: Sandbox;
}

const TemplateIcon = ({
  iconUrl,
  environment,
}: {
  iconUrl: string;
  environment: Template;
}) => {
  const UserIcon: React.FunctionComponent =
    Icons[iconUrl] || getIcon(environment.name);

  return (
    <TemplateIconContainer>
      <UserIcon />
    </TemplateIconContainer>
  );
};

export const SandboxInfo = ({ sandbox }: ISandboxInfoProps) => {
  const environment = getTemplateDefinition(sandbox.template);
  const customTemplate = sandbox.customTemplate;

  return (
    <Container>
      <HeaderInfo>
        {customTemplate && (
          <TemplateIcon
            environment={environment}
            iconUrl={customTemplate.iconUrl}
          />
        )}
        <div>
          <Title>
            {getSandboxName(sandbox)}{' '}
            <PrivacyStatus
              style={{ marginLeft: '0.25rem' }}
              asIcon
              privacy={sandbox.privacy}
            />
          </Title>
          <Tooltip
            boundary="viewport"
            interactive
            content={
              <>
                The environment determines how a sandbox is executed, you can
                find more info{' '}
                <a target="_blank" href="/docs/environment">
                  here
                </a>
                .
              </>
            }
          >
            <Environment
              href={environment.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              {environment.name}
            </Environment>
          </Tooltip>
        </div>
      </HeaderInfo>

      {sandbox.description && <Description>{sandbox.description}</Description>}
      <Margin style={{ fontSize: 11 }} top={2}>
        {sandbox.author && (
          <StyledLink to={profileUrl(sandbox.author.username)}>
            <UserWithAvatar
              username={sandbox.author.username}
              subscriptionSince={sandbox.author.subscriptionSince}
              avatarUrl={sandbox.author.avatarUrl}
            />
          </StyledLink>
        )}
        {sandbox.git && (
          <GithubBadge
            branch={sandbox.git.branch}
            repo={sandbox.git.repo}
            url={githubRepoUrl(sandbox.git)}
            username={sandbox.git.username}
            commitSha={sandbox.git.commitSha}
          />
        )}
      </Margin>
      <Margin top={1.5}>
        <Stats sandbox={sandbox} />
      </Margin>

      <Group>
        {(sandbox.forkedFromSandbox || sandbox.forkedTemplateSandbox) && (
          <Item>
            <PropertyName>
              {sandbox.forkedTemplateSandbox ? 'Based On' : 'Forked From'}
            </PropertyName>
            <PropertyValue>
              <StyledLink
                to={sandboxUrl(
                  sandbox.forkedFromSandbox || sandbox.forkedTemplateSandbox
                )}
              >
                {getSandboxName(
                  sandbox.forkedFromSandbox || sandbox.forkedTemplateSandbox
                )}
              </StyledLink>
            </PropertyValue>
          </Item>
        )}
      </Group>
    </Container>
  );
};
