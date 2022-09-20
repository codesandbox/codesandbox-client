import React from 'react';
import { ITemplateInfo } from '../../TemplateList';
import { DynamicWidthTemplateList } from '../../TemplateList/DynamicWidthTemplateList';

interface IPersonalTemplatesProps {
  officialTemplates: ITemplateInfo[];
  collectionId?: string;
}

export const PersonalTemplates = ({
  officialTemplates,
  collectionId,
}: IPersonalTemplatesProps) => {
  return (
    <DynamicWidthTemplateList
      showSecondaryShortcuts
      forkOnOpen
      templateInfos={officialTemplates}
      collectionId={collectionId}
    />
  );
};
