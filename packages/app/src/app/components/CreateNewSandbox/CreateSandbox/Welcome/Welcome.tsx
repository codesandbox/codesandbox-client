import React from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { CodeAnywhere } from './CodeAnywhere';
import { StartQuickly } from './StartQuickly';
import { PrototypeRapidly } from './PrototypeRapidly';
import { Header } from '../elements';
import { Features, FeatureName, FeatureText, Actions } from './elements';

export const Welcome = ({ goToTab }: { goToTab: (event: any) => void }) => (
  <>
    <Header>
      <span>Welcome to CodeSandbox</span>
    </Header>
    <Features>
      <li>
        <CodeAnywhere />
        <FeatureName>Code Anywhere</FeatureName>
        <FeatureText>
          An instantly ready, full-featured online IDE for web development on
          any device with a browser.
        </FeatureText>
      </li>
      <li>
        <StartQuickly />
        <FeatureName>Start Quickly</FeatureName>
        <FeatureText>
          With no setup, and templates for all popular frameworks to get you
          started quickly.
        </FeatureText>
      </li>
      <li>
        <PrototypeRapidly />
        <FeatureName>Prototype Rapidly</FeatureName>
        <FeatureText>
          You can create web apps, experiment with code, test ideas, and share
          creations easily.
        </FeatureText>
      </li>
    </Features>
    <Actions>
      <Button onClick={goToTab}>Create Sandbox</Button>
    </Actions>
  </>
);
