/* @flow */
import * as React from 'react';
import styled from 'styled-components';

import Margin from 'app/components/spacing/Margin';

import Tag from './Tag';

const TagContainer = styled.div`
  margin: 0.75em;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  ${props => props.align === 'right' && `justify-content: flex-end;`};
`;

type Props = {
  align: 'right' | 'left',
  tags: Array<string>,
  removeTag: ?(id: string, tag: string) => void,
};

export default ({ tags, removeTag, align, ...props }: Props) => (
  <TagContainer align={align || 'left'} {...props}>
    {tags.sort().map(tag => (
      <Margin key={tag} vertical={0.5} horizontal={0.25}>
        <Tag removeTag={removeTag} tag={tag} />
      </Margin>
    ))}
  </TagContainer>
);
