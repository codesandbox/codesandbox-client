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
import { useActions } from 'app/overmind';

// In the new codebase this should be a Radix dropdown menu
// https://www.radix-ui.com/docs/primitives/components/dropdown-menu
// also, more composable if it were a design system component
export const AccountSelect = ({ options, value, onChange }) => {
  const { signInGithubClicked } = useActions();
  const menu = useMenuState();

  return (
    <>
      <StyledMenuButton {...menu}>
        <Stack gap={2} align="center">
          <Icon name="github" />
          <Stack gap={2} align="center">
            <VisuallyHidden>Select GitHub account.</VisuallyHidden>
            <Text size={13}>
              {value} <VisuallyHidden>is currently selected</VisuallyHidden>
            </Text>
            <Icon name="chevronDown" size={8} />
          </Stack>
        </Stack>
      </StyledMenuButton>
      <StyledMenu {...menu} aria-label="GitHub account selection">
        <Stack direction="vertical">
          <Element paddingY={2} paddingX={4}>
            <Text variant="muted">GitHub accounts</Text>
          </Element>
          {options.map(option => (
            <StyledMenuItem
              key={option.login}
              {...menu}
              onClick={() => {
                onChange(option.login);
                menu.hide();
              }}
              $isSelected={option.login === value}
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
          <Element paddingY={1}>
            <StyledMenuSeparator {...menu} />
          </Element>
          <StyledMenuItem
            {...menu}
            onClick={() => {
              signInGithubClicked('private_repos');
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
  font-family: 'Inter';
  color: #c5c5c5;

  &:focus,
  &:hover {
    color: #ffffff;
  }

  &:focus-visible {
    outline: #ac9cff solid 2px;
    // outline-offset: -2px;
  }
`;

const StyledMenu = styled(Menu)`
  z-index: 1;
  background-color: #373737;
  font-size: 12px;
  padding: 8px 0;
  max-width: 220px;

  &:focus {
    outline: none;
  }
`;

const StyledMenuItem = styled(MenuItem)<{ $isSelected?: boolean }>`
  all: unset;
  box-sizing: border-box;
  padding: 8px 16px;
  min-width: 220px;

  color: ${({ $isSelected }) => ($isSelected ? '#E5E5E5' : '#C5C5C5')};

  &:hover,
  &:focus {
    background-color: #252525;
  }
`;

const StyledMenuSeparator = styled(MenuSeparator)`
  all: unset;
  display: block;
  width: 100%;
  height: 1px;
  background-color: #999999;
`;
