import React from 'react';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import Join from '../../screens/home/join';
import { Title } from '../../templates/_feature.elements';
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
  TeamOrIndividualWrapper,
  FeaturesTitle,
} from './_elements';

export default () => (
  <Layout>
    <TitleAndMetaTags title="Pricing - CodeSandbox" />
    <PageContainer width={1086}>
      <Title textCenter>Pricing</Title>
    </PageContainer>
    <TeamOrIndividualWrapper>
      <div>For individuals</div>
      <div />
      <div>For teams & businesses</div>
    </TeamOrIndividualWrapper>
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
            Prototype, interview, and collaborate on code with your entire team.
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

    <FeaturesTitle>Features</FeaturesTitle>
    <FeaturesTableHeader
      css={`
        margin-top: 0;
      `}
    >
      <span>Development & Prototyping</span>
      <span
        css={`
          text-align: center;
        `}
      >
        Community
      </span>
      <span
        css={`
          text-align: center;
        `}
      >
        Pro
      </span>
    </FeaturesTableHeader>
    <FeaturesTable>
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
        <span>✓</span>
        <span>✓</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Public Sandboxes</FeatureTitle>
          <P muted small>
            Sandboxes, both the app and code, are available publicly by default.
          </P>
        </div>
        <span>∞</span>
        <span>∞</span>
      </li>

      <li>
        <div>
          <FeatureTitle>Unlimited Private Sandboxes</FeatureTitle>
          <P muted small>
            Set a sandbox as private or unlisted so others can't see the code or
            the app.
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
    <FeaturesTableHeader>
      <span>Online IDE</span>
    </FeaturesTableHeader>
    <FeaturesTable>
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
            View logging and console output to see loading progress and debug
            issues.
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
    <FeaturesTableHeader inside>
      <span>Dev Tool Integrations</span>
    </FeaturesTableHeader>
    <FeaturesTable inside>
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
            Import and sync public repos, export a sandbox to a repo, or create
            commits and open PRs.
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
            Expand abbreviations with Emmet.io in all JS, HTML, and CSS files.
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
    </FeaturesTable>

    <FeaturesTableHeader inside>
      <span>Collaboration</span>
    </FeaturesTableHeader>
    <FeaturesTable inside>
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
    <FeaturesTableHeader inside>
      <span>Containers</span>
    </FeaturesTableHeader>
    <FeaturesTable inside>
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
    <FeaturesTableHeader inside>
      <span>Sandbox Config & Management</span>
    </FeaturesTableHeader>
    <FeaturesTable inside>
      <li>
        <div>
          <FeatureTitle>Dashboard</FeatureTitle>
          <P muted small>
            Organize sandboxes and templates. Search, sort, or modify multiple
            sandboxes at once.
          </P>
        </div>
        <span>✓</span>
        <span>✓</span>
      </li>
      <li>
        <div>
          <FeatureTitle>Configuration UI</FeatureTitle>
          <P muted small>
            Edit config files for npm, Prettier, Netlify, Vercel, TypeScript,
            JavaScript, and your sandbox.
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
            View storage usage and upload or delete files from one management
            screen.
          </P>
        </div>
        <span>✓</span>
        <span>✓</span>
      </li>
    </FeaturesTable>
    <FeaturesTableHeader>
      <span>Community</span>
    </FeaturesTableHeader>
    <FeaturesTable>
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
    <FeaturesTable
      css={`
        margin-top: 5.5rem;

        li {
          margin-top: 2rem;
        }
      `}
    >
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
    <Join />
  </Layout>
);
