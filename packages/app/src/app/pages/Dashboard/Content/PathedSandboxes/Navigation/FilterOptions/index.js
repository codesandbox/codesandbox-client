import React from 'react';
import { inject, observer } from 'mobx-react';
import * as templates from 'common/templates';
import { orderBy } from 'lodash';

import { Container, TemplatesName, OverlayContainer } from './elements';
import OverlayComponent from '../Overlay';

import Option from './Option';

const FilterOptions = ({ possibleTemplates, store, signals }) => {
  const toggleTemplate = (name, select) =>
    select
      ? signals.dashboard.blacklistedTemplateRemoved({
          template: name,
        })
      : signals.dashboard.blacklistedTemplateAdded({
          template: name,
        });

  const Overlay = style => (
    <OverlayContainer style={style}>
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
            template={template}
          />
        );
      })}
    </OverlayContainer>
  );

  const { blacklistedTemplates } = store.dashboard.filters;
  const templateCount = possibleTemplates.length - blacklistedTemplates.length;
  const templateMessage =
    templateCount === possibleTemplates.length
      ? 'all templates'
      : `${templateCount} ${templateCount === 1 ? 'template' : 'templates'}`;

  return (
    <OverlayComponent Overlay={Overlay}>
      {open => (
        <Container>
          Showing{' '}
          <TemplatesName onClick={open}>{templateMessage}</TemplatesName>
        </Container>
      )}
    </OverlayComponent>
  );
};

export default inject('store', 'signals')(observer(FilterOptions));
