import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Stack, Text, Button, Icon } from '@codesandbox/components';
import css from '@styled-system/css';
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
  nestedPageType?: BreadcrumbProps['nestedPageType'];
  albumId?: string;
  activeTeam: string;
  CustomFilters?: React.ReactElement;
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
  CustomFilters,
  actions = [],
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
      })}
    >
      {title ? (
        <Text marginBottom={1} marginTop={-2} block weight="regular" size={6} >
          {title}
        </Text>
      ) : (
        <Breadcrumbs
          nestedPageType={nestedPageType}
          activeTeam={activeTeam}
          path={path}
          albumId={albumId}
        />
      )}
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
              <Icon
                name="plus"
                size={20}
                title="New"
                css={css({ paddingRight: 2 })}
              />
              Import Repo
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
