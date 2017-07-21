/* @flow */
import React from 'react';
import styled from 'styled-components';

import Margin from 'app/components/spacing/Margin';

import Tag from './Tag';

const TagContainer = styled.div`
  margin: .75em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

type Props = {
  tags: Array<string>,
  removeTag: ?(id: string, tag: string) => void,
};

export default ({ tags, removeTag }: Props) =>
  <TagContainer>
    {tags.sort().map(tag =>
      <Margin key={tag} vertical={0.5} horizontal={0.25}>
        <Tag removeTag={removeTag} tag={tag} />
      </Margin>,
    )}
  </TagContainer>;
