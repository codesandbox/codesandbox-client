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
import { SandboxCard } from './SandboxCard';
import { FolderCard } from './FolderCard';
import { SandboxType, ProfileCollectionType } from './constants';

export const SandboxPicker: React.FC = () => {
  const {
    state: {
      profile: { collections },
    },
    actions: {
      profile: { fetchCollections, getSandboxesByPath, addFeaturedSandboxes },
    },
  } = useOvermind();

  const [selectedPath, setPath] = React.useState('/');

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  React.useEffect(() => {
    getSandboxesByPath({ path: selectedPath });
  }, [selectedPath, getSandboxesByPath]);

  return (
    <Stack css={css({ backgroundColor: 'grays.800' })}>
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
        <SubCollections
          collections={decorateCollections(collections)}
          path="/"
          setPath={setPath}
        />
      </List>

      <Grid
        rowGap={6}
        columnGap={6}
        css={{
          width: '100%',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        {collections
          .filter(collection => collection.path.startsWith(selectedPath))
          .filter(collection => collection.path !== selectedPath)
          .map(collection => (
            <Column key={collection.path}>
              <FolderCard
                collection={collection}
                onClick={() => setPath(collection.path)}
              />
            </Column>
          ))}
        {collections
          .find(collection => collection.path === selectedPath)
          ?.sandboxes.map(sandbox => (
            <Column key={sandbox.id}>
              <SandboxCard
                type={SandboxType.DEFAULT_SANDBOX}
                sandbox={sandbox}
                onClick={() => addFeaturedSandboxes({ sandboxId: sandbox.id })}
              />
            </Column>
          ))}
        <div />
        <div />
      </Grid>
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
      name: split[split.length - 1],
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
            key={collection.path}
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
