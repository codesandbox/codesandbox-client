import React from 'react';
import { Footer } from '@codesandbox/common/lib/components';
import { PageHeader } from '../PageHeader';
import { Main, PageContent } from './elements';

interface ILayoutProps {
  title: string;
}

// TODO:
// - Refactor Navigation
// - Add code to determine Navigation Items / Page Title from Route Info

export const Layout: React.FC<ILayoutProps> = ({ title, children }) => (
  <Main>
    <PageHeader title={title} />
    <PageContent>{children}</PageContent>
    <Footer />
  </Main>
);
