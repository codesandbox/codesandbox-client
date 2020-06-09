import { orderBy } from 'lodash-es';
import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { Text, Menu, Checkbox } from '@codesandbox/components';

type Template = {
  id: string;
  name: string;
  color: string;
  niceName: string;
};
type Props = {
  possibleTemplates?: Template[];
};

export const FilterOptions: FunctionComponent<Props> = ({
  possibleTemplates = [],
}) => {
  const {
    actions: {
      dashboard: {
        blacklistedTemplateAdded,
        blacklistedTemplateRemoved,
        blacklistedTemplatesChanged,
        blacklistedTemplatesCleared,
      },
    },
    state: {
      dashboard: {
        filters: { blacklistedTemplates },
        isTemplateSelected,
      },
    },
  } = useOvermind();

  const toggleTemplate = (name: string, select: boolean) =>
    select ? blacklistedTemplateRemoved(name) : blacklistedTemplateAdded(name);
  const allSelected = possibleTemplates.every(({ id }) =>
    isTemplateSelected(id)
  );

  const templates = possibleTemplates && possibleTemplates.length > 0;

  return (
    <>
      <Menu>
        <Menu.Button>
          <Text
            variant={blacklistedTemplates.length ? 'active' : 'muted'}
            paddingRight={2}
          >
            Filters
          </Text>
        </Menu.Button>
        <Menu.List>
          {templates ? (
            orderBy(possibleTemplates, 'niceName').map(
              ({ id, name, niceName }) => {
                const selected = isTemplateSelected(id);
                return (
                  <Menu.Item
                    field="title"
                    key={id || name}
                    onSelect={() => toggleTemplate(id, !selected)}
                    css={css({
                      label: {
                        color: selected ? 'inherit' : 'mutedForeground',
                      },
                    })}
                  >
                    <Checkbox checked={selected} label={niceName || name} />
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
                  return blacklistedTemplatesChanged(
                    possibleTemplates.map(({ id }) => id)
                  );
                }

                return blacklistedTemplatesCleared();
              }}
              css={css({
                color: allSelected ? 'body' : 'muted',
              })}
            >
              <Checkbox checked={allSelected} label="Select All" />
            </Menu.Item>
          )}
        </Menu.List>
      </Menu>
    </>
  );
};
