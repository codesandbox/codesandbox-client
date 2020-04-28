import React from 'react';
import css from '@styled-system/css';
import { Stack, Text } from '@codesandbox/components';
import { Breadcrumbs } from '../Breadcrumbs';
import { Filters } from '../Filters';

type Props = {
  templates?: any[];
  path?: string;
  title?: string;
};

export const Header = ({ templates, path, title }: Props) => (
  <Stack
    align="center"
    justify="space-between"
    paddingBottom={2}
    marginBottom={7}
    css={css({
      borderStyle: 'solid',
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: 'grays.500',
    })}
  >
    {title ? (
      <Text marginBottom={1} block weight="bold" size={5}>
        {title}
      </Text>
    ) : (
      <Breadcrumbs param={path} />
    )}

    {templates && <Filters possibleTemplates={templates} />}
  </Stack>
);
