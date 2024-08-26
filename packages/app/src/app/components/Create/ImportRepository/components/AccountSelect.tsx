import React from 'react';
import styled from 'styled-components';
import VisuallyHidden from '@reach/visually-hidden';
import {
  useMenuState,
  Menu,
  MenuItem,
  MenuDisclosure,
  MenuSeparator,
} from 'reakit/Menu';

import { Stack, Text, Icon, Element } from '@codesandbox/components';

// In the new codebase this should be a Radix dropdown menu
// https://www.radix-ui.com/docs/primitives/components/dropdown-menu
// also, more composable if it were a design system component
export const AccountSelect = ({
  options,
  value,
  onChange,
  variant = 'ghost',
}) => {
  const menu = useMenuState();

  return (
    <>
      <StyledMenuButton
        {...menu}
        style={{ background: variant === 'ghost' ? 'transparent' : '#252525' }}
      >
        <Stack gap={2} align="center">
          <Icon name="github" />
          <Stack gap={2} align="center">
            <VisuallyHidden>Select GitHub account.</VisuallyHidden>
            <Text>
              {value} <VisuallyHidden>is currently selected</VisuallyHidden>
            </Text>
            <Icon className="chevron" name="chevronDown" size={8} />
          </Stack>
        </Stack>
      </StyledMenuButton>
      <StyledMenu {...menu} aria-label="GitHub account selection">
        <Stack direction="vertical">
          <Element paddingY={2} paddingX={4}>
            <Text>GitHub accounts</Text>
          </Element>
          {options.map(option => (
            <StyledMenuItem
              key={option.login}
              {...menu}
              onClick={() => {
                onChange(option.login);
                menu.hide();
              }}
            >
              <Stack justify="space-between">
                <Stack gap={2} align="center" css={{ overflow: 'hidden' }}>
                  <Icon name="github" />
                  <Text truncate>{option.login}</Text>
                </Stack>
                {option.login === value ? <Icon name="simpleCheck" /> : null}
              </Stack>
            </StyledMenuItem>
          ))}
          <Element paddingY={2}>
            <StyledMenuSeparator {...menu} />
          </Element>
          <StyledMenuItem
            {...menu}
            as="a"
            href="/auth/github/oauth-settings"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              menu.hide();
            }}
          >
            <Stack direction="vertical" gap={1}>
              <Text>Review GitHub permissions</Text>
              <Text variant="muted">
                Only authorized organizations are visible. Some permission
                changes require admin approval.
              </Text>
            </Stack>
          </StyledMenuItem>
        </Stack>
      </StyledMenu>
    </>
  );
};

const StyledMenuButton = styled(MenuDisclosure)`
  all: unset;
  color: #e5e5e5;
  cursor: pointer;
  box-sizing: border-box;
  background: #252525;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 13px;
  .chevron {
    translate: 0 1px;
    transition: all 0.125s ease-out;
  }

  &:hover {
    background: #e5e5e51a;
    .chevron {
      translate: 0 3px;
    }
  }

  &:focus-visible {
    outline: #ac9cff solid 2px;
  }
`;

const StyledMenu = styled(Menu)`
  z-index: 1;
  background-color: #333333;
  font-size: 13px;
  padding: 8px 0;
  max-width: 220px;

  &:focus {
    outline: none;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  all: unset;
  box-sizing: border-box;
  padding: 8px 16px;
  min-width: 220px;
  cursor: pointer;

  color: #ffffff;

  &:hover,
  &:focus {
    background-color: #ffffff0f;
  }
`;

const StyledMenuSeparator = styled(MenuSeparator)`
  all: unset;
  display: block;
  width: 100%;
  height: 1px;
  background-color: #525252;
`;
