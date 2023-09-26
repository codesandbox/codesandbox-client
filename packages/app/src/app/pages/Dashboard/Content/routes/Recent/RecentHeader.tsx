import track from '@codesandbox/common/lib/utils/analytics';
import { Stack, Text, Icon } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export const RecentHeader: React.FC<{ title: string }> = ({ title }) => {
  const actions = useActions();
  const { environment } = useAppState();
  const history = useHistory();

  const showRepositoryImport = !environment.isOnPrem;
  const showProWorkspace = !environment.isOnPrem && isPersonalSpace;

  const {
    isTeamSpace,
    isPersonalSpace,
    isTeamViewer,
  } = useWorkspaceAuthorization();

  return (
    <Stack direction="vertical" gap={9}>
      <UpgradeBanner />
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
        {title}
      </Text>
      <EmptyPage.StyledGrid css={{ gridAutoRows: 'auto' }}>
        <ButtonInverseLarge
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'default',
            });
            actions.openCreateSandboxModal();
          }}
        >
          <Icon name="sandbox" /> New sandbox
        </ButtonInverseLarge>
        {showRepositoryImport && (
          <ButtonInverseLarge
            onClick={() => {
              track('Empty State Card - Open create modal', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
                tab: 'github',
              });
              actions.openCreateSandboxModal({ initialTab: 'import' });
            }}
          >
            <Icon name="github" /> Import repository
          </ButtonInverseLarge>
        )}

        {isTeamSpace && !isTeamViewer ? (
          <ButtonInverseLarge
            onClick={() => {
              track('Empty State Card - Invite members', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              actions.openCreateTeamModal({
                step: 'members',
                hasNextStep: false,
              });
            }}
          >
            <Icon name="addMember" /> Invite team members
          </ButtonInverseLarge>
        ) : null}

        {showProWorkspace ? (
          <ButtonInverseLarge
            onClick={() => {
              track('Empty State Card - Create team', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
              });
              history.push('/pro');
            }}
          >
            <Icon name="team" /> Create pro workspace
          </ButtonInverseLarge>
        ) : null}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};

type ButtonInverseLargeProps = {
  children: React.ReactNode;
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

// TODO: Add the Button component variant below to the design system.
// naming: [component][variant][size]
const ButtonInverseLarge = ({ children, onClick }: ButtonInverseLargeProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

const StyledButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 12px; // In case of icons
  padding: 20px 24px;
  border-radius: 4px;
  background-color: #ffffff;
  color: #0e0e0e;
  font-size: 13px;
  font-weight: 500;
  line-height: 16px;

  &:hover {
    background-color: #ebebeb;
    cursor: pointer;
    transition: background-color 75ms ease;
  }

  &:focus-visible {
    outline: 2px solid #9581ff;
  }
`;
