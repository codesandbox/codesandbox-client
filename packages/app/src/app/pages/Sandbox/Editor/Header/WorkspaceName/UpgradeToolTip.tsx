import * as React from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Link } from 'react-router-dom';
import { Button, Text } from '@codesandbox/components';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';

import { Badge } from './shared';

const TooltipBody = styled.div`
  padding: 10px;
  width: 164px;
  text-align: center;
`;

const UpgradeToolTip: React.FC = () => (
  <SingletonTooltip interactive delay={[0, 600]}>
    {singleton => (
      <Tooltip
        singleton={singleton}
        content={
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
              Upgrade Now
            </Text>
            <Text as="p">
              Get private sandboxes, private GitHub repos, and more.
            </Text>

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
        }
      >
        <Badge
          css={css({
            backgroundColor: 'button.background',
            color: 'button.foreground',
            cursor: 'pointer',
          })}
        >
          Free
        </Badge>
      </Tooltip>
    )}
  </SingletonTooltip>
);

export { UpgradeToolTip };
