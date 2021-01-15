import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { P } from '../../components/Typography';
import {
  Card,
  CardTitle,
  Price,
  PriceSubText,
  List,
  Button,
  FeaturesTableHeader,
  FeaturesTable,
  FeatureTitle,
  CardContainer,
} from './_elements';

import { Title } from '../../components/LayoutComponents';

export default () => {
  const [open, setOpen] = useState({});

  const toggleTable = name => {
    setOpen(o => ({ ...o, [name]: !o[name] }));
  };

  const OpenIcon = ({ open: openTable }) => (
    <motion.svg
      initial={{ transform: 'rotate(90deg)' }}
      animate={{ transform: `rotate(${openTable ? 0 : 90}deg)` }}
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.03394 9.16661C6.7723 9.5296 6.19871 9.51329 5.96082 9.13608L0.99817 1.26742C0.746349 0.868135 1.0519 0.362543 1.54503 0.362543L6.47188 0.362544L12.1793 0.362544C12.6897 0.362544 12.9922 0.900233 12.7055 1.29794L7.03394 9.16661Z"
        fill="white"
      />
    </motion.svg>
  );

  return (
    <Layout>
      <TitleAndMetaTags title="Pricing - CodeSandbox" />
      <PageContainer width={1086}>
        <Title
          css={`
            font-size: 64px;
            max-width: 802px;
            margin: auto;
            line-height: 76px;
            margin-bottom: 76px;
            margin-top: 40px;
          `}
        >
          Choose a plan that's right for you
        </Title>
      </PageContainer>
      <div>
        <div>For individuals</div>
        <div />
        <div>For teams & businesses</div>
      </div>
      <CardContainer>
        <Card dark>
          <div>
            <CardTitle>Community</CardTitle>
            <Price
              css={`
                min-height: 72px;
              `}
            >
              Free
            </Price>
            <List>
              <li>
                <span>✓</span> Development & Prototyping
              </li>{' '}
              <li>
                <span>✓</span> Online IDE{' '}
              </li>
              <li>
                <span>✓</span> Embeds{' '}
              </li>
              <li>
                <span>✓</span> CodeSandbox CI{' '}
              </li>
              <li>
                <span>✓</span> Teams
              </li>
            </List>
          </div>
          <Button href="/s">Create Sandbox, it’s free </Button>
        </Card>
        <Card>
          <div>
            <CardTitle>Pro</CardTitle>
            <div style={{ minHeight: 72 }}>
              <Price style={{ marginBottom: '0.5rem' }}>$9/Month</Price>
              <PriceSubText>billed annually or $12 month-to-month</PriceSubText>
            </div>
            <List
              css={`
                color: white;
              `}
            >
              <li
                css={`
                  margin-bottom: 2rem;
                `}
              >
                Everything in Community, plus:
              </li>
              <li>+ Unlimited Private Sandboxes </li>
              <li>+ Private GitHub Repos</li>
            </List>
          </div>
          <Button white href="/pro">
            Subscribe to Pro
          </Button>
        </Card>
        <Card
          css={`
            background: #5962df;
          `}
        >
          <div>
            <CardTitle>Pro Workspaces</CardTitle>
            <Price
              css={`
                min-height: 72px;
              `}
            >
              Join the waitlist
            </Price>
            <List
              as="section"
              css={`
                color: white;
                font-size: 16px;
                margin: 0 auto;
                ${props => props.theme.breakpoints.xl} {
                  max-width: 298px;
                  text-align: center;
                }
              `}
            >
              Prototype, interview, and collaborate on code with your entire
              team.
              <br />
              <br />
              Manage and work on sandboxes collectively — get feedback, or code
              together.
              <br />
              <br />
              Currently in closed beta.
            </List>
          </div>
          <Button
            white
            href="https://airtable.com/shrlgLSJWiX8rYqyG"
            css={{
              color: '#5962df',
            }}
          >
            Get early access
          </Button>
        </Card>
      </CardContainer>

      <Title
        as="h2"
        css={`
          font-size: 33px;
          margin-top: 70px;
          margin-bottom: 48px;
          text-align: left;
        `}
      >
        Compare plans & features
      </Title>
      <FeaturesTableHeader
        onClick={() => toggleTable('Development')}
        css={`
          margin-top: 0;
        `}
      >
        <span>Prototyping</span>
        <OpenIcon open={open.Development} />
      </FeaturesTableHeader>

      <FeaturesTable
        as={motion.div}
        initial={{ height: 0 }}
        animate={{ height: `${open.Development ? 'auto' : 0}` }}
        open={open.Development}
      >
        <FeaturesTableHeader
          as="div"
          css={`
            margin-top: 0;
            display: grid;
          `}
        >
          <span />
          <span
            css={`
              text-align: center;
              padding-left: 20px;
            `}
          >
            Personal
          </span>
          <span
            css={`
              text-align: center;
              font-weight: bold;
              font-size: 19px;
              line-height: 23px;
              color: #0971f1;
            `}
          >
            Personal Pro Workspace
          </span>
        </FeaturesTableHeader>
        <li>
          <div>
            <FeatureTitle>Templates</FeatureTitle>
            <P muted small>
              Start from an official template, or create your own.
            </P>
          </div>
          <span>✓</span>
          <span>✓</span>
        </li>

        <li>
          <div>
            <FeatureTitle>Static File Hosting</FeatureTitle>
            <P muted small>
              All static files served via CDN.
            </P>
          </div>
          <span className="text">20Mb total, 7Mb upload</span>
          <span className="text">500Mb total, 30Mb upload</span>
        </li>

        <li>
          <div>
            <FeatureTitle>Public Sandboxes</FeatureTitle>
            <P muted small>
              Sandboxes, both the app and code, are available publicly by
              default.
            </P>
          </div>
          <span>∞</span>
          <span>∞</span>
        </li>

        <li>
          <div>
            <FeatureTitle>Unlimited Private Sandboxes</FeatureTitle>
            <P muted small>
              Set a sandbox as private or unlisted so others can't see the code
              or the app.
            </P>
          </div>
          <span />
          <span>✓</span>
        </li>

        <li>
          <div>
            <FeatureTitle>Private GitHub Repos</FeatureTitle>
            <P muted small>
              Import and sync repos which are private on GitHub to CodeSandbox.
            </P>
          </div>
          <span />
          <span>✓</span>
        </li>
      </FeaturesTable>
      <FeaturesTableHeader onClick={() => toggleTable('Community')}>
        <span>Community</span>
        <OpenIcon open={open.Community} />
      </FeaturesTableHeader>
      <FeaturesTable
        as={motion.div}
        initial={{ height: 0 }}
        animate={{ height: `${open.Community ? 'auto' : 0}` }}
        open={open.Community}
      >
        <li>
          <div>
            <FeatureTitle>Public Profile</FeatureTitle>
            <P muted small>
              A personal portfolio page highlighting your best sandboxes.
            </P>
          </div>
          <span>✓</span>
          <span>✓</span>
        </li>
        <li>
          <div>
            <FeatureTitle>Sandbox Search</FeatureTitle>
            <P muted small>
              Search public sandboxes and filter by dependency, environment, and
              tag.
            </P>
          </div>
          <span>✓</span>
          <span>✓</span>
        </li>
        <li>
          <div>
            <FeatureTitle>Explore</FeatureTitle>
            <P muted small>
              Hand-picked sandboxes highlighting the best recent community
              creations.
            </P>
          </div>
          <span>✓</span>
          <span>✓</span>
        </li>
      </FeaturesTable>

      <div>
        <FeaturesTableHeader onClick={() => toggleTable('Platform')}>
          <span>Platform</span>
          <OpenIcon open={open.Platform} />
        </FeaturesTableHeader>
        <FeaturesTable
          as={motion.div}
          initial={{ height: 0 }}
          animate={{ height: `${open.Platform ? 'auto' : 0}` }}
          open={open.Platform}
        >
          <li>
            <div>
              <FeatureTitle>VS Code powered Editor</FeatureTitle>
              <P muted small>
                Leverage the power and familiarity of VS Code.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Hot Module Reloading</FeatureTitle>
              <P muted small>
                See changes as you make them.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Keybindings & Quick Actions</FeatureTitle>
              <P muted small>
                Perform common tasks speedily.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Console</FeatureTitle>
              <P muted small>
                View logging and console output to see loading progress and
                debug issues.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Test Viewer</FeatureTitle>
              <P muted small>
                Showing test results alongside your code.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Problem Viewer</FeatureTitle>
              <P muted small>
                See errors clearly with our user-friendly overlay.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Zen Mode</FeatureTitle>
              <P muted small>
                Zen mode hides distracting editor elements for demos and
                screenshots.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Custom Themes</FeatureTitle>
              <P muted small>
                Tweak theme styles with support for all VS Code themes.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Vim Mode</FeatureTitle>
              <P muted small>
                Vim emulation in the editor, powered by the VSCodeVim extension.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Type Acquisition</FeatureTitle>
              <P muted small>
                Typings automatically downloaded for every dependency.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>External Resources</FeatureTitle>
              <P muted small>
                Automatically include external resources, like CSS or JS files.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Session Restore</FeatureTitle>
              <P muted small>
                Recover un-saved changes between sessions.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>External Previews</FeatureTitle>
              <P muted small>
                Open sandbox previews on a separate URL but with Hot Module
                Reloading.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
        </FeaturesTable>
        <FeaturesTableHeader
          inside
          css={`
            display: ${open.Platform ? 'block' : 'none'};
          `}
        >
          <span>Dev Tool Integrations</span>
        </FeaturesTableHeader>
        <FeaturesTable>
          <li>
            <div>
              <FeatureTitle>NPM Packages</FeatureTitle>
              <P muted small>
                Add any of the 1M+ dependencies on npm directly from the editor.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>GitHub</FeatureTitle>
              <P muted small>
                Import and sync public repos, export a sandbox to a repo, or
                create commits and open PRs.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Vercel Deploy</FeatureTitle>
              <P muted small>
                Deploy a production version of your sandbox to Vercel.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Netlify Deploy</FeatureTitle>
              <P muted small>
                Deploy a production version of your sandbox to Netlify.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Jest</FeatureTitle>
              <P muted small>
                Auto-detect and run Jest tests.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>React DevTools</FeatureTitle>
              <P muted small>
                Integration of React’s own DevTools into the editor.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Prettier</FeatureTitle>
              <P muted small>
                Code gets prettified on save according to preferences.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>ESLint</FeatureTitle>
              <P muted small>
                Code is linted automatically.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Emmet</FeatureTitle>
              <P muted small>
                Expand abbreviations with Emmet.io in all JS, HTML, and CSS
                files.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Stackbit</FeatureTitle>
              <P muted small>
                Import projects generated by Stackbit.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Embeds</FeatureTitle>
              <P muted small>
                Embed sandboxes in docs, blog posts, and websites.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>CodeSandbox CI</FeatureTitle>
              <P muted small>
                A GitHub integration that auto-builds from pull requests.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Workspaces</FeatureTitle>
              <P muted small>
                View, edit, and manage sandboxes with a team.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
        </FeaturesTable>

        <FeaturesTableHeader
          inside
          css={`
            display: ${open.Platform ? 'block' : 'none'};
          `}
        >
          <span>Collaboration</span>
        </FeaturesTableHeader>
        <FeaturesTable>
          <li>
            <div>
              <FeatureTitle>Live Mode</FeatureTitle>
              <P muted small>
                Work on code and edit sandboxes with multiple people.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>In-editor Chat</FeatureTitle>
              <P muted small>
                Chat with collaborators about the code you're all working on.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Classroom Mode</FeatureTitle>
              <P muted small>
                Use Classroom Mode to control who can make edits or watch.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Shareable Links</FeatureTitle>
              <P muted small>
                Per sandbox URL with HTTPS support for secure project sharing.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
        </FeaturesTable>
        <FeaturesTableHeader
          inside
          css={`
            display: ${open.Platform ? 'block' : 'none'};
          `}
        >
          <span>Containers</span>
        </FeaturesTableHeader>
        <FeaturesTable>
          <li>
            <div>
              <FeatureTitle>Server Sandboxes</FeatureTitle>
              <P muted small>
                Create full-stack web apps and use Node packages.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Terminal</FeatureTitle>
              <P muted small>
                Run scripts and commands from a terminal.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Server Control Panel</FeatureTitle>
              <P muted small>
                Restart the sandbox or server.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Multiple Ports</FeatureTitle>
              <P muted small>
                Container apps can listen on one or more ports simultaneously.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Secrets</FeatureTitle>
              <P muted small>
                Hide sensitive information in your app and access them via
                environment variables.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
        </FeaturesTable>
        <FeaturesTableHeader
          inside
          css={`
            display: ${open.Platform ? 'block' : 'none'};
          `}
        >
          <span>Sandbox Config & Management</span>
        </FeaturesTableHeader>
        <FeaturesTable>
          <li>
            <div>
              <FeatureTitle>Dashboard</FeatureTitle>
              <P muted small>
                Organize sandboxes and templates. Search, sort, or modify
                multiple sandboxes at once.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Configuration UI</FeatureTitle>
              <P muted small>
                Edit config files for npm, Prettier, Netlify, Vercel,
                TypeScript, JavaScript, and your sandbox.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Export Zip</FeatureTitle>
              <P muted small>
                Download your sandbox as a zip.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Import CLI </FeatureTitle>
              <P muted small>
                Import a local project to CodeSandbox easily.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Define API </FeatureTitle>
              <P muted small>
                Programmatically create sandboxes via an API.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
          <li>
            <div>
              <FeatureTitle>Storage Management </FeatureTitle>
              <P muted small>
                View storage usage and upload or delete files from one
                management screen.
              </P>
            </div>
            <span>✓</span>
            <span>✓</span>
          </li>
        </FeaturesTable>
      </div>
    </Layout>
  );
};
