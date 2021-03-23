import React, { FunctionComponent } from 'react';

// Used because react complains when we have a checked with no onChange
// We want that since we trigger the onChange on the menuItem so you as a user
// can click anywhere
import { orderBy, noop } from 'lodash-es';
import css from '@styled-system/css';
import { useActions, useAppState } from 'app/overmind';
import { Text, Menu, Checkbox } from '@codesandbox/components';
import { TemplateFilter } from 'app/pages/Dashboard/Content/utils';

type Props = {
  possibleTemplates?: TemplateFilter[];
  CustomFilters?: React.ReactElement;
};

export const FilterOptions: FunctionComponent<Props> = React.memo(
  ({ possibleTemplates = [], CustomFilters }) => {
    const {
      dashboard: {
        filters: { blacklistedTemplates },
        isTemplateSelected,
      },
    } = useAppState();
    const {
      dashboard: {
        blacklistedTemplateAdded,
        blacklistedTemplateRemoved,
        blacklistedTemplatesChanged,
        blacklistedTemplatesCleared,
      },
    } = useActions();

    const templates = possibleTemplates && possibleTemplates.length > 0;
    const allSelected = possibleTemplates.every(({ id }) =>
      isTemplateSelected(id)
    );

    const toggleTemplate = (name: string, select: boolean) =>
      select
        ? blacklistedTemplateRemoved(name)
        : blacklistedTemplateAdded(name);

    return (
      <Menu>
        <Menu.Button>
          <Text
            variant={blacklistedTemplates.length ? 'active' : 'muted'}
            paddingRight={2}
          >
            Filters
          </Text>
        </Menu.Button>

        {CustomFilters ? (
          <Menu.List>{CustomFilters}</Menu.List>
        ) : (
          <Menu.List>
            {templates ? (
              orderBy(possibleTemplates, 'niceName').map(
                ({ id, name, niceName }) => {
                  const selected = isTemplateSelected(id);
                  return (
                    <Menu.Item
                      field="title"
                      key={id || name}
                      onSelect={() => {
                        toggleTemplate(id, !selected);
                        return { CLOSE_MENU: false };
                      }}
                      css={css({
                        label: {
                          color: selected ? 'inherit' : 'mutedForeground',
                        },
                      })}
                    >
                      <Checkbox
                        onChange={noop}
                        checked={selected}
                        label={niceName || name}
                      />
                    </Menu.Item>
                  );
                }
              )
            ) : (
              <Menu.Item>No environments found</Menu.Item>
            )}
            {templates && (
              <Menu.Item
                key="all"
                onSelect={() => {
                  if (allSelected) {
                    blacklistedTemplatesChanged(
                      possibleTemplates.map(({ id }) => id)
                    );
                  } else {
                    blacklistedTemplatesCleared();
                  }

                  return { CLOSE_MENU: false };
                }}
                css={css({
                  color: allSelected ? 'body' : 'muted',
                })}
              >
                <Checkbox
                  onChange={noop}
                  checked={allSelected}
                  label="Select All"
                />
              </Menu.Item>
            )}
          </Menu.List>
        )}
      </Menu>
    );
  }
);
