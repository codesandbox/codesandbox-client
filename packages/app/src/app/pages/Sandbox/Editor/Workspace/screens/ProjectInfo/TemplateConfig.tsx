import * as templates from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useState } from 'react';

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

export const Button = styled(PopoverDisclosure)<{ color: string }>`
  ${({ color }) => css`
    color: ${color};
    ${buttonStyles}
  `};
`;

export const IconButton = styled.button`
  ${buttonStyles}
`;

export const IconWrapper = styled(Popover)`
  ${({ theme }) => css`
    padding: ${theme.space[3]}px;
    background: ${theme.colors.sideBar.background};
  `};
`;

export const IconList = styled.ul`
  list-style: none;
  display: grid;
  padding: 0;
  margin: 0;
  grid-template-columns: repeat(7, 24px);
  grid-gap: 10px;

  li {
    cursor: pointer;
  }
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
  const iconPopover = usePopoverState({
    placement: 'top',
  });
  const [selectedIcon, setSelectedIcon] = useState(
    customTemplate.iconUrl || ''
  );

  const DefaultIcon = getIcon(template);
  const defaultColor =
    customTemplate.color || templates.default(template).color();

  const setIcon = (key: string) => {
    setSelectedIcon(key);
    iconPopover.hide();
    editTemplate({ ...customTemplate, iconUrl: key });
  };
  const TemplateIcon = Icons[selectedIcon];

  return (
    <ListAction justify="space-between" gap={2}>
      <Text>Template Icon</Text>
      <Element>
        <Button {...iconPopover} color={defaultColor}>
          {selectedIcon && TemplateIcon ? (
            <TemplateIcon width={24} />
          ) : (
            <DefaultIcon width={24} />
          )}
        </Button>
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
                <li onClick={() => setIcon(i)} role="button" tabIndex={0}>
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
  );
};
