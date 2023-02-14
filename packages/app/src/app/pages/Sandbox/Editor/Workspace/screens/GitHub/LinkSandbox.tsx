import React from 'react';
import { ForkedSandbox } from '@codesandbox/common/lib/types';
import { Button, Collapsible, Element, Text } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';

type LinkSandboxProps = {
  disabled?: boolean;
  upstreamSandbox: ForkedSandbox;
};
export const LinkSandbox: React.FC<LinkSandboxProps> = ({
  disabled,
  upstreamSandbox,
}) => {
  const {
    git: { linkToGitSandbox },
  } = useActions();
  const {
    git: { isLinkingToGitSandbox },
    editor: { currentSandbox },
  } = useAppState();

  return (
    <Collapsible title="Link to GitHub repository" defaultOpen={!disabled}>
      <Element
        css={{
          opacity: disabled ? 0.6 : 1,
        }}
        paddingX={2}
      >
        <Text variant="muted">If you wish to contribute back to</Text>{' '}
        {upstreamSandbox.git.username}/{upstreamSandbox.git.repo}
        <Text variant="muted">
          , you can link this sandbox to the GitHub repository. This will allow
          you to create commits and open pull requests with this sandbox.
        </Text>
        <Button
          // Using aria-disabled to have the affordance without
          // affecting the styles.
          aria-disabled={disabled}
          marginTop={4}
          onClick={() => {
            if (disabled) {
              return;
            }

            linkToGitSandbox(currentSandbox.id);
          }}
          loading={isLinkingToGitSandbox}
        >
          Link Sandbox
        </Button>
      </Element>
    </Collapsible>
  );
};
