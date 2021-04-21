import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Grid,
  Stack,
  Element,
  Input,
  IconButton,
  Button,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { Album } from 'app/graphql/types';

import { DashboardCommunitySandbox } from 'app/pages/Dashboard/types';
import { CommunitySandbox } from 'app/pages/Dashboard/Components/CommunitySandbox';

import { PickedSandbox } from './index';
import { PICKED_SANDBOXES_ALBUM } from './contants';

export const Curate = () => {
  const {
    activeTeam,
    dashboard: { sandboxes, curatedAlbums },
  } = useAppState();

  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.DISCOVER);
    if (!sandboxes.LIKED) getPage(sandboxesTypes.LIKED);
  }, [getPage, sandboxes.LIKED]);

  const flatAlbumSandboxes = Array.prototype.concat.apply(
    [],
    curatedAlbums.map(album => album.sandboxes)
  );

  const selectionItems: DashboardCommunitySandbox[] = flatAlbumSandboxes.map(
    sandbox => ({
      type: 'community-sandbox',
      sandbox,
    })
  );

  return (
    <Element
      css={{ width: '100%', '#selection-container': { overflowY: 'auto' } }}
    >
      <Helmet>
        <title>Curate - CodeSandbox</title>
      </Helmet>
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
          <Stack direction="vertical" gap={10}>
            <CustomisePickedSandboxes />

            {curatedAlbums
              .filter(album => album.id !== PICKED_SANDBOXES_ALBUM)
              .map(album => (
                <Collection key={album.id} album={album} />
              ))}

            <CreateNewAlbum />
          </Stack>
        </Element>
      </SelectionProvider>
    </Element>
  );
};
const CustomisePickedSandboxes = () => {
  const {
    dashboard: { curatedAlbums },
  } = useAppState();
  const {
    dashboard: { getPage, addSandboxesToAlbum, removeSandboxesFromAlbum },
  } = useActions();

  const featuredAlbum = curatedAlbums.find(
    album => album.id === PICKED_SANDBOXES_ALBUM
  );

  const [loading, setLoading] = React.useState(false);

  if (!featuredAlbum) return null;
  const sandboxes = featuredAlbum.sandboxes;

  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);

    const currentSandboxIds = sandboxes.map(s => s.id);
    const newSandboxIds = [
      event.target[1].value,
      event.target[2].value,
      event.target[3].value,
    ];

    // clean up old options
    await removeSandboxesFromAlbum({
      albumId: PICKED_SANDBOXES_ALBUM,
      sandboxIds: currentSandboxIds,
    });

    // set them fresh
    await addSandboxesToAlbum({
      albumId: PICKED_SANDBOXES_ALBUM,
      sandboxIds: newSandboxIds,
    });

    // fetch albums again with details
    await getPage(sandboxesTypes.DISCOVER);
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={onSubmit} key={String(sandboxes)}>
        <Stack direction="vertical" gap={4}>
          <Stack justify="space-between">
            <Text size={4} weight="bold">
              Featured sandboxes
            </Text>
            <Button type="submit" css={{ maxWidth: 100 }} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </Stack>
          <Text size={3} variant="muted">
            Featured sandboxes show up on top. There are 1-3 featured cards
            shown depending on the space.
          </Text>
          <Stack gap={8}>
            <Input defaultValue={sandboxes[0]?.id} placeholder="Sandbox id" />
            <Input defaultValue={sandboxes[1]?.id} placeholder="Sandbox id" />
            <Input defaultValue={sandboxes[2]?.id} placeholder="Sandbox id" />
          </Stack>
        </Stack>
      </form>
      <Grid
        rowGap={6}
        columnGap={6}
        css={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          height: '528px',
          overflow: 'hidden',
        }}
      >
        {sandboxes.slice(0, 3).map(sandbox => (
          <PickedSandbox key={sandbox.id} sandbox={sandbox} />
        ))}
      </Grid>
    </>
  );
};

type CollectionTypes = { album: Album };
export const Collection: React.FC<CollectionTypes> = ({ album }) => {
  const {
    dashboard: { updateAlbum },
  } = useActions();

  const [renaming, setRenaming] = React.useState(false);

  return (
    <Stack key={album.id} direction="vertical" gap={6}>
      {renaming ? (
        <Stack
          as="form"
          gap={2}
          onSubmit={event => {
            event.preventDefault();
            updateAlbum({ id: album.id, title: event.target.title.value });
            setRenaming(false);
          }}
        >
          <Input
            id="title"
            defaultValue={album.title}
            style={{ maxWidth: 300, fontSize: 16, fontWeight: 700 }}
          />
          <Button type="submit" autoWidth>
            Update
          </Button>
        </Stack>
      ) : (
        <Stack gap={2} align="center">
          <Text size={4} weight="bold">
            {album.title}
          </Text>
          <IconButton
            name="edit"
            title="Change title"
            size={14}
            onClick={() => setRenaming(true)}
          />
        </Stack>
      )}

      <Stack
        gap={6}
        css={css({ overflowX: 'auto', '> div': { minWidth: 300 } })}
      >
        {album.sandboxes.map(sandbox => (
          <CommunitySandbox
            key={sandbox.id}
            isScrolling={false}
            item={{
              type: 'community-sandbox',
              noDrag: true,
              autoFork: false,
              sandbox,
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};

const CreateNewAlbum = () => {
  return (
    <Stack as="form">
      <Input placeholder="" />
      <Button>Create</Button>
    </Stack>
  );
};
