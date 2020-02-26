import css from '@styled-system/css';
import React, { ComponentType, FunctionComponent } from 'react';
import styled from 'styled-components';

import { Element, Stack, Text } from '../..';

const Header = styled(Stack)(
  css({
    height: 6,
    paddingX: 4,
    border: '1px solid',
    borderColor: 'sideBar.border',
    borderBottom: 0,
    borderTopLeftRadius: 'small',
    borderTopRightRadius: 'small',
    fontSize: 3,
  })
);

const Content = styled(Element)(
  css({
    paddingY: 4,
    border: '1px solid',
    borderColor: 'sideBar.border',
    borderBottomLeftRadius: 'small',
    borderBottomRightRadius: 'small',
    fontSize: 2,
  })
);

type Props = {
  Icon: ComponentType;
  title: string;
};
export const Integration: FunctionComponent<Props> = ({
  children,
  Icon,
  title,
}) => (
  <div>
    <Header align="center" gap={1}>
      <Icon />

      <Text weight="medium">{title}</Text>
    </Header>

    <Content>{children}</Content>
  </div>
);
