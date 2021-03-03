import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Text, Button } from '@codesandbox/components';
import css from '@styled-system/css';
import { Breadcrumbs } from '../Breadcrumbs';
import { FilterOptions } from '../Filters/FilterOptions';
import { ViewOptions } from '../Filters/ViewOptions';
import { SortOptions } from '../Filters/SortOptions';
import { GRID_MAX_WIDTH, GUTTER } from '../VariableGrid';
import { TemplateFilter } from '../../Content/utils';

type Props = {
  templates?: TemplateFilter[];
  path?: string;
  title?: string;
  createNewFolder?: () => void;
  showFilters?: boolean;
  showViewOptions?: boolean;
  showSortOptions?: boolean;
  repos?: boolean;
  activeTeam: string;
};

export const Header = ({
  createNewFolder,
  templates,
  repos,
  path,
  title,
  activeTeam,
  showFilters = false,
  showViewOptions = false,
  showSortOptions = false,
}: Props) => {
  const location = useLocation();
  const { modals } = useActions();
  const { dashboard } = useAppState();

  return (
    <Stack
      align="center"
      justify="space-between"
      paddingBottom={2}
      css={css({
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        marginX: 'auto',
        borderStyle: 'solid',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: 'grays.500',
      })}
    >
      {title ? (
        <Text marginBottom={1} block weight="bold" size={5}>
          {title}
        </Text>
      ) : (
        <Breadcrumbs repos={repos} activeTeam={activeTeam} path={path} />
      )}
      <Stack gap={4} align="center">
        {location.pathname.includes('/all') && (
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
            + New Folder
          </Button>
        )}
        {location.pathname.includes('/repositories') &&
          dashboard.viewMode === 'list' && (
            <Button
              onClick={() => modals.newSandboxModal.open({})}
              variant="link"
              css={css({
                fontSize: 2,
                color: 'mutedForeground',
                padding: 0,
                width: 'auto',
              })}
            >
              + Import Repo
            </Button>
          )}

        <Stack gap={4}>
          {showFilters && <FilterOptions possibleTemplates={templates} />}
          {showSortOptions && <SortOptions />}
          {showViewOptions && <ViewOptions />}
        </Stack>
      </Stack>
    </Stack>
  );
};
