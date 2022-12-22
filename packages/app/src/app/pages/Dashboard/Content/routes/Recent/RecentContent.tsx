import { Stack } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid/constants';
import { DashboardBranch, DashboardSandbox } from 'app/pages/Dashboard/types';
import React from 'react';
import styled from 'styled-components';
import { DocumentationRow } from './DocumentationRow';
import { RecentHeader } from './RecentHeader';

const StyledWrapper = styled(Stack)`
  width: calc(100% - ${2 * GUTTER}px);
  max-width: calc(${GRID_MAX_WIDTH}px - 2 * ${GUTTER}px);
  overflow: auto;
  margin: 28px auto 0;
  padding-bottom: 64px;
  flex-direction: column;
  gap: 48px;
`;

type RecentContentProps = {
  recentItems: (DashboardSandbox | DashboardBranch)[];
};
export const RecentContent: React.FC<RecentContentProps> = ({
  recentItems,
}) => {
  const { activeTeam } = useAppState();

  return (
    <StyledWrapper>
      <RecentHeader />

      <Stack direction="vertical">
        <Header title="Recent" activeTeam={activeTeam} showViewOptions />
        {JSON.stringify(recentItems)}
      </Stack>

      <DocumentationRow />
    </StyledWrapper>
  );
};
