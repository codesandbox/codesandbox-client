import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentType, FunctionComponent } from 'react';

import { useActions } from 'app/overmind';

import { useIsEditorPage } from 'app/hooks/useIsEditorPage';

type MenuItem = {
  Icon: ComponentType;
  id: string;
  title: string;
};
type Props = {
  menuItems: MenuItem[];
  selectedTab: string;
};
export const SideNavigation: FunctionComponent<Props> = ({
  menuItems,
  selectedTab,
}) => {
  const { itemIdChanged } = useActions().preferences;
  const isEditorPage = useIsEditorPage();

  return (
    <Element css={css({ width: 244 })} paddingBottom={8}>
      <Text
        block
        paddingBottom={6}
        paddingLeft={5}
        paddingTop={6}
        size={4}
        weight="regular"
        css={css({
          color: 'sideBarSectionHeader.foreground',
        })}
      >
        {isEditorPage ? 'Preferences' : 'Settings'}
      </Text>

      <Element style={{ position: 'relative' }}>
        {menuItems.map(({ Icon, id, title }) => (
          <Stack
            align="center"
            as="button"
            css={css({
              width: '100%',
              appearance: 'none',
              fontFamily: 'inherit',
              textAlign: 'left',
              background: 'transparent',
              transition: 'all ease-in-out',
              transitionDuration: theme => theme.speeds[2],
              outline: 'none',
              fontSize: 3,
              paddingX: 5,
              paddingY: 3,
              cursor: 'pointer',
              lineHeight: 1,
              border: '1px solid transparent',
              color:
                selectedTab === id
                  ? 'list.hoverForeground'
                  : 'sideBarSectionHeader.foreground',
              '&:hover': {
                backgroundColor: 'list.hoverBackground',
                color: 'list.hoverForeground',
              },
              '&:focus-visible': {
                borderColor: 'focusBorder',
              },
            })}
            key={title}
            onClick={() => itemIdChanged(id)}
          >
            <Element marginRight={4}>
              <Icon />
            </Element>

            {title}
          </Stack>
        ))}
      </Element>
    </Element>
  );
};
