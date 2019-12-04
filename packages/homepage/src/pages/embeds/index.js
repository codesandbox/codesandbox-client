import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';

import DevToolsIcon from '../../assets/icons/DevTools';
import NavigationIcon from '../../assets/icons/Navigation';
import PreviewModeIcon from '../../assets/icons/PreviewMode';
// import ProjectViewIcon from '../../assets/icons/ProjectView';

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
  Button,
  Wrapper,
} from './_elements';

export default () => {
  const [theme, setTheme] = useState('dark');
  const [devToolsHidden, setDevToolsHidden] = useState(1);
  const [navigation, setNavigation] = useState(1);
  const [view, setView] = useState('split');

  // set theme back to dark when getting out of the page
  useEffect(() => setTheme('dark'), []);

  return (
    <Layout>
      <CustomLightStyles light={theme === 'light'} />
      <TitleAndMetaTags title="Embed CodeSandbox in Docs, Blog Posts, and Websites - CodeSandbox" />
      <Wrapper>
        <TitleWrapper>
          <Title>
            Embed CodeSandbox
            <br /> in Docs, Blog Posts, and Websites
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
        <Banner>
          <Iframe
            title="embed-example"
            src={`https://codesandbox.io/embed/static-2lqup?fontsize=14&theme=${theme}&hidenavigation=${navigation}&view=${view}&hidedevtools=${devToolsHidden}`}
          />
        </Banner>
        <Customizations>
          {
            // <li>
            //   <Button type="button" light={theme === 'light'}>
            //     <ProjectViewIcon light={theme === 'light'} /> Project View
            //   </Button>
            // </li>
          }
          <li>
            <Button
              type="button"
              light={theme === 'light'}
              active={view === 'preview'}
              onClick={() => setView(view === 'preview' ? 'split' : 'preview')}
            >
              <PreviewModeIcon
                light={theme === 'light'}
                active={view === 'preview'}
              />{' '}
              Preview Mode
            </Button>
          </li>
          <li>
            <Button
              type="button"
              light={theme === 'light'}
              active={devToolsHidden === 0}
              onClick={() => setDevToolsHidden(devToolsHidden === 1 ? 0 : 1)}
            >
              <DevToolsIcon
                light={theme === 'light'}
                active={devToolsHidden === 0}
              />{' '}
              DevTools
            </Button>
          </li>
          <li>
            <Button
              type="button"
              light={theme === 'light'}
              active={navigation === 0}
              onClick={() => setNavigation(navigation === 1 ? 0 : 1)}
            >
              <NavigationIcon
                light={theme === 'light'}
                active={navigation === 0}
              />{' '}
              Navigation
            </Button>
          </li>
        </Customizations>
        <ContentBlock>
          <div>
            <h3> Customize the look and feel</h3>
            Show just the editor, the preview, or both. Then enable
            auto-resizing, the navigation bar, console, module view, or test
            results. Specify which file shows first in the editor and the path
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
            You can place embeds with an iframe or anywhere with Embedly
            support, like Medium, Reddit, Trello, and Notion.
          </div>
        </ContentBlock>
      </Wrapper>
    </Layout>
  );
};
