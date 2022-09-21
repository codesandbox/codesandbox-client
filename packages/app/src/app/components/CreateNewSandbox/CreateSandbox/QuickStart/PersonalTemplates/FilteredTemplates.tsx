import React from 'react';
import Fuse from 'fuse.js';

import { uniqBy, flatten } from 'lodash-es';
import { ITemplateInfo } from '../../TemplateList';
import { DynamicWidthTemplateList } from '../../TemplateList/DynamicWidthTemplateList';

interface IFilteredTemplateProps {
  templateInfos: ITemplateInfo[];
  query: string;
  forkOnOpen: boolean;
}

export const FilteredTemplates = ({
  query,
  templateInfos,
  forkOnOpen,
}: IFilteredTemplateProps) => {
  const searchIndex = React.useMemo(
    () =>
      new Fuse(
        uniqBy(flatten(templateInfos.map(t => t.templates)), t => t.id),
        {
          shouldSort: true,
          threshold: 0.3,
          distance: 10,
          keys: [
            { name: 'sandbox.title', weight: 0.3 },
            { name: 'sandbox.description', weight: 0.25 },
            { name: 'sandbox.alias', weight: 0.2 },
            { name: 'sandbox.source.template', weight: 0.2 },
            { name: 'sandbox.id', weight: 0.05 },
          ],
        }
      ),
    [templateInfos]
  );

  const filteredTemplateInfos = [
    {
      title: 'Search Results',
      key: 'search-results',
      templates: searchIndex.search(query),
    },
  ];

  return (
    <DynamicWidthTemplateList
      forkOnOpen={forkOnOpen}
      templateInfos={filteredTemplateInfos}
    />
  );
};
