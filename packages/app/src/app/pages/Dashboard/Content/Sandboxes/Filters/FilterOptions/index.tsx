import React from 'react';
import { inject, observer } from 'mobx-react';
import { orderBy } from 'lodash-es';
import OverlayComponent from 'app/components/Overlay';

import { Container, TemplatesName, OverlayContainer } from './elements';

import Option from './Option';
import { ITemplate } from '../../types';

interface Props {
  possibleTemplates: ITemplate[];
  hideFilters?: boolean;
  store?: any;
  signals?: any;
}

const FilterOptions = ({
  possibleTemplates,
  hideFilters,
  store,
  signals,
}: Props) => {
  const toggleTemplate = (name, select) =>
    select
      ? signals.dashboard.blacklistedTemplateRemoved({
          template: name,
        })
      : signals.dashboard.blacklistedTemplateAdded({
          template: name,
        });

  const allSelected = possibleTemplates.every(
    store.dashboard.isTemplateSelected
  );

  const Overlay = () => (
    <OverlayContainer>
      {possibleTemplates.length > 0 ? (
        <React.Fragment>
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
                  templates: possibleTemplates || [],
                });
              }
            }}
            selected={allSelected}
            color="#374140"
            id="all"
            style={{ marginTop: '1rem' }}
            niceName="Select All"
          />
        </React.Fragment>
      ) : (
        'No templates found'
      )}
    </OverlayContainer>
  );

  const { blacklistedTemplates } = store.dashboard.filters;
  const templateCount = possibleTemplates.length - blacklistedTemplates.length;
  const templateMessage =
    templateCount === possibleTemplates.length && templateCount > 0
      ? 'all templates'
      : `${Math.max(0, templateCount)} ${
          templateCount === 1 ? 'template' : 'templates'
        }`;

  return (
    <OverlayComponent event="Dashboard - Order By" Overlay={Overlay}>
      {open => (
        <Container hideFilters={hideFilters}>
          Showing{' '}
          <TemplatesName onClick={open}>{templateMessage}</TemplatesName>
        </Container>
      )}
    </OverlayComponent>
  );
};

export default inject('store', 'signals')(observer(FilterOptions));
