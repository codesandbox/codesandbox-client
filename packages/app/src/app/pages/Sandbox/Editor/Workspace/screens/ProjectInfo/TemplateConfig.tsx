import React, { FunctionComponent, useState, useCallback } from 'react';

import { useOvermind } from 'app/overmind';
import { ListAction, Text, Element } from '@codesandbox/components';
import styled, { css } from 'styled-components';
import getIcon from '@codesandbox/common/lib/templates/icons';
import { ColorIcons as Icons } from '@codesandbox/template-icons';
import { Popover, usePopoverState, PopoverDisclosure } from 'reakit/Popover';

const buttonStyles = css`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const IconButton = styled.button`
  ${buttonStyles}
`;

export const IconWrapper = styled(Popover)`
  ${({ theme }) => css`
    z-index: 12;
    padding: ${theme.space[3]}px;
    background: ${theme.colors.sideBar.background};
  `};
`;

export const IconList = styled.ul`
  list-style: none;
  display: grid;
  padding: ${props => props.theme.space[2]}px;
  margin: 0;
  grid-template-columns: repeat(7, 24px);
  grid-gap: 10px;
  border: 1px solid ${props => props.theme.colors.sideBar.border};

  li {
    cursor: pointer;
  }
`;

const OpenPopover = styled(PopoverDisclosure)`
  ${buttonStyles}
  color: inherit;
  width: 100%;
`;

export const TemplateConfig: FunctionComponent = () => {
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
  const [popupVisible, setPopupVisible] = useState(false);
  const iconPopover = usePopoverState({
    placement: 'top',
    visible: popupVisible,
  });
  const [selectedIcon, setSelectedIcon] = useState(
    customTemplate.iconUrl || ''
  );

  const DefaultIcon = getIcon(template);

  const setIcon = useCallback(
    (key: string) => {
      setSelectedIcon(key);
      setPopupVisible(false);
      editTemplate({ ...customTemplate, iconUrl: key });
    },
    [customTemplate, editTemplate, setSelectedIcon, setPopupVisible]
  );

  const TemplateIcon = Icons[selectedIcon];

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
              {Object.keys(Icons).map((i: string) => {
                const TemplateIconMap = Icons[i];
                return (
                  // eslint-disable-next-line
                  <li
                    key={i}
                    onClick={() => setIcon(i)}
                    role="button"
                    tabIndex={0}
                  >
                    <IconButton>
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
