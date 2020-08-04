import { Collapsible, Element, Text } from '@codesandbox/components';
import { ImportFromGithub } from 'app/components/CreateNewSandbox/CreateSandbox/Import/Import';
import React from 'react';

export const ImportRepo: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <Collapsible title="Import from GitHub" defaultOpen={isOpen}>
    <Element paddingX={2}>
      <Text variant="muted" marginBottom={4} block>
        Enter the URL to your GitHub repository to generate a URL to your
        sandbox. The sandbox will stay in sync with your repository.
      </Text>
      <ImportFromGithub />
    </Element>
  </Collapsible>
);
