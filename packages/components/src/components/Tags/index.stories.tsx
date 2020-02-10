import React from 'react';
import TagsInput from 'react-tagsinput';

import styled from 'styled-components';
import css from '@styled-system/css';

import { Tags } from '.';

import { Input } from '../Input';
import { Tag } from './Tag';

export default {
  title: 'components/Tags',
  component: Tags,
};

export const Basic = () => <Tags tags={['one']} />;

export const ManyTags = () => (
  <Tags tags={['one', 'two', 'three', 'four', 'five']} />
);

export const Removable = () => (
  <Tags
    onRemove={() => {}}
    tags={[
      'one',
      'two',
      'really really long three',
      'four',
      'five',
      'too many tags',
      'might ruin the alignment',
    ]}
  />
);

const Layout = styled(Input).attrs({ as: 'label', htmlFor: 'tags-input' })(
  css({
    width: 300,
    display: 'inline-flex',
    alignItems: 'center',
    padding: 0,
    // borrow styles from Input and Tags
    flexWrap: 'wrap',
    '> *': { margin: 1 },
    height: 'auto',
    input: {
      height: 4,
      paddingX: 0,
      fontSize: 2,
      width: 100,
      border: 'none',
    },
    ':focus-within': {
      borderColor: 'inputOption.activeBorder',
    },
    '[data-component="Tag"]': {
      backgroundColor: 'sideBar.background',
    },
  })
);

export const TagsInputy = () => {
  const [tags, setTags] = React.useState([]);

  return (
    <TagsInput
      value={tags}
      onChange={setTags}
      onlyUnique
      renderTag={Tag}
      renderInput={props => <Input id="tags-input" {...props} />}
      renderLayout={(tagsComponent, inputComponent) => (
        <Layout>
          {tagsComponent}
          {inputComponent}
        </Layout>
      )}
    />
  );
};
