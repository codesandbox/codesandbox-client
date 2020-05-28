import React from 'react';
import { withRouter } from 'react-router-dom';
import css from '@styled-system/css';
import { Stack, Text, Button } from '@codesandbox/components';
import { Breadcrumbs } from '../Breadcrumbs';
import { Filters } from '../Filters';

type Props = {
  templates?: any[];
  path?: string;
  title?: string;
  match: any;
  createNewFolder: () => void;
};

export const HeaderComponent = ({
  createNewFolder,
  match,
  templates,
  path,
  title,
}: Props) => (
  <Stack
    align="center"
    justify="space-between"
    marginX={4}
    paddingBottom={2}
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
    <Stack gap={4} align="center">
      {match.path.includes('all') && (
        <Button
          onClick={createNewFolder}
          variant="link"
          css={css({
            fontSize: 3,
            color: 'mutedForeground',
            padding: 0,
            width: 'auto',
          })}
        >
          + New Folder
        </Button>
      )}
      {templates && <Filters possibleTemplates={templates} />}
    </Stack>
  </Stack>
);

// @ts-ignore
export const Header = withRouter(HeaderComponent);
