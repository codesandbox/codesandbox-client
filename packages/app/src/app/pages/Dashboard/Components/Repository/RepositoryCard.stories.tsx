import React from 'react';
import { storiesOf } from '@storybook/react';
import { RepositoryCard } from './RepositoryCard';

storiesOf('components/RepositoryCard', module).add(
  'Basic RepositoryCard',
  () => (
    <RepositoryCard
      repository={{
        url: '#',
        owner: 'owner',
        name: 'name',
      }}
      labels={{ branches: 'branches', repository: 'repository' }}
      onContextMenu={() => {}}
      onClick={() => {}}
      selected={false}
      isBeingRemoved={false}
    />
  )
);
