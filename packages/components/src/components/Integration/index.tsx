import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';
import { Text } from '../Text';
import { Stack } from '../Stack';

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

export const Integration = ({ icon, title, children }) => (
  <div>
    <Header gap={1} align="center">
      {icon()}
      <Text weight="medium">{title}</Text>
    </Header>
    <Content>{children}</Content>
  </div>
);
