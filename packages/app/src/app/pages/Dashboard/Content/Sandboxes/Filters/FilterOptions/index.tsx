import React from 'react';
import { orderBy } from 'lodash-es';
import { useOvermind } from 'app/overmind';
import { useMenuState, Menu, MenuItem, MenuDisclosure } from 'reakit/Menu';

import { Container, TemplatesName, OverlayContainer } from './elements';
import { Option } from './Option';
import { ITemplate } from '../../types';

interface IFilterOptionsProps {
  possibleTemplates: ITemplate[];
  hideFilters?: boolean;
}

const FilterOptionsComponent: React.FC<IFilterOptionsProps> = ({
  possibleTemplates,
  hideFilters,
}: IFilterOptionsProps) => {
  const {
    state: {
      dashboard: { isTemplateSelected, filters },
    },
    actions: {
      dashboard: {
        blacklistedTemplateAdded,
        blacklistedTemplateRemoved,
        blacklistedTemplatesCleared,
        blacklistedTemplatesChanged,
      },
    },
  } = useOvermind();

  const menu = useMenuState({
    placement: 'bottom-end',
  });

  const toggleTemplate = (name: string, select: boolean) =>
    select
      ? blacklistedTemplateRemoved({
          template: name,
        })
      : blacklistedTemplateAdded({
          template: name,
        });

  const allSelected = possibleTemplates.every(t => isTemplateSelected(t.id));

  const { blacklistedTemplates } = filters;

  const templateCount = possibleTemplates.length - blacklistedTemplates.length;
  const templateMessage =
    templateCount === possibleTemplates.length && templateCount > 0
      ? 'all environments'
      : `${Math.max(0, templateCount)} ${
          templateCount === 1 ? 'environment' : 'environments'
        }`;

  return (
    <>
      <MenuDisclosure {...menu}>
        {disclosureProps => (
          <Container hideFilters={hideFilters}>
            <span aria-hidden>Showing </span>
            <TemplatesName
              {...disclosureProps}
              aria-label={`select showing sandboxes, current ${templateMessage}`}
            >
              {templateMessage}
            </TemplatesName>
          </Container>
        )}
      </MenuDisclosure>
      <Menu
        unstable_portal
        {...menu}
        aria-label="Dashboard - Order By"
        style={{ outline: 0 }}
      >
        <OverlayContainer as="ul">
          {possibleTemplates.length > 0 ? (
            <>
              {orderBy(possibleTemplates, 'niceName').map(template => {
                const selected = isTemplateSelected(template.id);

                return (
                  <MenuItem
                    as={Option}
                    {...menu}
                    toggleTemplate={toggleTemplate}
                    selected={selected}
                    key={template.name}
                    color={template.color}
                    id={template.id}
                    niceName={template.niceName || template.name}
                  />
                );
              })}

              <MenuItem
                as={Option}
                {...menu}
                toggleTemplate={() => {
                  if (!allSelected) {
                    blacklistedTemplatesCleared();
                  } else {
                    blacklistedTemplatesChanged({
                      templates: possibleTemplates.map(t => t.id) || [],
                    });
                  }
                }}
                selected={allSelected}
                color="#374140"
                id="all"
                style={{ marginTop: '1rem' }}
                niceName="Select All"
              />
            </>
          ) : (
            <MenuItem {...menu} disabled>
              No environments found
            </MenuItem>
          )}
        </OverlayContainer>
      </Menu>
    </>
  );
};

export const FilterOptions = FilterOptionsComponent;
