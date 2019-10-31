import React, { FunctionComponent } from 'react';
import Tags from '@codesandbox/common/lib/components/Tags';
import getTemplateDefinition from '@codesandbox/common/lib/templates';

import { clone } from 'app/componentConnectors';
import { EditableTags } from 'app/components/EditableTags';
import { useOvermind } from 'app/overmind';

import { Item } from './elements';

interface IKeywordsProps {
  editable?: boolean;
};
export const Keywords: FunctionComponent<IKeywordsProps> = ({ editable }) => {
  const {
    actions: {
      workspace: { tagChanged, tagsChanged },
    },
    state: {
      editor: {
        currentSandbox: { template, tags },
      },
      workspace: {
        tags: { tagName },
      },
    },
  } = useOvermind();

  if (tags.length === 0 && !editable) {
    return null;
  }

  const changeTags = (newTags: string[], removedTags: string[]) =>
    tagsChanged({ newTags, removedTags });

  return (
    <Item>
      {editable ? (
        <EditableTags
          inputValue={tagName}
          maxTags={5}
          onChange={changeTags}
          onChangeInput={tagChanged}
          onlyUnique
          renderInput={({ addTag, ...props }: any) =>
            tags.length !== 5 ? <input type="text" {...props} /> : null
          }
          template={getTemplateDefinition(template)}
          value={clone(tags)}
        />
      ) : (
        <Tags style={{ fontSize: 13 }} tags={tags} />
      )}
    </Item>
  );
};
