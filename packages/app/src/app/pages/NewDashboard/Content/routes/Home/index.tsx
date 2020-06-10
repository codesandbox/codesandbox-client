import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Stack, Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { Helmet } from 'react-helmet';

export const Home = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.HOME);
  }, [actions.dashboard]);

  const templates = (sandboxes.TEMPLATE_HOME || []).map(template => {
    const { sandbox, ...templateValues } = template;
    return {
      type: 'sandbox',
      ...sandbox,
      isTemplate: true,
      template: templateValues,
      isHomeTemplate: true,
    };
  });

  const items = [
    { type: 'header', title: 'Recently Used Templates' },
    ...templates,
    { type: 'header', title: 'Your Recent Sandboxes' },
    { type: 'new-sandbox' },
    ...(sandboxes.RECENT_HOME || []).map(sandbox => ({
      type: 'sandbox',
      ...sandbox,
    })),
  ];

  return (
    <SelectionProvider
      sandboxes={[...templates, ...(sandboxes.RECENT_HOME || [])]}
    >
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <Header title="Home" />

      {sandboxes.RECENT_HOME ? (
        <>
          <VariableGrid items={items} />
        </>
      ) : (
        <Stack as="section" direction="vertical" gap={10}>
          <Element css={css({ height: 5 })} />
          <Stack direction="vertical" gap={5}>
            <Text marginLeft={4}>Recently Used Templates</Text>
            <SkeletonGrid count={4} />
          </Stack>
          <Stack direction="vertical" gap={5}>
            <Text marginLeft={4}>Your Recent Sandboxes</Text>
            <SkeletonGrid count={4} />
          </Stack>
        </Stack>
      )}
    </SelectionProvider>
  );
};
