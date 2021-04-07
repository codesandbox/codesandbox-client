import React from 'react';
import css from '@styled-system/css';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { Grid, Column, Stack, Text, Element } from '@codesandbox/components';

import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { CommunitySandbox } from 'app/pages/Dashboard/Components/CommunitySandbox';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardCommunitySandbox } from 'app/pages/Dashboard/types';

export const Album = ({ match }) => {
  const {
    activeTeam,
    dashboard: { sandboxes, curatedAlbums },
  } = useAppState();

  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    if (curatedAlbums.length === 0) getPage(sandboxesTypes.DISCOVER);
    if (!sandboxes.LIKED) getPage(sandboxesTypes.LIKED);
  }, [getPage, curatedAlbums, sandboxes.LIKED]);

  const albumId = match.params.id;
  const album = curatedAlbums.find(a => a.id === albumId);
  const likedSandboxIds = (sandboxes.LIKED || []).map(s => s.id);

  if (!album) return null;

  const selectionItems: DashboardCommunitySandbox[] = album.sandboxes.map(
    sandbox => ({
      type: 'community-sandbox',
      noDrag: true,
      autoFork: false,
      sandbox,
    })
  );

  return (
    <Element
      css={{ width: '100%', '#selection-container': { overflowY: 'auto' } }}
    >
      <Helmet>
        <title>Discover - CodeSandbox</title>
      </Helmet>
      <Stack direction="vertical" gap={6}>
        <Text size={4} weight="bold">
          {album.title}
        </Text>

        <SelectionProvider
          activeTeamId={activeTeam}
          page="discover"
          items={selectionItems}
        >
          <Element
            css={css({
              marginX: 'auto',
              width: `calc(100% - ${2 * GUTTER}px)`,
              maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
              paddingY: 10,
            })}
          >
            <Grid
              id="variable-grid"
              rowGap={6}
              columnGap={6}
              css={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              }}
            >
              {album.sandboxes.map(sandbox => (
                <Column key={sandbox.id}>
                  <CommunitySandbox
                    isScrolling={false}
                    item={{
                      type: 'community-sandbox',
                      noDrag: true,
                      autoFork: false,
                      sandbox: {
                        ...sandbox,
                        liked: likedSandboxIds.includes(sandbox.id),
                      },
                    }}
                  />
                </Column>
              ))}
              <div />
              <div />
            </Grid>
          </Element>
        </SelectionProvider>
      </Stack>
    </Element>
  );
};
