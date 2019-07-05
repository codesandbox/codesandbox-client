import React from 'react';
import { observer } from 'mobx-react-lite';
import Tags from '@codesandbox/common/lib/components/Tags';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import EditableTags from 'app/components/EditableTags';
import { useSignals, useStore } from 'app/store';
import { Item } from './elements';

interface IKeywordsProps {
  editable?: boolean;
}

export const Keywords = observer(({ editable }: IKeywordsProps) => {
  const {
    editor: {
      currentSandbox: { template, tags },
    },
    workspace: {
      tags: { tagName },
    },
  } = useStore();
  const {
    notificationAdded,
    workspace: { tagAdded, tagChanged, tagRemoved },
  } = useSignals();

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

  if (tags.length === 0) {
    return null;
  }

  return (
    <Item>
      {editable ? (
        <EditableTags
          template={getTemplateDefinition(template)}
          value={tags.toJS()}
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
});
