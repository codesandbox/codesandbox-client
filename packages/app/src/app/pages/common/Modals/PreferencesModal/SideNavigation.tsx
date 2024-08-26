import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React, { ComponentType, FunctionComponent } from 'react';

import { useActions } from 'app/overmind';

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

  return (
    <Element css={css({ width: 200 })} paddingBottom={8}>
      <Text
        block
        paddingBottom={6}
        paddingLeft={5}
        paddingTop={6}
        size={4}
        weight="regular"
      >
        User settings
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
              paddingY: 2,
              cursor: 'pointer',
              border: '1px solid transparent',
              color: selectedTab === id ? '#fff' : '#adadad',
              '&:hover': {
                backgroundColor: 'list.hoverBackground',
              },
              '&:focus-visible': {
                borderColor: 'focusBorder',
              },
            })}
            key={title}
            onClick={() => itemIdChanged(id)}
            gap={2}
          >
            <Icon />
            <Text>{title}</Text>
          </Stack>
        ))}
      </Element>
    </Element>
  );
};
