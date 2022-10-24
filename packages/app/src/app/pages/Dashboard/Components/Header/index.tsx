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
import { v2DraftBranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { Breadcrumbs, BreadcrumbProps } from '../Breadcrumbs';
import { FilterOptions } from '../Filters/FilterOptions';
import { ViewOptions } from '../Filters/ViewOptions';
import { SortOptions } from '../Filters/SortOptions';
import { GRID_MAX_WIDTH, GUTTER } from '../VariableGrid';
import { TemplateFilter } from '../../Content/utils';

export interface IAction {
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
  selectedRepo?: { owner: string; name: string };
  loading?: boolean;
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
}: Props) => {
  const location = useLocation();
  const { modals, dashboard: dashboardActions } = useActions();
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
      paddingBottom={2}
      css={css({
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        marginX: 'auto',
      })}
    >
      <Stack align="center" marginBottom={1} marginTop={-2} gap={2}>
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
            {showBetaBadge && <Badge icon="cloud">Beta</Badge>}
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
            New Folder
          </Button>
        )}
        {repositoriesListPage && dashboard.viewMode === 'list' && (
          <Button
            onClick={() =>
              modals.newSandboxModal.open({ initialTab: 'import' })
            }
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
              as="a"
              href={v2DraftBranchUrl(selectedRepo.owner, selectedRepo.name)}
              variant="link"
              css={css({
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontSize: 2,
                color: 'mutedForeground',
                width: 'auto',
                transition: `color ease-in`,
                transitionDuration: theme => theme.speeds[2],
                '&:hover': {
                  color: '#e5e5e5',
                },
              })}
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
