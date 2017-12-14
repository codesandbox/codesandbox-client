import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'common/components/flex/MaxWidth';
import Centered from 'common/components/flex/Centered';

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

import VSCode from './VSCode';
import TypeScript from './TypeScript';
import OpenSource from './OpenSource';
import ESLint from './ESLint';
import Emmet from './Emmet';

import { Background, Heading, SubHeading } from '../../../components/style';

import Feature from './Feature';

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;

  margin-top: 2rem;
  margin-bottom: 6rem;
`;

export default () => (
  <Background>
    <MaxWidth width={1280}>
      <Centered horizontal>
        <Heading>There{"'"}s more</Heading>
        <SubHeading>
          This was just the tip of the iceberg. There are many more things to
          explore, if you are missing anything you can always open an issue on{' '}
          <a
            style={{ color: 'white' }}
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/CompuIves/codesandbox-client/issues"
          >
            GitHub
          </a>.
        </SubHeading>
      </Centered>

      <Features>
        <Feature
          Icon={GitHubIcon}
          newFeature
          title="Export to GitHub"
          description="All sandboxes can easily be exported to a GitHub repository."
        />
        <Feature
          Icon={StaticFile}
          newFeature
          title="Static File Hosting"
          description="The development server will serve all files statically from the public folder, depending on the template."
        />
        <Feature
          Icon={DevTools}
          newFeature
          title="Integrated DevTools"
          description="The preview window has integrated DevTools, like a console. There are more DevTools underway."
        />
        <Feature
          Icon={Private}
          patron
          title="Private/Unlisted Sandboxes"
          description="You can set a sandbox to private or unlisted to make sure others cannot see or find it."
        />
        <Feature
          Icon={ExternalIcon}
          title="Externally Hosted Previews"
          description="You can open your sandbox preview with a separate URL, while still keeping Hot Module Reloading."
        />
        <Feature
          Icon={VSCode}
          title="Monaco Editor"
          description={`We use the same editor as VSCode, which gives us "Go to Definition", "Replace Occurences" and more!`}
        />
        <Feature
          Icon={HotModuleReloading}
          title="Hot Module Reloading"
          description="Hot Module Reloading is built in, so you won't have to press refresh for every change."
        />
        <Feature
          Icon={ErrorOverlay}
          title="Error Overlay"
          description="We show a user friendly error overlay for every error, sometimes with suggestions on how to solve it."
        />
        <Feature
          Icon={AtA}
          title="Automatic Type Acquisition"
          description="Typings are automatically downloaded for every dependency, so you always have autocompletions."
        />
        <Feature
          Icon={TypeScript}
          title="TypeScript"
          description="Thanks to Monaco we show TypeScript autocompletions and diagnostics for TS sandboxes."
        />
        <Feature
          Icon={Prettify}
          title="Prettier"
          description="Code automatically gets prettified on save according to your own Prettier preferences."
        />
        <Feature
          Icon={ESLint}
          title="ESLint"
          description={
            <span>
              All code is linted automatically using latest version of{' '}
              <a
                href="https://eslint.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                ESLint
              </a>, with full ES6 support.
            </span>
          }
        />
        <Feature
          Icon={Emmet}
          title="Emmet.io"
          description={
            <span>
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
        />

        <Feature
          Icon={OpenSource}
          title="Open Source"
          description={
            <span>
              We{"'"}re almost fully open source! Our most active repository can
              be found{' '}
              <a
                href="https://github.com/CompuIves/codesandbox-client"
                target="_blank"
                rel="noreferrer noopener"
              >
                here.
              </a>
            </span>
          }
        />
        <Feature
          Icon={CLI}
          title="Import with CLI"
          description={
            <span>
              You can export a local project to CodeSandbox easily using{' '}
              <a
                href="https://github.com/codesandbox-common/cli"
                rel="noopener noreferrer"
                target="_blank"
              >
                codesandbox-cli
              </a>.
            </span>
          }
        />
        <Feature
          Icon={Download}
          title="Export To Zip"
          description="You can always download a zip from your sandbox for if you want to continue locally."
        />
      </Features>
    </MaxWidth>
  </Background>
);
