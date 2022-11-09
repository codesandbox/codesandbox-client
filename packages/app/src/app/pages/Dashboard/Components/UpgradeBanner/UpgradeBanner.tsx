import React from 'react';
import styled from 'styled-components';
import {
  Banner,
  Button,
  Column,
  Grid,
  Icon,
  IconNames,
  Link,
  Stack,
  Text,
} from '@codesandbox/components';

const StyledTitle = styled(Text)`
  font-size: 24px;
  line-height: 32px;
  letter-spacing: -0.019em;
  margin: 0;
`;

// When flex wraps and the list of features is shown
// above the call to action.
const WRAP_WIDTH = '1332px';

type Feature = {
  icon: IconNames;
  label: string;
};
const FEATURES: Feature[] = [
  {
    icon: 'profile',
    label: 'Up to 20 editors',
  },
  {
    icon: 'npm',
    label: 'Private NPM packages',
  },
  {
    icon: 'sandbox',
    label: 'Unlimited sandboxes',
  },
  {
    icon: 'lock',
    label: 'Advanced privacy settings',
  },
  {
    icon: 'repository',
    label: 'Unlimited repositories',
  },
  {
    icon: 'server',
    label: '6GB RAM, 12GB Disk, 4 vCPUs',
  },
];

export const UpgradeBanner: React.FC = () => {
  return (
    <Banner onDismiss={() => {}}>
      <StyledTitle color="#EDFFA5" weight="600" block>
        Upgrade to <span css={{ textTransform: 'uppercase' }}>pro</span>
      </StyledTitle>
      <Stack
        css={{
          flexWrap: 'wrap',
        }}
        justify="space-between"
      >
        <Stack direction="vertical" justify="space-between">
          <StyledTitle block>
            Enjoy the full CodeSandbox experience.
          </StyledTitle>
          <Stack
            align="center"
            css={{
              [`@media screen and (max-width: ${WRAP_WIDTH})`]: {
                marginTop: '24px',
              },
            }}
            gap={6}
          >
            <Button autoWidth>Upgrade now</Button>
            <Link>
              <Text color="#999999" size={3}>
                Learn more
              </Text>
            </Link>
          </Stack>
        </Stack>
        <Grid
          as="ul"
          css={{
            listStyle: 'none',
            margin: 0,
            padding: 0,

            [`@media screen and (max-width: ${WRAP_WIDTH})`]: {
              marginTop: '24px',
            },
          }}
        >
          {FEATURES.map(f => (
            <Column key={f.icon} as="li" span={[12, 12, 6]}>
              <Stack css={{ color: '#EBEBEB' }} gap={4}>
                <Icon css={{ flexShrink: 0 }} name={f.icon} />
                <Text size={3}>{f.label}</Text>
              </Stack>
            </Column>
          ))}
        </Grid>
      </Stack>
    </Banner>
  );
};
