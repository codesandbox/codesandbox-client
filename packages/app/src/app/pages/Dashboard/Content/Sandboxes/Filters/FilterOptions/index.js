import React from 'react';
import { inject, observer } from 'mobx-react';
import * as templates from 'common/templates';
import { orderBy } from 'lodash-es';
import OverlayComponent from 'app/components/Overlay';

import { Container, TemplatesName, OverlayContainer } from './elements';

import Option from './Option';

const FilterOptions = ({ possibleTemplates, hideFilters, store, signals }) => {
  const toggleTemplate = (name, select) =>
    select
      ? signals.dashboard.blacklistedTemplateRemoved({
          template: name,
        })
      : signals.dashboard.blacklistedTemplateAdded({
          template: name,
        });

  const allSelected = possibleTemplates.every(
    template =>
      store.dashboard.filters.blacklistedTemplates.indexOf(template) > -1
  );

  const Overlay = () => (
    <OverlayContainer>
      {orderBy(
        Object.keys(templates)
          .filter(x => x !== 'default')
          .map(name => templates[name])
          .filter(
            x =>
              possibleTemplates.length === 0 ||
              possibleTemplates.indexOf(x.name) > -1
          ),
        'niceName'
      ).map(template => {
        const selected = store.dashboard.isTemplateSelected(template.name);

        return (
          <Option
            toggleTemplate={toggleTemplate}
            selected={selected}
            key={template.name}
            color={template.color}
            name={template.name}
            niceName={template.niceName}
          />
        );
      })}

      <Option
        toggleTemplate={() => {
          if (allSelected) {
            signals.dashboard.blacklistedTemplatesCleared();
          } else {
            signals.dashboard.blacklistedTemplatesChanged({
              templates: possibleTemplates || [],
            });
          }
        }}
        selected={!allSelected}
        color="#374140"
        name="all"
        style={{ marginTop: '1rem' }}
        niceName="Select All"
      />
    </OverlayContainer>
  );

  const { blacklistedTemplates } = store.dashboard.filters;
  const templateCount = possibleTemplates.length - blacklistedTemplates.length;
  const templateMessage =
    templateCount === possibleTemplates.length
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
