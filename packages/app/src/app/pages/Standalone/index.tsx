import React, { useEffect } from 'react';
import { createGlobalStyle, withTheme } from 'styled-components';
import { ThemeProvider, Element } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import { useParams } from 'react-router-dom';
import { CreateBox } from 'app/components/Create/CreateBox';
import { ImportRepository } from 'app/components/Create/ImportRepository';
import { GenericCreate } from 'app/components/Create/GenericCreate';

import { CreateRepoFiles } from 'app/components/Create/CreateRepoFiles';
import { Preferences } from '../common/Modals/PreferencesModal';
import { NotFound } from '../common/NotFound';

const COMPONENT_MAP = {
  preferences: Preferences,
  create: GenericCreate,
  createSandbox: () => <CreateBox type="sandbox" isModal={false} />,
  createDevbox: () => <CreateBox type="devbox" isModal={false} />,
  import: ImportRepository,
  'create-repo-files': CreateRepoFiles,
};

export const StandalonePage = withTheme(({ theme }) => {
  const { genericPageMounted } = useActions();
  const params: { componentId?: string } = useParams();
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    genericPageMounted();
  }, [genericPageMounted]);

  const Content = COMPONENT_MAP[params.componentId];
  const contentProps = Object.fromEntries(searchParams.entries());

  if (!Content) {
    return <NotFound />;
  }

  const GlobalStyles = createGlobalStyle({
    body: {
      overflow: 'hidden',
      color: '#f5f5f5',
      background: '#151515 !important',
    },
  });

  return (
    <ThemeProvider theme={theme.vsCode}>
      <GlobalStyles />
      <Element css={{ background: '#151515', width: '100%', height: '100%' }}>
        <Content isStandalone {...contentProps} />
      </Element>
    </ThemeProvider>
  );
});
