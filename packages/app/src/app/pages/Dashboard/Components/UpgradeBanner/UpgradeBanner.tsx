import React from 'react';
import {
  Banner,
  Button,
  Column,
  Icon,
  Grid,
  Stack,
  Text,
} from '@codesandbox/components';

export const UpgradeBanner: React.FC = () => {
  return (
    <Banner>
      <Stack gap={2} justify="space-between">
        <Stack direction="vertical" gap={8} justify="space-between">
          <Text fontFamily="everett" size={24}>
            <Text color="#EDFFA5" weight="600" block>
              Upgrade to <Text css={{ textTransform: 'uppercase' }}>pro</Text>
            </Text>
            <Text block>Enjoy the full CodeSandbox experience.</Text>
          </Text>
          <Button autoWidth>Learn more</Button>
        </Stack>
        <Stack align="flex-end">
          <Grid
            as="ul"
            columnGap={3}
            rowGap={3}
            css={{
              color: '#EBEBEB',
              margin: 0,
              padding: 0,
              listStyleType: 'none',
            }}
          >
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  Up to 20 editors
                </Text>
              </Stack>
            </Column>
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  Private NPM packages
                </Text>
              </Stack>
            </Column>
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  Unlimited sandboxes
                </Text>
              </Stack>
            </Column>
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  Advanced privacy settings
                </Text>
              </Stack>
            </Column>
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  Unlimited repositories
                </Text>
              </Stack>
            </Column>
            <Column as="li" span={6}>
              <Stack gap={4}>
                <Icon name="profile" />
                <Text size={13} lineHeight="16px">
                  6GB RAM, 12GB Disk, 4 vCPUs
                </Text>
              </Stack>
            </Column>
          </Grid>
        </Stack>
      </Stack>
    </Banner>
  );
};
