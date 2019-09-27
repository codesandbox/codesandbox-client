import React, { FunctionComponent } from 'react';
import Tags from '@codesandbox/common/lib/components/Tags';
import getTemplateDefinition from '@codesandbox/common/lib/templates';

import { clone } from 'app/componentConnectors';
import { EditableTags } from 'app/components/EditableTags';
import { useOvermind } from 'app/overmind';

import { Item } from './elements';

type Props = {
  editable?: boolean;
};
export const Keywords: FunctionComponent<Props> = ({ editable }) => {
  const {
    actions: {
      notificationAdded,
      workspace: { tagAdded, tagChanged, tagRemoved },
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

  const changeTags = (newTags: string[], removedTags: string[]) => {
    if (tags.length > 5) {
      notificationAdded('You can have a maximum of 5 tags', 'error');
      return;
    }

    const tagWasRemoved =
      newTags.length < tags.length && removedTags.length === 1;

    if (tagWasRemoved) {
      removedTags.forEach(tag => {
        tagRemoved({ tag });
      });
    } else {
      tagAdded();
    }
  };

  return (
    <Item>
      {editable ? (
        <EditableTags
          template={getTemplateDefinition(template)}
          value={clone(tags)}
          onChange={changeTags}
          onChangeInput={(value: string) => {
            tagChanged({ tagName: value });
          }}
          maxTags={5}
          inputValue={tagName}
          renderInput={({ addTag, ...props }: any) =>
            tags.length !== 5 ? <input type="text" {...props} /> : null
          }
          onlyUnique
        />
      ) : (
        <Tags style={{ fontSize: 13 }} tags={tags} />
      )}
    </Item>
  );
};
