import React from 'react';

import { motion } from 'framer-motion';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import hero from '../assets/images/hero.png';
import { ImageWrapper, Border } from '../screens/home/hero/elements';
import { P } from '../components/Typography';

import {
  Titles,
  Description,
  ArtWorkWrapper,
  MacBookWrapper,
  CreateSandbox,
  Title,
  Grid,
  IconWrapper,
  H6,
  BigTitles,
  JoinTitle,
} from './_ide.elements';
import TemplateUniverse from '../assets/images/TemplateUniverse.png';
import Github from '../assets/icons/GithubLarge';
import VSCode from '../assets/icons/VSCode';
import Deploy from '../assets/icons/Deploy';
import Collaborate from '../assets/icons/Collaborate';
import Terminal from '../assets/icons/Terminal';
import Debug from '../assets/icons/Debug';
import Heart from '../assets/icons/Heart';

export default () => (
  <Layout>
    <TitleAndMetaTags title="IDE - CodeSandbox" />
    <PageContainer width={1086}>
      <MacBookWrapper>
        <ImageWrapper>
          <motion.div
            initial={{ opacity: 0, y: 140 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 1,
              ease: 'easeOut',
            }}
          >
            <Title as="h1">An Online IDE for Rapid Web Development</Title>
            <CreateSandbox href="/s">Create a Sandbox, it’s free</CreateSandbox>
          </motion.div>
          <motion.img
            initial={{ opacity: 1, y: 120, boxShadow: '0 0 0 #040404' }}
            animate={{ opacity: 0.4, y: 0, boxShadow: '0 -4px 20px #040404' }}
            transition={{
              duration: 1,
              ease: 'easeOut',
            }}
            src={hero}
            alt="browser showing codesandbox running"
          />
        </ImageWrapper>
      </MacBookWrapper>
      <Titles>Get Started</Titles>
      <Description>
        Quickly Use templates to kickstart new projects with no setup
      </Description>
    </PageContainer>
    <ArtWorkWrapper bg="#535bcf">
      <img src={TemplateUniverse} alt="Template Universe" />
    </ArtWorkWrapper>
    <Grid>
      <div>
        <H6>Start From an Official Template</H6>
        We've templates for all popular frameworks, from React, Vue, and
        Angular, to Apollo, Gatsby, Next, and others.
      </div>
      <div>
        <H6>Community-created Starting Points</H6>
        Use templates made by the community. Bookmark those you find useful to
        get started with one click.
      </div>
      <div>
        <H6>Make Your Own Templates</H6>
        Create templates for your specific use-case with the configuration, file
        structure, and dependencies you need.
      </div>
    </Grid>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Titles>Use With Your Fave Dev Tools</Titles>
      <Description>
        We integrate with the tools you already use for a seamless development
        experience
      </Description>
      <Grid>
        <div>
          <IconWrapper>
            <Github />
          </IconWrapper>
          <BigTitles>Integrated with GitHub</BigTitles>
          <P muted center>
            {' '}
            Paste your GitHub URL and get a sandbox that syncs. Or export your
            sandbox to a GitHub repo, create commits, or open PRs.
          </P>
        </div>
        <div>
          <IconWrapper>
            <Deploy />
          </IconWrapper>
          <BigTitles>Deploy to ZEIT or Netlify</BigTitles>
          <P muted center>
            {' '}
            Deploy a production version of your sandbox with ZEIT Now or
            Netlify.
          </P>
        </div>
        <div>
          <IconWrapper>
            <VSCode />
          </IconWrapper>
          <BigTitles>Powered by VS Code</BigTitles>
          <P muted center>
            {' '}
            Leverage the power and familiarity of VS Code. Use "Go to
            Definition," "Replace Occurrences," and set a custom theme.
          </P>
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Titles>Prototype Rapidly</Titles>
      <ArtWorkWrapper bg="#535bcf" />
      <Grid>
        <div>
          <H6>NPM Support</H6>
          Add any of the 1M+ dependencies on npm directly from the editor.
        </div>
        <div>
          <H6>Hot Module Reloading</H6>
          With Hot Module Reloading built-in, you can see changes as you make
          them.
        </div>
        <div>
          <H6>Keybindings and Quick Actions</H6>
          Use Keybindings and Quick Actions to perform common tasks speedily.
        </div>
        <div>
          <H6>Shareable Links</H6>
          Every sandbox has a secure URL with HTTPS support for sharing and
          feedback.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Collaborate
        css={`
          margin: auto;
          display: block;
          margin-bottom: 1rem;
        `}
      />
      <Titles>Collaborate on Code</Titles>
      <ArtWorkWrapper bg="#EB455A" />
      <Grid>
        <div>
          <H6>Go Live</H6>
          With Live, you can work on code and edit sandboxes together in
          real-time.
        </div>
        <div>
          <H6>Inline Chat</H6>
          Chat with collaborators about the code you're all working on.
        </div>
        <div>
          <H6>Classroom Mode</H6>
          Use Classroom Mode to control who can make edits or watch.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Terminal
        css={`
          margin: auto;
          display: block;
          margin-bottom: 1rem;
        `}
      />
      <Titles>Work With Containers</Titles>
      <ArtWorkWrapper bg="#535BCF" />
      <Grid>
        <div>
          <H6>Create Full-stack Web Apps</H6>
          Create back-end as well as front-end applications using Node.js.
        </div>
        <div>
          <H6>A Secure Server Control Panel</H6>
          Restart the sandbox or server, use multiple ports, and add secrets
          securely.
        </div>
        <div>
          <H6>Terminal Access</H6>
          Run scripts and commands from a terminal built directly into the
          editor.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Debug
        css={`
          margin: auto;
          display: block;
          margin-bottom: 1rem;
        `}
      />
      <Titles>Debug Like a Pro</Titles>
      <ArtWorkWrapper bg="#EB455A" />
      <Grid>
        <div>
          <H6>DevTools</H6>
          Tools like a console, test view, and a problem viewer are in the
          preview, alongside React's own DevTools.
        </div>
        <div>
          <H6>Jest Integration</H6>
          We auto-detect and run Jest tests, showing results next to your code.
        </div>
        <div>
          <H6>Error Overlay</H6>
          See errors clearly with our user-friendly overlay and suggestions on
          how to solve them.
        </div>
        <div>
          <H6>External Previews</H6>
          Open your sandbox preview with a separate URL but keep Hot Module
          Reloading.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Titles
        css={`
          margin-bottom: 6rem;
        `}
      >
        Manage Sandboxes with Ease
      </Titles>
      <Grid>
        <div>
          <H6>Dashboard</H6>
          Organize sandboxes and templates. Search, sort, and filter them. Add
          them to folders or modify multiple sandboxes at once.
        </div>
        <div>
          <H6>Static File Hosting</H6>
          Serve all files statically from the public folder, depending on the
          template.
        </div>
        <div>
          <H6>Public, Private or Unlisted</H6>
          Share sandboxes with the world, or set a sandbox to be private or
          unlisted to hide it from others.
        </div>
        <div>
          <H6>Export to Zip</H6>
          You can always download your sandbox as a zip if you want to continue
          locally.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
      `}
    >
      <Heart
        css={`
          margin: auto;
          display: block;
          margin-bottom: 1rem;
        `}
      />
      <Titles
        css={`
          margin-bottom: 6rem;
        `}
      >
        Make It Yours
      </Titles>
      <Grid>
        <div>
          <H6>Configuration UI</H6>
          Edit config files for npm, Prettier, Netlify, Now, TypeScript,
          JavaScript, and your sandbox easily.
        </div>
        <div>
          <H6>Automatic Type Acquisition</H6>
          Typings are automatically downloaded for every dependency, so you
          always have autocompletions.
        </div>
        <div>
          <H6>Prettier</H6>
          Code automatically gets prettified on save according to your own
          Prettier preferences.
        </div>
        <div>
          <H6>Emmet.io</H6>
          You can quickly expand abbreviations with Emmet.io in all JS, HTML,
          and CSS files.
        </div>
        <div>
          <H6>TypeScript</H6>
          We show TypeScript autocompletions and diagnostics for TS sandboxes.
        </div>
        <div>
          <H6>ESLint</H6>
          All code is linted automatically using the latest version of ESLint.
        </div>
      </Grid>
    </div>
    <Border />
    <div
      css={`
        margin-top: calc(6.875rem * 2);
        display: flex;
        align-items: center;
        flex-direction: column;
      `}
    >
      <JoinTitle>Join millions of people prototyping what’s next</JoinTitle>
      <CreateSandbox
        css={`
          top: 0;
          margin-bottom: 12rem;
        `}
        href="/s"
      >
        Create a Sandbox, it’s free
      </CreateSandbox>
    </div>
  </Layout>
);
