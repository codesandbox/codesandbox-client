import { Stack, Text } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';
import { CreateRow } from './CreateRow';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';
import { OpenSourceRow } from './OpenSourceRow';

export const EmptyRecent: React.FC<{ showUpgradeBanner: boolean }> = ({
  showUpgradeBanner,
}) => {
  const { activeTeam } = useAppState();
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper
      css={{
        gap: '48px',
        height: 'auto',
        paddingBottom: '64px',
        marginTop: '28px',
      }}
    >
      <Stack direction="vertical" gap={9}>
        {showUpgradeBanner && <UpgradeBanner teamId={activeTeam} />}
        <Text
          as="h1"
          css={{
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '-0.019em',
            color: '#FFFFFF',
            margin: 0,
          }}
        >
          Let&apos;s start building
        </Text>
        <CreateRow />
      </Stack>
      <InstructionsRow />
      <TemplatesRow />
      <DocumentationRow />
      {isPersonalSpace ? <OpenSourceRow /> : null}
    </EmptyPage.StyledWrapper>
  );
};
