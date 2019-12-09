import * as templates from '@codesandbox/common/lib/templates';
import getIcon from '@codesandbox/common/lib/templates/icons';
import { ColorIcons as Icons } from '@codesandbox/template-icons';
import React, { FunctionComponent, useState } from 'react';
import { usePopoverState } from 'reakit/Popover';

import { useOvermind } from 'app/overmind';

import { Item, PropertyName } from '../../elements';
import {
  Button,
  IconWrapper,
  List,
  Value,
  IconButton,
  Arrow,
} from './elements';

export const Icon: FunctionComponent = () => {
  const {
    actions: {
      workspace: { editTemplate },
    },
    state: {
      editor: {
        currentSandbox: { customTemplate, template },
      },
    },
  } = useOvermind();
  const popover = usePopoverState();
  const [selectedIcon, setSelectedIcon] = useState(
    customTemplate.iconUrl || ''
  );

  const DefaultIcon = getIcon(template);
  const defaultColor =
    customTemplate.color || templates.default(template).color();

  const setIcon = (key: string) => {
    setSelectedIcon(key);

    popover.hide();

    editTemplate({
      ...customTemplate,
      iconUrl: key,
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
};
