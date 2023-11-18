import React from 'react';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { quotes } from 'app/utils/quotes';
import { EmptyPage } from '../../../Components/EmptyPage';

export const EmptyDrafts: React.FC = () => {
  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription as="p">
        By default, every devbox or sandbox you create will show up on this
        folder.
        <br />
        Items in My Drafts are not visible to your collaborators unless moved to
        the {quotes('All devboxes and sandboxes')} section.
      </EmptyPage.StyledDescription>
    </EmptyPage.StyledWrapper>
  );
};
