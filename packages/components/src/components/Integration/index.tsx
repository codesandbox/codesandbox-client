import css from '@styled-system/css';
import React, { ComponentType, FunctionComponent } from 'react';
import styled from 'styled-components';

import { Element } from '../Element';
import { Stack } from '../Stack';
import { Text } from '../Text';

const Header = styled(Stack)(
  css({
    height: 6,
    paddingX: 4,
    border: '1px solid',
    borderColor: 'sideBar.border',
    borderBottom: 0,
    cursor: 'pointer',
    borderTopLeftRadius: 'small',
    borderTopRightRadius: 'small',
    fontSize: 3,
  })
);

const Content = styled(Element)(
  css({
    display: 'grid',
    gridTemplateColumns: '1fr 50px',
    gridGap: 2,
    alignItems: 'center',
    paddingX: 2,
    paddingY: 4,
    border: '1px solid',
    borderColor: 'sideBar.border',
    cursor: 'pointer',
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
