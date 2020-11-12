import React from 'react';
import { useOvermind } from 'app/overmind';
import {
  Stack,
  List,
  ListAction,
  Text,
  Icon,
  Grid,
  Column,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxCard, SkeletonCard } from './SandboxCard';
import { FolderCard } from './FolderCard';
import { ProfileCollectionType } from '../constants';

const MODAL_HEIGHT = '80vh';

export const SandboxPicker: React.FC<{ closeModal?: () => void }> = ({
  closeModal,
}) => {
  const {
    state: {
      profile: { collections },
      currentModalMessage,
    },
    actions: {
      profile: {
        fetchCollections,
        getSandboxesByPath,
        newSandboxShowcaseSelected,
        addFeaturedSandboxes,
      },
    },
  } = useOvermind();

  const [selectedPath, setPath] = React.useState('/');
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      await getSandboxesByPath({ path: selectedPath });
      setLoading(false);
    })();
  }, [selectedPath, getSandboxesByPath]);

  const selectedCollection = decorateCollections(collections).find(
    collection => collection.path === selectedPath
  );

  const collectionsInPath = decorateCollections(collections)
    .filter(collection => collection.parent === selectedPath)
    .filter(collection => collection.path !== selectedPath);

  const sandboxesInPath =
    collections.find(collection => collection.path === selectedPath)
      ?.sandboxes || [];

  return (
    <Stack css={css({ backgroundColor: 'grays.800', height: MODAL_HEIGHT })}>
      <List
        css={css({
          width: 240,
          borderRight: '1px solid',
          borderColor: 'grays.600',
          flexShrink: 0,
          paddingY: 4,
        })}
      >
        <ListAction
          align="center"
          gap={2}
          css={css({ height: 10, paddingLeft: 4 })}
          onClick={() => setPath('/')}
        >
          <Icon name="folder" />
          <Text>All Sandboxes</Text>
        </ListAction>
        {collections.length ? (
          <SubCollections
            collections={decorateCollections(collections)}
            path="/"
            setPath={setPath}
          />
        ) : null}
      </List>

      <Stack direction="vertical" css={css({ width: '100%' })}>
        <Text
          size={5}
          weight="bold"
          block
          css={css({
            borderBottom: '1px solid',
            borderColor: 'grays.600',
            paddingBottom: 2,
            margin: 5,
          })}
        >
          {selectedCollection?.name || selectedPath}
        </Text>
        {(collectionsInPath.length || sandboxesInPath.length) && !isLoading ? (
          <Grid
            rowGap={6}
            columnGap={6}
            css={css({
              width: '100%',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              height: MODAL_HEIGHT,
              padding: 5,
              overflowY: 'scroll',
              '> [data-column]': { marginBottom: 5 },
            })}
          >
            {collectionsInPath.map(collection => (
              <Column key={collection.path} data-column>
                <FolderCard
                  collection={collection}
                  onClick={() => setPath(collection.path)}
                />
              </Column>
            ))}
            {sandboxesInPath.map(sandbox => (
              <Column key={sandbox.id} data-column>
                <SandboxCard
                  sandbox={sandbox}
                  onClick={() => {
                    if (currentModalMessage === 'SHOWCASE') {
                      newSandboxShowcaseSelected(sandbox.id);
                    } else {
                      addFeaturedSandboxes({ sandboxId: sandbox.id });
                    }
                    closeModal();
                  }}
                />
              </Column>
            ))}
            <div />
            <div />
            <div />
          </Grid>
        ) : (
          <div style={{ width: '100%' }}>
            {isLoading ? (
              <Grid
                rowGap={6}
                columnGap={6}
                css={css({
                  width: '100%',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  padding: 5,
                })}
              >
                <Column>
                  <SkeletonCard />
                </Column>
                <Column>
                  <SkeletonCard />
                </Column>
                <Column>
                  <SkeletonCard />
                </Column>
                <Column>
                  <SkeletonCard />
                </Column>
              </Grid>
            ) : (
              <Stack
                justify="center"
                align="center"
                css={{ width: '100%', height: MODAL_HEIGHT }}
              >
                <Text variant="muted" align="center">
                  Uh oh, you haven’t created any sandboxes in this folder yet!
                </Text>
              </Stack>
            )}
          </div>
        )}
      </Stack>
    </Stack>
  );
};

type DecoraratedCollection = ProfileCollectionType & {
  parent: string;
  level: number;
  name: string;
};

const decorateCollections = (
  collections: ProfileCollectionType[]
): DecoraratedCollection[] =>
  collections.map(collection => {
    const split = collection.path.split('/');

    return {
      ...collection,
      parent: split.slice(0, -1).join('/') || '/',
      level: split.length - 2,
      name: split[split.length - 1] || 'All Sandboxes',
    };
  });

const getSubCollections = (
  collections: DecoraratedCollection[],
  path: string
) =>
  collections.filter(
    collection =>
      collection.parent &&
      collection.parent === path &&
      collection.path !== path
  );

const SubCollections: React.FC<{
  collections: DecoraratedCollection[];
  path: string;
  setPath: (path: string) => void;
}> = ({ collections, path, setPath }) => {
  const subCollections = getSubCollections(collections, path);

  return (
    <>
      {subCollections.map(collection => (
        <>
          <ListAction
            key={collection.path || 'all'}
            align="center"
            gap={2}
            css={css({
              height: 10,
              paddingLeft: 8 + 4 * collection.level,
            })}
            onClick={() => setPath(collection.path)}
          >
            <Icon name="folder" />
            <Text>{collection.name}</Text>
          </ListAction>
          <SubCollections
            collections={collections}
            path={collection.path}
            setPath={setPath}
          />
        </>
      ))}
    </>
  );
};
