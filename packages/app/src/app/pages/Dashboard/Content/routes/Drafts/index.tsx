import React from 'react';
import { Element, Text } from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';

export const Drafts = () => {
  const {
    activeTeam,
    user,
    dashboard: { sandboxes, getFilteredSandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.DRAFTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const items: DashboardGridItem[] = sandboxes.DRAFTS
    ? getFilteredSandboxes(sandboxes.DRAFTS)
        .filter(s => s.authorId === user?.id)
        .map(sandbox => ({
          type: 'sandbox',
          sandbox,
        }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'drafts';
  const isEmpty = items.length === 0;

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>My drafts - CodeSandbox</title>
      </Helmet>
      <Header
        title="My drafts"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.DRAFTS)}
        showViewOptions={!isEmpty}
        showFilters={!isEmpty}
        showSortOptions={!isEmpty}
      />

      <Element
        css={{ paddingLeft: '16px', paddingBottom: '24px', paddingTop: '8px' }}
      >
        <Text>
          Drafts are private to you. To share a draft, move it to another
          folder.
        </Text>
      </Element>

      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
