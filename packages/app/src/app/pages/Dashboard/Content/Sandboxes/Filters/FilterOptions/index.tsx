import React from 'react';
import { orderBy } from 'lodash-es';
import { inject, observer } from 'app/componentConnectors';
import { Overlay as OverlayComponent } from 'app/components/Overlay';
import { Container, TemplatesName, OverlayContainer } from './elements';
import { Option } from './Option';
import { ITemplate } from '../../types';

interface Props {
  possibleTemplates: ITemplate[];
  hideFilters?: boolean;
  store?: any;
  signals?: any;
}

const FilterOptionsComponent = ({
  possibleTemplates,
  hideFilters,
  store,
  signals,
}: Props) => {
  const toggleTemplate = (name: string, select: boolean) =>
    select
      ? signals.dashboard.blacklistedTemplateRemoved({
          template: name,
        })
      : signals.dashboard.blacklistedTemplateAdded({
          template: name,
        });

  const allSelected = possibleTemplates.every(t =>
    store.dashboard.isTemplateSelected(t.id)
  );

  const Overlay = () => (
    <OverlayContainer>
      {possibleTemplates.length > 0 ? (
        <>
          {orderBy(possibleTemplates, 'niceName').map(template => {
            const selected = store.dashboard.isTemplateSelected(template.id);

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
                signals.dashboard.blacklistedTemplatesCleared();
              } else {
                signals.dashboard.blacklistedTemplatesChanged({
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

  const { blacklistedTemplates } = store.dashboard.filters;
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

export const FilterOptions = inject('store', 'signals')(
  observer(FilterOptionsComponent)
);
