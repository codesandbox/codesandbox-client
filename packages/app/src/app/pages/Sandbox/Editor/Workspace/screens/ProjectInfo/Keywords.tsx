import React, { FunctionComponent } from 'react';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';
import { json } from 'overmind';
import { Tags } from '@codesandbox/components';
import { EditableTags } from './EditableTags';

type Props = {
  editable?: boolean;
};

export const Keywords: FunctionComponent<Props> = ({ editable }) => {
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
    <div>
      {editable ? (
        <EditableTags
          inputValue={tagName}
          maxTags={5}
          onChange={changeTags}
          onChangeInput={tagChanged}
          onlyUnique
          template={getTemplateDefinition(template)}
          value={json(tags)}
        />
      ) : (
        <Tags tags={tags} />
      )}
    </div>
  );
};
