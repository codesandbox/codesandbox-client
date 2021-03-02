import React from 'react';

import { Stack, Text, Icon, IconButton } from '@codesandbox/components';
import css from '@styled-system/css';
import { CommunitySandboxItemComponentProps } from './types';

type SandboxTitleProps = {
  stoppedScrolling: boolean;
} & Pick<CommunitySandboxItemComponentProps, 'sandboxTitle' | 'onContextMenu'>;

const SandboxTitle: React.FC<SandboxTitleProps> = React.memo(
  ({ sandboxTitle, onContextMenu, stoppedScrolling }) => (
    <Stack justify="space-between" align="center" marginLeft={4}>
      <Stack gap={1} align="center">
        <Text size={3} weight="medium">
          {sandboxTitle}
        </Text>
      </Stack>

      {!stoppedScrolling ? (
        // During scrolling we don't show the button, because it takes 1ms to render a button,
        // while this doesn't sound like a lot, we need to render 4 new grid items when you scroll down,
        // and this can't take more than 12ms. Showing another thing than the button shaves off a 4ms of
        // render time and allows you to scroll with a minimum of 30fps.
        <div
          style={{
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          css={css({ color: 'mutedForeground' })}
        >
          <Icon size={9} name="more" />
        </div>
      ) : (
        <IconButton
          name="more"
          size={9}
          title="Sandbox Actions"
          onClick={onContextMenu}
        />
      )}
    </Stack>
  )
);

type SandboxStatsProps = Pick<CommunitySandboxItemComponentProps, 'viewCount'>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({ viewCount }) => (
    <div style={{ margin: '0 16px' }}>
      <Stack
        as={Text}
        align="center"
        gap={1}
        size={3}
        variant="muted"
        css={css({
          '> *:not(:last-child):after': { content: `'•'`, marginLeft: 1 },
        })}
      >
        <Stack align="center" key="views">
          <Icon style={{ marginRight: 4, minWidth: 14 }} name="eye" size={14} />{' '}
          {viewCount}
        </Stack>
        <Text key="location" maxWidth="100%">
          Community
        </Text>
      </Stack>
    </div>
  )
);

export const SandboxCard = ({
  sandbox,
  sandboxTitle,
  viewCount,
  TemplateIcon,
  screenshotUrl,
  // interactions
  isScrolling,
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  ...props
}: CommunitySandboxItemComponentProps) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);
  React.useEffect(() => {
    // We only want to render the screenshot once the user has stopped scrolling
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  return (
    <Stack
      direction="vertical"
      gap={2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      {...props}
      css={css({
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor: selected ? 'blues.600' : 'grays.600',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'box-shadow ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        ':hover, :focus, :focus-within': {
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
    >
      <Thumbnail TemplateIcon={TemplateIcon} screenshotUrl={screenshotUrl} />
      <div
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 16,
          height: 16,
          border: '3px solid',
          borderRadius: 2,
          backgroundColor: '#343434',
          borderColor: '#343434',
        }}
      >
        <TemplateIcon width="16" height="16" />
      </div>
      <SandboxTitle
        sandboxTitle={sandboxTitle}
        onContextMenu={onContextMenu}
        stoppedScrolling={stoppedScrolling}
      />
      <SandboxStats viewCount={viewCount} />
    </Stack>
  );
};

const Thumbnail = ({ TemplateIcon, screenshotUrl }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '160px',
      backgroundColor: '#242424',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      borderBottom: '1px solid',
      borderColor: '#242424',
      backgroundImage: `url(${screenshotUrl})`,
    }}
  >
    {!screenshotUrl && (
      <TemplateIcon
        style={{ filter: 'grayscale(1)', opacity: 0.1 }}
        width="60"
        height="60"
      />
    )}
  </div>
);
