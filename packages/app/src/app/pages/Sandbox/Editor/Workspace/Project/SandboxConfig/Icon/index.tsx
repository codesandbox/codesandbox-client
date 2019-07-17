import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { usePopoverState } from 'reakit/Popover';
import * as templates from '@codesandbox/common/lib/templates';
import { useStore, useSignals } from 'app/store';
import * as Icons from '@codesandbox/template-icons';
import getIcon from '@codesandbox/common/lib/templates/icons';

import { Item, PropertyName } from '../../elements';
import {
  Button,
  IconWrapper,
  List,
  Value,
  IconButton,
  Arrow,
} from './elements';

export const Icon = observer(() => {
  const popover = usePopoverState();

  const {
    workspace: { editTemplate },
  } = useSignals();
  const {
    editor: {
      currentSandbox: { template, customTemplate },
    },
  } = useStore();
  const [selectedIcon, setSelectedIcon] = useState(customTemplate.iconUrl);

  const DefaultIcon = getIcon(template);
  const defaultColor =
    (customTemplate && customTemplate.color) ||
    templates.default(template).color();

  const setIcon = (key: string) => {
    setSelectedIcon(key);
    popover.hide();
    editTemplate({
      template: {
        ...customTemplate,
        iconUrl: key,
      },
    });
  };
  const TemplateIcon = Icons[selectedIcon];

  return (
    <Item>
      <PropertyName>Icon </PropertyName>
      <Value>
        <Button {...popover} color={defaultColor}>
          {selectedIcon && TemplateIcon ? (
            <TemplateIcon width={24} />
          ) : (
            <DefaultIcon width={24} />
          )}
        </Button>
        <IconWrapper
          hideOnEsc
          hideOnClickOutside
          {...popover}
          aria-label="Choose an Icon"
        >
          <Arrow {...popover} />
          <List>
            {Object.keys(Icons).map((i: string) => {
              const TemplateIconMap = Icons[i];
              return (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                <li role="button" tabIndex={0} onClick={() => setIcon(i)}>
                  <IconButton>
                    <TemplateIconMap width={24} />
                  </IconButton>
                </li>
              );
            })}
          </List>
        </IconWrapper>
      </Value>
    </Item>
  );
});
