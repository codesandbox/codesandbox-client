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

import {
  Container,
  Title,
  Description,
  HeaderInfo,
  TemplateIconContainer,
  Environment,
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
          <Environment>{environment.niceName}</Environment>
        </div>
      </HeaderInfo>

      {sandbox.description && <Description>{sandbox.description}</Description>}
      <Margin top={1.5}>
        {sandbox.author && (
          <UserWithAvatar
            username={sandbox.author.username}
            subscriptionSince={sandbox.author.subscriptionSince}
            avatarUrl={sandbox.author.avatarUrl}
          />
        )}
      </Margin>
      <Margin top={1}>
        <Stats sandbox={sandbox} />
      </Margin>
    </Container>
  );
};
