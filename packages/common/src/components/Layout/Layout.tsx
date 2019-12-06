import React from 'react';
import Navigation from '../Navigation';
import { Footer } from '../Footer';
import { Main, PageContent } from './elements';

interface ILayoutProps {}

// TODO:
// - Refactor Navigation
// - Add code to determine Navigation Items / Page Title from Route Info

export const Layout: React.FC<ILayoutProps> = ({ children }) => (
  <Main>
    <Navigation />
    <PageContent>{children}</PageContent>
    <Footer />
  </Main>
);
