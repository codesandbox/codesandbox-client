import * as React from 'react';

import track from '@codesandbox/common/lib/utils/analytics';
import { Link as RouterLink } from 'react-router-dom';
import { Text, Link, Stack, Badge } from '@codesandbox/components';
import Tooltip, {
  SingletonTooltip,
} from '@codesandbox/common/lib/components/Tooltip';

const UpgradeToolTip: React.FC = () => (
  <Stack>
    <SingletonTooltip interactive delay={[0, 600]}>
      {singleton => (
        <Tooltip
          singleton={singleton}
          content={
            <Stack
              gap={2}
              direction="vertical"
              css={{ alignItems: 'flex-start', padding: '8px', width: '190px' }}
              onMouseEnter={() => track('Editor - Mouse enter tooltip upgrade')}
            >
              <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
                Upgrade to Team PRO for the full CodeSandbox Experience.
              </Text>
              <Link
                as={RouterLink}
                to="/pro"
                onClick={() => track('Editor - Click tooltip upgrade')}
                title="Upgrade to Team PRO"
                css={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#EDFFA5 !important',
                  textDecoration: 'none',
                }}
              >
                Upgrade now
              </Link>
            </Stack>
          }
        >
          <Badge variant="trial">Free</Badge>
        </Tooltip>
      )}
    </SingletonTooltip>
  </Stack>
);

export { UpgradeToolTip };
