import getIcon from '@codesandbox/common/lib/templates/icons';
import { ColorIcons as Icons } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { Element, ListAction, Text } from '@codesandbox/components';
import React, { FunctionComponent, useState } from 'react';
import { usePopoverState } from 'reakit/Popover';

import { useAppState, useActions } from 'app/overmind';

import { IconButton, IconList, IconWrapper, OpenPopover } from './elements';

export const TemplateConfig: FunctionComponent = () => {
  const { editTemplate } = useActions().workspace;
  const {
    currentSandbox: { customTemplate, template },
  } = useAppState().editor;

  const [popupVisible, setPopupVisible] = useState(false);
  const iconPopover = usePopoverState({
    placement: 'top',
    visible: popupVisible,
  });
  const [selectedIcon, setSelectedIcon] = useState(
    customTemplate.iconUrl || ''
  );

  const DefaultIcon = getIcon(template);
  const TemplateIcon = Icons[selectedIcon];

  const setIcon = (key: string) => {
    setSelectedIcon(key);
    setPopupVisible(false);
    editTemplate({ ...customTemplate, iconUrl: key });
  };

  return (
    <OpenPopover {...iconPopover}>
      <ListAction justify="space-between" gap={2}>
        <Text>Template Icon</Text>

        <Element>
          <Element>
            {selectedIcon && TemplateIcon ? (
              <TemplateIcon width={24} />
            ) : (
              <DefaultIcon width={24} />
            )}
          </Element>

          <IconWrapper
            aria-label="Choose an Icon"
            hideOnClickOutside
            hideOnEsc
            {...iconPopover}
          >
            <IconList>
              {Object.keys(Icons).map((name: string) => {
                const TemplateIconMap = Icons[name];

                return (
                  <li key={name}>
                    <IconButton onClick={() => setIcon(name)}>
                      <TemplateIconMap width={24} />
                    </IconButton>
                  </li>
                );
              })}
            </IconList>
          </IconWrapper>
        </Element>
      </ListAction>
    </OpenPopover>
  );
};
