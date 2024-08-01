import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Text, Button, Icon } from '@codesandbox/components';
import { Breadcrumbs, BreadcrumbProps } from '../Breadcrumbs';
import { ViewOptions } from '../Filters/ViewOptions';
import { SortOptions } from '../Filters/SortOptions';
import { GRID_MAX_WIDTH, GUTTER } from '../VariableGrid/constants';

type Props = {
  path?: string;
  title?: string;
  createNewFolder?: () => void;
  showViewOptions?: boolean;
  showSortOptions?: boolean;
  nestedPageType?: BreadcrumbProps['nestedPageType'];
  albumId?: string;
  activeTeam: string;
  selectedRepo?: { owner: string; name: string; assignedTeamId?: string };
  readOnly?: boolean;
};

export const Header = ({
  createNewFolder,
  nestedPageType,
  albumId,
  path,
  title,
  activeTeam,
  showViewOptions = false,
  showSortOptions = false,
  selectedRepo,
  readOnly = false,
}: Props) => {
  const location = useLocation();
  const { modalOpened, dashboard: dashboardActions } = useActions();
  const { dashboard } = useAppState();

  const repositoriesListPage =
    location.pathname.includes('/repositories') &&
    !location.pathname.includes('/repositories/github');
  const repositoryBranchesPage = location.pathname.includes(
    '/repositories/github'
  );

  return (
    <Stack
      align="center"
      justify="space-between"
      css={{
        width: `calc(100% - ${2 * GUTTER}px)`,
        paddingRight: GUTTER / 2,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        margin: '0 auto', // Negative margin top to align visually w/ the sidebar
      }}
      paddingBottom={4}
    >
      <Stack align="center" gap={2}>
        {title ? (
          <Text size={6}>{title}</Text>
        ) : (
          <Breadcrumbs
            nestedPageType={nestedPageType}
            activeTeam={activeTeam}
            path={path}
            albumId={albumId}
          />
        )}
      </Stack>
      <Stack gap={1} align="center">
        {location.pathname.includes('/sandboxes') && (
          <Button onClick={createNewFolder} variant="ghost" autoWidth>
            <Icon
              name="folder"
              size={16}
              title="New"
              css={{ marginRight: '8px' }}
            />
            New folder
          </Button>
        )}
        {repositoriesListPage && dashboard.viewMode === 'list' && (
          <Button
            onClick={() => !readOnly && modalOpened({ modal: 'import' })}
            variant="ghost"
            disabled={readOnly}
            autoWidth
          >
            <Icon
              name="plus"
              size={16}
              title="Import repo"
              css={{ marginRight: '8px' }}
            />
            Import repo
          </Button>
        )}

        {repositoryBranchesPage && selectedRepo && (
          <Button
            onClick={() => {
              dashboardActions.createDraftBranch({
                owner: selectedRepo.owner,
                name: selectedRepo.name,
                teamId: selectedRepo.assignedTeamId,
              });
            }}
            variant="ghost"
            disabled={readOnly}
            autoWidth
          >
            <Icon
              name="branch"
              size={16}
              title="Create branch"
              css={{ marginRight: '8px' }}
            />
            Create branch
          </Button>
        )}

        <Stack gap={1}>
          {showSortOptions && <SortOptions />}
          {showViewOptions && <ViewOptions />}
        </Stack>
      </Stack>
    </Stack>
  );
};
