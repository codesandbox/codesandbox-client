import React from 'react';
import styled from 'styled-components';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Centered from '@codesandbox/common/lib/components/flex/Centered';

import ExternalIcon from 'react-icons/lib/md/launch';
import HotModuleReloading from 'react-icons/lib/md/autorenew';
import Download from 'react-icons/lib/md/file-download';
import CLI from 'react-icons/lib/md/file-upload';
import StaticFile from 'react-icons/lib/md/insert-photo';
import ErrorOverlay from 'react-icons/lib/go/alert';
import AtA from 'react-icons/lib/md/cloud-download';
import Private from 'react-icons/lib/md/visibility-off';
import GitHubIcon from 'react-icons/lib/go/mark-github';
import Prettify from 'react-icons/lib/md/brush';
import DevTools from 'react-icons/lib/go/terminal';
import LiveIcon from 'react-icons/lib/md/wifi-tethering';
import KeyboardIcon from 'react-icons/lib/md/keyboard';

import Jest from './Jest';
import VSCode from './VSCode';
import TypeScript from './TypeScript';
import OpenSource from './OpenSource';
import ESLint from './ESLint';
import Emmet from './Emmet';
import ConfigurationIcon from './ConfigurationIcon';

import { Background, Heading, SubHeading } from '../../../components/style';

import Feature from './Feature';

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin-top: 2rem;
  margin-bottom: 6rem;
  margin-left: 0;
  list-style: none;
`;

export default () => (
  <Background as="section" aria-labelledby="there-more">
    <MaxWidth width={1280}>
      <Centered horizontal>
        <Heading id="there-more">
          There
          {"'"}s more
        </Heading>
        <SubHeading
          aria-label="This is just the tip of the iceberg. There are many more things to
          explore, if you are missing anything you can always open an issue on GitHub"
        >
          This is just the tip of the iceberg. There are many more things to
          explore, if you are missing anything you can always open an issue on{' '}
          <a
            style={{ color: 'white' }}
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/codesandbox/codesandbox-client/issues"
          >
            GitHub
          </a>
          .
        </SubHeading>
      </Centered>

      <Features as="ul">
        <Feature
          Icon={LiveIcon}
          title="Live Collaboration"
          description="Edit sandboxes together in real time, Google Docs style. Use Classroom Mode to control who can make edits."
          as="li"
        />
        <Feature
          Icon={Jest}
          title="Jest Integration"
          description="We automatically run Jest tests and show the results with an intuitive UI."
          as="li"
        />
        <Feature
          Icon={KeyboardIcon}
          title="Keybindings and Quick Actions"
          description="Use Keybindings and Quick Actions to execute commonly used actions more quickly."
          as="li"
        />
        <Feature
          Icon={ConfigurationIcon}
          title="Configuration UI"
          description="We show a UI for configuration files so you don't have to look up how the configuration is structured."
          as="li"
        />
        <Feature
          Icon={GitHubIcon}
          title="Export to GitHub"
          description="All sandboxes can easily be exported to a GitHub repository."
          as="li"
        />
        <Feature
          Icon={StaticFile}
          title="Static File Hosting"
          description="The development server will serve all files statically from the public folder, depending on the template."
          as="li"
        />
        <Feature
          Icon={DevTools}
          title="Integrated DevTools"
          description="The preview window has integrated DevTools, like a console, test view and a problem viewer."
          as="li"
        />
        <Feature
          Icon={Private}
          patron
          title="Private/Unlisted Sandboxes"
          description="You can set a sandbox to private or unlisted to make sure others cannot see or find it."
          as="li"
        />
        <Feature
          Icon={ExternalIcon}
          title="Externally Hosted Previews"
          description="You can open your sandbox preview with a separate URL, while still keeping Hot Module Reloading."
          as="li"
        />
        <Feature
          Icon={VSCode}
          title="Monaco Editor"
          description={`We use the same editor as VSCode, which gives us "Go to Definition", "Replace Occurences" and more!`}
          as="li"
        />
        <Feature
          Icon={HotModuleReloading}
          title="Hot Module Reloading"
          description="Hot Module Reloading is built in, so you won't have to press refresh for every change."
          as="li"
        />
        <Feature
          Icon={ErrorOverlay}
          title="Error Overlay"
          description="We show a user friendly error overlay for every error, sometimes with suggestions on how to solve it."
          as="li"
        />
        <Feature
          Icon={AtA}
          title="Automatic Type Acquisition"
          description="Typings are automatically downloaded for every dependency, so you always have autocompletions."
          as="li"
        />
        <Feature
          Icon={TypeScript}
          title="TypeScript"
          description="Thanks to Monaco we show TypeScript autocompletions and diagnostics for TS sandboxes."
          as="li"
        />
        <Feature
          Icon={Prettify}
          title="Prettier"
          description="Code automatically gets prettified on save according to your own Prettier preferences."
          as="li"
        />
        <Feature
          Icon={ESLint}
          title="ESLint"
          description={
            <span aria-label="All code is linted automatically using latest version of ESLint, with full ES6 support.">
              All code is linted automatically using latest version of{' '}
              <a
                href="https://eslint.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ESLint
              </a>
              , with full ES6 support.
            </span>
          }
          as="li"
        />
        <Feature
          Icon={Emmet}
          title="Emmet.io"
          description={
            <span aria-label="You can easily expand abbreviations with Emmet.io in all JS, HTML and CSS files.">
              You can easily expand abbreviations with{' '}
              <a
                href="https://emmet.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Emmet.io
              </a>{' '}
              in all JS, HTML and CSS files.
            </span>
          }
          as="li"
        />

        <Feature
          Icon={OpenSource}
          title="Open Source"
          description={
            <span
              aria-label="we're almost fully open source! Our most active repository can be
              found here."
            >
              We
              {"'"}
              re almost fully open source! Our most active repository can be
              found{' '}
              <a
                href="https://github.com/codesandbox/codesandbox-client"
                target="_blank"
                rel="noreferrer noopener"
              >
                here.
              </a>
            </span>
          }
          as="li"
        />
        <Feature
          Icon={CLI}
          title="Import with CLI"
          description={
            <span aria-label="You can export a local project to CodeSandbox easily using codesandbox-cli">
              You can export a local project to CodeSandbox easily using{' '}
              <a
                href="https://github.com/codesandbox-app/codesandbox-importers/tree/master/packages/cli"
                rel="noopener noreferrer"
                target="_blank"
              >
                codesandbox-cli
              </a>
              .
            </span>
          }
          as="li"
        />
        <Feature
          Icon={Download}
          title="Export To Zip"
          description="You can always download a zip from your sandbox for if you want to continue locally."
          as="li"
        />
      </Features>
    </MaxWidth>
  </Background>
);
