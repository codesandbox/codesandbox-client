import React from 'react';
import { Helmet } from 'react-helmet';
import { Stack, Button, Text, Icon } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  VariableGrid,
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';

export const AlwaysOn = () => {
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.ALWAYS_ON);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  React.useEffect(() => {
    track('Sidebar - See Always-on');
  }, []);

  const items: DashboardGridItem[] = sandboxes.ALWAYS_ON
    ? sandboxes.ALWAYS_ON.map(sandbox => ({
        type: 'sandbox',
        sandbox,
        noDrag: true,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'always-on';

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Always-On - CodeSandbox</title>
      </Helmet>
      <Header title="Always-On" activeTeam={activeTeam} showViewOptions />
      {sandboxes.ALWAYS_ON && sandboxes.ALWAYS_ON.length ? <Info /> : null}
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};

const Info = () => {
  const { modalOpened } = useActions();

  return (
    <Stack
      gap={4}
      align="center"
      css={css({
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        marginX: 'auto',
        marginTop: 7,
        backgroundColor: 'grays.600',
        borderRadius: 'medium',
        padding: 2,
        paddingX: 3,
      })}
    >
      <Icon name="info" size={16} css={{ flexShrink: 0 }} />
      <Text variant="muted">
        You can make up to 3 server sandboxes Always-On.{' '}
        <Button
          as={Text}
          variant="link"
          style={{ color: 'white', padding: 0 }}
          onClick={() =>
            modalOpened({
              modal: 'feedback',
              message: "I'd like more Always-On sandboxes",
            })
          }
        >
          Contact us
        </Button>{' '}
        if you need more Always-On Sandboxes.
      </Text>
    </Stack>
  );
};
