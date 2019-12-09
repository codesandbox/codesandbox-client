import React from 'react';
import { orderBy } from 'lodash-es';
import { useOvermind } from 'app/overmind';
import { Overlay as OverlayComponent } from 'app/components/Overlay';
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

  const toggleTemplate = (name: string, select: boolean) =>
    select
      ? blacklistedTemplateRemoved({
          template: name,
        })
      : blacklistedTemplateAdded({
          template: name,
        });

  const allSelected = possibleTemplates.every(t => isTemplateSelected(t.id));

  const Overlay = () => (
    <OverlayContainer>
      {possibleTemplates.length > 0 ? (
        <>
          {orderBy(possibleTemplates, 'niceName').map(template => {
            const selected = isTemplateSelected(template.id);

            return (
              <Option
                toggleTemplate={toggleTemplate}
                selected={selected}
                key={template.name}
                color={template.color}
                id={template.id}
                niceName={template.niceName || template.name}
              />
            );
          })}

          <Option
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
        'No environments found'
      )}
    </OverlayContainer>
  );

  const { blacklistedTemplates } = filters;
  const templateCount = possibleTemplates.length - blacklistedTemplates.length;
  const templateMessage =
    templateCount === possibleTemplates.length && templateCount > 0
      ? 'all environments'
      : `${Math.max(0, templateCount)} ${
          templateCount === 1 ? 'environment' : 'environments'
        }`;

  return (
    <OverlayComponent event="Dashboard - Order By" content={Overlay}>
      {open => (
        <Container hideFilters={hideFilters}>
          Showing{' '}
          <TemplatesName onClick={open}>{templateMessage}</TemplatesName>
        </Container>
      )}
    </OverlayComponent>
  );
};

export const FilterOptions = FilterOptionsComponent;
