import React from 'react';
import Fuse from 'fuse.js';

import { uniqBy, flatten } from 'lodash-es';
import { ITemplateInfo, TemplateList } from '../../TemplateList';

interface IFilteredTemplateProps {
  templateInfos: ITemplateInfo[];
  query: string;
}

export const FilteredTemplates = ({
  query,
  templateInfos,
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
            { name: 'sandbox.title', weight: 0.5 },
            { name: 'sandbox.description', weight: 0.5 },
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

  return <TemplateList templateInfos={filteredTemplateInfos} />;
};
