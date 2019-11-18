import React, { useState } from 'react';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import DevToolsIcon from '../assets/icons/DevTools';
import NavigationIcon from '../assets/icons/Navigation';
import PreviewModeIcon from '../assets/icons/PreviewMode';
import ProjectViewIcon from '../assets/icons/ProjectView';

import {
  ContentBlock,
  Title,
  Banner,
  TitleWrapper,
  Iframe,
  Switch,
  SwitchWrapper,
  CustomLightStyles,
  Customizations,
} from './_embeds.elements';

export default () => {
  const [theme, setTheme] = useState('dark');
  return (
    <Layout>
      <CustomLightStyles light={theme === 'light'} />
      <TitleAndMetaTags
        title={`${' Embed CodeSandbox in Docs, Blog Posts, and Websites'} - CodeSandbox`}
      />
      <PageContainer width={1086}>
        <TitleWrapper>
          <Title>
            {' Embed CodeSandbox in Docs, Blog Posts, and Websites'}
          </Title>
        </TitleWrapper>
        <SwitchWrapper>
          <span
            css={`
              margin-right: 1rem;
              visibility: ${theme === 'dark' ? 'visible' : 'hidden'};
            `}
          >
            Dark Mode
          </span>
          <Switch>
            <input
              type="checkbox"
              name="toggleTheme"
              id="toggleTheme"
              onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="toggleTheme">
              <span className="inner" />
              <span className="switch" />
            </label>
          </Switch>
          <span
            css={`
              margin-left: 1rem;
              visibility: ${theme === 'light' ? 'visible' : 'hidden'};
            `}
          >
            Light Mode
          </span>
        </SwitchWrapper>
        <Banner coverSmaller color="EB455A">
          <Iframe
            title="embed-example"
            src={`https://codesandbox.io/embed/static-2lqup?fontsize=14&hidenavigation=1&theme=${theme}&view=preview&hideDevTools=true`}
          />
        </Banner>
        <Customizations>
          <li>
            <button type="button">
              <ProjectViewIcon /> Project View
            </button>
          </li>
          <li>
            <button type="button">
              <NavigationIcon /> Navigation
            </button>
          </li>
          <li>
            <button type="button">
              <PreviewModeIcon /> Preview Mode
            </button>
          </li>
          <li>
            <button type="button">
              <DevToolsIcon /> DevTools
            </button>
          </li>
        </Customizations>
        <ContentBlock columns={2}>
          <div>
            <h3> Customize the look and feel</h3>
            Show just the editor, the preview or both. Then enable
            auto-resizing, the navigation bar, console, module view, or test
            results. Specify which file shows first in the editor, and the path
            the preview displays.
          </div>

          <div>
            <h3> Small in size, big in flexibility</h3>
            Designed to be lightweight on the page while providing visitors with
            the ability to view code, the running app, or both at the same time.
            Toggle features to find your preferred balance of filesize and
            functionality.
          </div>

          <div>
            <h3> Embed everywhere</h3>
            You can place embeds with an iFrame, or anywhere with Embedly
            support, like Medium, Reddit, Trello, and Notion.
          </div>
        </ContentBlock>
      </PageContainer>
    </Layout>
  );
};
