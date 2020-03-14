import React from 'react';
import { ThemeProvider } from '@codesandbox/components/lib/components/ThemeProvider';
import { default as codesandboxBlack } from '@codesandbox/common/lib/themes/codesandbox-black';
import { default as Navigation } from '@codesandbox/common/lib/components/Navigation';
import { Footer } from '@codesandbox/common/lib/components';
// import { PageHeader } from '../PageHeader';
import { Main, PageContent } from './elements';

interface ILayoutProps {
  title: string;
}

// TODO:
// - Refactor Navigation (Swap out old Navigation component from Common to new version (PageHeader))
// - Add code to determine Navigation Items / Page Title from Route Info

export const Layout: React.FC<ILayoutProps> = ({ title, children }) => (
  <Main>
    <ThemeProvider vsCodeTheme={codesandboxBlack}>
      <Navigation />
      <PageContent>{children}</PageContent>
      <Footer />
    </ThemeProvider>
  </Main>
);
