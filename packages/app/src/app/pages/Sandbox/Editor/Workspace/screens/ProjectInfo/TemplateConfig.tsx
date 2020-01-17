import * as templates from '@codesandbox/common/lib/templates';
import React, { FunctionComponent, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useOvermind } from 'app/overmind';
import {
  Collapsible,
  List,
  ListAction,
  Text,
  Element,
} from '@codesandbox/components';
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

const PickColor = styled(PopoverDisclosure)`
  ${({ theme, color }) => css`
    width: ${theme.space[5]}px;
    height: ${theme.space[4]}px;
    border: 1px solid inherit;
    background: ${color};
    border-radius: ${theme.radii.small}px;
  `}
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
  const colorPopover = usePopoverState({
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
  const [selectedColor, setSelectedColor] = useState(
    () => customTemplate.color || templates.default(template).color()
  );
  const colors = Object.keys(templates)
    .filter(x => x !== 'default')
    .map(t => templates[t])
    .map(a => ({ color: a.color(), title: a.niceName }));

  return (
    <Collapsible title="Template" defaultOpen>
      <List>
        <ListAction justify="space-between" gap={2}>
          <Text>Color</Text>
          <Element>
            <PickColor {...colorPopover} color={selectedColor} />
            <Popover
              aria-label="Choose a Color"
              hideOnClickOutside
              hideOnEsc
              {...colorPopover}
            >
              <SketchPicker
                color={selectedColor}
                disableAlpha
                onChangeComplete={({ hex }) => {
                  colorPopover.hide();
                  setSelectedColor(hex);
                }}
                presetColors={[...new Set(colors)]}
              />
            </Popover>
          </Element>
        </ListAction>
        <ListAction justify="space-between" gap={2}>
          <Text>Icon</Text>
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
      </List>
    </Collapsible>
  );
};
