import * as React from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import styled, { keyframes } from 'styled-components';
import css from '@styled-system/css';
import { Link } from 'react-router-dom';

import { Button, Text } from '@codesandbox/components';
import { Badge } from './shared';

const transitions = {
  slide: keyframes({
    from: {
      opacity: 0,
      transform: 'translateY(-2px) translateX(calc(-50% + 14px))',
    },
  }),
};

const TooltipBody = styled.div`
  padding: 20px;
  width: 144px;

  text-align: center;
  display: none;

  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(calc(-50% + 14px));
  z-index: 10;

  background: ${({ theme }) => theme.colors.grays['600']};
  border-radius: 4px;

  &:after {
    content: '';
    border: 6px solid transparent;
    border-bottom-color: ${({ theme }) => theme.colors.grays['600']};
    height: 0;
    width: 0;
    position: absolute;
    left: calc(50% - 6px);
    top: -12px;
  }
`;

const ToolTip = styled.div`
  position: relative;

  &:hover ${TooltipBody} {
    animation: ${transitions.slide} 150ms ease-out;
    display: block;
  }
`;

const UpgradeToolTip: React.FC = () => (
  <ToolTip>
    <Badge css={css({ backgroundColor: 'blues.600' })}>Free</Badge>

    <TooltipBody
      onMouseEnter={() => track('Editor - Mouse enter tooltip upgrade')}
    >
      <Text
        as="p"
        block
        align="center"
        marginBottom={2}
        marginTop={0}
        size={4}
        weight="bold"
      >
        Upgrade now
      </Text>
      <Text as="p">Get Private Sandboxes, Private github repos, and more.</Text>

      <Link
        to="/pro"
        target="_blank"
        onClick={() => track('Editor - Click tooltip upgrade')}
      >
        <Button marginTop={3} css={css({ borderRadius: 99999 })}>
          Upgrade
        </Button>
      </Link>
    </TooltipBody>
  </ToolTip>
);

export { UpgradeToolTip };
