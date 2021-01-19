import React from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Button from '../../components/Button';
import CTA from '../../components/CTA';
import { Description } from '../../components/Typography';

import {
  ContentBlock,
  Title,
  Subtitle,
  TitleWrapper,
  Wrapper,
  ContentBlockImage,
  CTABottom,
  FeaturedImage,
} from '../../components/LayoutComponents';

import ide from './images/ide.png';
import bg from './images/bg.png';
import bg1 from './images/bg1.png';
import bg2 from './images/bg2.png';
import bg3 from './images/bg3.png';
import bg4 from './images/bg4.png';
import templates from './images/templates.png';
import makeityours from './images/makeityours.png';
import server from './images/server.png';
import tests from './images/tests.png';

import IDEIcon from '../../assets/icons/Ide';


import gh from './images/gh.svg';
import deploy from './images/deploy.svg';
import vscode from './images/vscode.svg';

export default () => (
  <Layout>
    <TitleAndMetaTags title="IDE - Codesandbox" />
    <Wrapper>
      <TitleWrapper>
          
    

        <Title>Code from anywhere</Title>
      </TitleWrapper>
      <Description>
        Code online with no setup in a powerful IDE that feels like it’s local.
      </Description>
      <div
        css={`
          margin: auto;
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        `}
      >
        <Button cta href="https://codesandbox.io/s/">
          Get Started
        </Button>
      </div>
      <div>
        <div>
          <Subtitle as="h2">Fast development in the browser</Subtitle>
        </div>
        <FeaturedImage
        css={`
        height: 468px;
 
        ${props => props.theme.breakpoints.md} {
          height: 200px;
        }
      `}
        bg={bg}>
          <img
            src={templates}
            alt="Template Universe"
            css={`
              width: 864px;
              margin-top:4rem;
            `}
          />
        </FeaturedImage>
        <ContentBlock>
          <div>
            <h3>Cloud IDE</h3>
            Code from anywhere, on any device with a web browser.
          </div>

          <div>
            <h3>Hot Module Reloading</h3>
            With Hot Module Reloading built-in you can see changes as you make
            them.
          </div>

          <div>
            <h3>Keybindings and Quick Actions</h3>
            Use Keybindings and Quick Actions to perform everyday tasks
            speedily.
          </div>
        </ContentBlock>

        <div
          css={`
            margin-top: 160px;
            margin-bottom: 56px;
          `}
        >
          <Subtitle as="h2">Use with Your Fave Dev Tools</Subtitle>
        </div>

        <ContentBlock>
          <div>
            <ContentBlockImage bg="151515">
              <img src={gh} alt="Integrated with GitHub" />
            </ContentBlockImage>
            <h3> Integrated with GitHub</h3>
            Import a repo, and changes are synced automatically. Or export your
            sandbox, create commits, and open PRs.
          </div>

          <div>
            <ContentBlockImage bg="151515">
              <img src={deploy} alt="Deploy to Vercel or Netlify" />
            </ContentBlockImage>
            <h3>Deploy to Vercel or Netlify</h3>
            Deploy a production version of your sandbox with Vercel or Netlify.
          </div>

          <div>
            <ContentBlockImage bg="5962DF">
              <img src={vscode} alt="Powered by VS Code" />
            </ContentBlockImage>
            <h3>Powered by VS Code</h3>
            Use “Go to Definition,” “Replace Occurrences,” set a custom VS Code
            theme, and even enable Vim mode.
          </div>
        </ContentBlock>
        <div>
          <div>
            <Subtitle as="h2">Code Together</Subtitle>
          </div>
          <FeaturedImage
            css={`
              height: 468px;
              justify-content: flex-end;
              ${props => props.theme.breakpoints.md} {
                height: auto;
              }
            `}
            bg={bg1}
          >
            <img
              src={ide}
              alt="Pair-up on Code"
              css={`
                width: 820px;
                ${props => props.theme.breakpoints.md} {
                  margin-top:4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Pair-up on Code</h3>
              Work on code and edit sandboxes together in real-time, like
              in a Google Doc.
            </div>

            <div>
              <h3>Inline Chat</h3>
              Chat with collaborators about the code you're all working on.
            </div>

            <div>
              <h3>Classroom Mode</h3>
              Use Classroom Mode to control who can make edits or watch.
            </div>
          </ContentBlock>
        </div>
        <div>
          <div>
            <Subtitle as="h2">Work with Containers</Subtitle>
          </div>
          <FeaturedImage
            css={`
              height: 468px;
              justify-content: flex-start;
              background-position: bottom;
              ${props => props.theme.breakpoints.md} {
                height: auto;
              }
            `}
            bg={bg2}
          >
            <img
              src={server}
              alt="Terminal Access"
              css={`
                width: 880px;
                ${props => props.theme.breakpoints.md} {
                  margin-top:4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock>
            <div>
              <h3>Create Full-stack Web Apps</h3>
              Create back-end as well as front-end applications using Node.js.
            </div>

            <div>
              <h3>A Secure Server Control Panel</h3>
              Restart the sandbox or server, use multiple ports, and add secrets
              securely.
            </div>

            <div>
              <h3>Terminal Access</h3>
              Run scripts and commands from a terminal built directly into the
              editor.
            </div>
          </ContentBlock>
        </div>
        <div>
          <div>
            <Subtitle as="h2">Debug Like a Pro</Subtitle>
          </div>
          <FeaturedImage
            css={`
              height: 468px;
              justify-content: flex-start;

              ${props => props.theme.breakpoints.md} {
                height: auto;
              }

            `}
            bg={bg3}
          >
            <img
              src={tests}
              alt="Jest tests"
              css={`
                width: 826px;
                ${props => props.theme.breakpoints.md} {
                  margin-top:4rem;
                }
              `}
            />
          </FeaturedImage>
          <ContentBlock cols="4">
            <div>
              <h3>DevTools</h3>
              Developer tools, like a console, test view, and a problem viewer
              are in the preview. We support React's own DevTools too.
            </div>

            <div>
              <h3>Jest Integration</h3>
              We auto-detect and run Jest tests, showing results alongside your
              code.
            </div>

            <div>
              <h3>Error Overlay</h3>
              See errors clearly with our user-friendly overlay. We even give
              you suggestions on how to solve them when possible.
            </div>
            <div>
              <h3>External Previews</h3>
              Open your sandbox preview with a separate URL, but keep Hot Module
              Reloading.
            </div>
          </ContentBlock>
        </div>
        <div>
          <div>
            <Subtitle as="h2">Make It Yours</Subtitle>
          </div>

          <FeaturedImage
            css={`
              height: 468px;
              justify-content: center;

              ${props => props.theme.breakpoints.md} {
                height: auto;
              }


            `}
            bg={bg4}
          >
            <img
              src={makeityours}
              alt="make it yours"
              css={`
                width: 55rem;
                ${props => props.theme.breakpoints.md} {
                  margin-top:4rem;
                }
              `}
            />
          </FeaturedImage>

          <ContentBlock>
            <div>
              <h3>Configuration UI</h3>
              Edit config files for npm, Prettier, Netlify, Vercel, TypeScript,
              JavaScript, and your sandbox easily.
            </div>

            <div>
              <h3>Automatic Type Acquisition</h3>
              Typings are automatically downloaded for every dependency, so you
              always have autocompletions.
            </div>

            <div>
              <h3>Prettier</h3>
              Code automatically gets prettified on save according to your own
              Prettier preferences.
            </div>
            <div>
              <h3>Emmet</h3>
              You can quickly expand abbreviations with Emmet.io in all JS,
              HTML, and CSS files.
            </div>
            <div>
              <h3>TypeScript</h3>
              We show TypeScript autocompletions and diagnostics for TS
              sandboxes.
            </div>
            <div>
              <h3>ESLint</h3>
              All code is linted automatically using the latest version of
              ESLint.
            </div>
          </ContentBlock>
          
        </div>

      </div>




    </Wrapper>



    <CTA
         title="Code from anywhere"
         subtitle="Code online with no setup in a powerful IDE that feels like local."
         cta="Get Started"       
         link="/s"
    />


  </Layout>

  
);
