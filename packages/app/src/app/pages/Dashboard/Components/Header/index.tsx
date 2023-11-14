import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import {
  Badge,
  Stack,
  Text,
  Button,
  Icon,
  SkeletonText,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { Breadcrumbs, BreadcrumbProps } from '../Breadcrumbs';
import { FilterOptions } from '../Filters/FilterOptions';
import { ViewOptions } from '../Filters/ViewOptions';
import { SortOptions } from '../Filters/SortOptions';
import { GRID_MAX_WIDTH, GUTTER } from '../VariableGrid/constants';
import { TemplateFilter } from '../../Content/utils';

interface IAction {
  title: string;
  action: () => void;
}

type Props = {
  templates?: TemplateFilter[];
  actions?: IAction[];
  path?: string;
  title?: string;
  createNewFolder?: () => void;
  showFilters?: boolean;
  showViewOptions?: boolean;
  showSortOptions?: boolean;
  showBetaBadge?: boolean;
  nestedPageType?: BreadcrumbProps['nestedPageType'];
  albumId?: string;
  activeTeam: string;
  CustomFilters?: React.ReactElement;
  selectedRepo?: { owner: string; name: string; assignedTeamId?: string };
  loading?: boolean;
  readOnly?: boolean;
};

export const Header = ({
  createNewFolder,
  templates,
  nestedPageType,
  albumId,
  path,
  title,
  activeTeam,
  showFilters = false,
  showViewOptions = false,
  showSortOptions = false,
  showBetaBadge = false,
  CustomFilters,
  actions = [],
  selectedRepo,
  loading = false,
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

  const [experimentalMode] = useState(() => {
    return window.localStorage.getItem('CSB_DEBUG') === 'ENABLED';
  });

  const selectedRepoIsStarred =
    selectedRepo &&
    dashboard.starredRepos.some(
      repo =>
        repo.owner === selectedRepo.owner && repo.name === selectedRepo.name
    );

  return (
    <Stack
      align="center"
      justify="space-between"
      css={{
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        margin: '0 auto', // Negative margin top to align visually w/ the sidebar
      }}
      paddingBottom={7}
    >
      <Stack align="center" gap={2}>
        {loading ? (
          <SkeletonText css={css({ height: 6 })} />
        ) : (
          <>
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
            {showBetaBadge && <Badge icon="cloud">Cloud</Badge>}
          </>
        )}
      </Stack>
      <Stack gap={4} align="center">
        {location.pathname.includes('/sandboxes') && (
          <Button
            onClick={createNewFolder}
            variant="link"
            css={css({
              fontSize: 2,
              color: 'mutedForeground',
              padding: 0,
              width: 'auto',
            })}
          >
            <Icon
              name="plus"
              size={20}
              title="New"
              css={css({ paddingRight: 2 })}
            />
            New folder
          </Button>
        )}
        {repositoriesListPage && dashboard.viewMode === 'list' && (
          <Button
            onClick={() =>
              !readOnly && modalOpened({ modal: 'importRepository' })
            }
            variant="link"
            css={css({
              fontSize: 2,
              color: 'mutedForeground',
              padding: 0,
              width: 'auto',
            })}
            disabled={readOnly}
          >
            <Icon
              name="plus"
              size={20}
              title="Import repo"
              css={css({ paddingRight: 2 })}
            />
            Import repo
          </Button>
        )}

        {repositoryBranchesPage && selectedRepo && experimentalMode && (
          <Button
            css={css({
              fontSize: 2,
              color: 'mutedForeground',
              padding: 0,
              width: 'auto',
            })}
            onClick={() => {
              if (selectedRepoIsStarred) {
                dashboardActions.unstarRepo(selectedRepo);
              } else {
                dashboardActions.starRepo(selectedRepo);
              }
            }}
            variant="link"
          >
            <Icon
              name="star"
              size={20}
              title="Star repo"
              css={css({ paddingRight: 2 })}
            />
            {selectedRepoIsStarred ? 'Unstar' : 'Star'}
          </Button>
        )}

        {repositoryBranchesPage &&
          dashboard.viewMode === 'list' &&
          selectedRepo && (
            <Button
              onClick={() => {
                dashboardActions.createDraftBranch({
                  owner: selectedRepo.owner,
                  name: selectedRepo.name,
                  teamId: selectedRepo.assignedTeamId,
                });
              }}
              variant="ghost"
              css={css({
                fontSize: 2,
                color: 'mutedForeground',
                width: 'auto',
              })}
              disabled={readOnly}
            >
              <Icon
                name="plus"
                size={20}
                title="Create branch"
                css={css({ paddingRight: 2 })}
              />
              Create branch
            </Button>
          )}

        {actions.map(action => (
          <Button
            key={action.title}
            onClick={action.action}
            variant="link"
            css={css({
              fontSize: 2,
              color: 'mutedForeground',
              padding: 0,
              width: 'auto',
            })}
          >
            {action.title}
          </Button>
        ))}

        <Stack gap={4}>
          {showFilters && (
            <FilterOptions
              possibleTemplates={templates}
              CustomFilters={CustomFilters}
            />
          )}
          {showSortOptions && <SortOptions />}
          {showViewOptions && <ViewOptions />}
        </Stack>
      </Stack>
    </Stack>
  );
};
