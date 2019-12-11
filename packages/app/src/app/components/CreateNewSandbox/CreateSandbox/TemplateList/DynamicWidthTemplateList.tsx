import React from 'react';
import Media from 'react-media';
import { COLUMN_MEDIA_THRESHOLD } from '../CreateSandbox';
import { TemplateList, ITemplateListProps } from './TemplateList';

/**
 * TemplateList that automatically switches between 3 and 2 columns
 * based on the width of the browser window
 */
export const DynamicWidthTemplateList = (
  templateListProps: ITemplateListProps
) => (
  <Media query={`(min-width: ${COLUMN_MEDIA_THRESHOLD}px)`}>
    {matches => (
      <TemplateList {...templateListProps} columnCount={matches ? 3 : 2} />
    )}
  </Media>
);
