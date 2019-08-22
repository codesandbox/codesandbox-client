import React from 'react';
import Tags from '@codesandbox/common/lib/components/Tags';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { inject, hooksObserver } from 'app/componentConnectors';
import { EditableTags } from 'app/components/EditableTags';
import { Item } from './elements';

interface IKeywordsProps {
  editable?: boolean;
  store: any;
  signals: any;
}

export const Keywords = inject('store', 'signals')(
  hooksObserver(
    ({
      editable,
      store: {
        editor: {
          currentSandbox: { template, tags },
        },
        workspace: {
          tags: { tagName },
        },
      },
      signals: {
        notificationAdded,
        workspace: { tagAdded, tagChanged, tagRemoved },
      },
    }: IKeywordsProps) => {
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

      if (tags.length === 0 && !editable) {
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
    }
  )
);
