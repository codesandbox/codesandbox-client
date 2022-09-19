import React from 'react';
import { RepoFragmentDashboardFragment } from 'app/graphql/types';
import {
  Stack,
  Text,
  Input,
  Icon,
  IconButton,
  SkeletonText,
  Link,
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { SandboxItemComponentProps } from './types';

const useImageLoaded = (url: string) => {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    const img = new Image();

    if (url) {
      img.onload = () => {
        setLoaded(true);
      };

      img.src = url;

      if (img.complete) {
        setLoaded(true);
      }
    }

    return function cleanup() {
      img.src = '';
    };
  }, [url]);

  return loaded;
};

type SandboxTitleProps = {
  stoppedScrolling: boolean;
  isFrozen: boolean;
  prNumber?: number;
  originalGit?: RepoFragmentDashboardFragment['originalGit'];
} & Pick<
  SandboxItemComponentProps,
  | 'editing'
  | 'onContextMenu'
  | 'onSubmit'
  | 'onChange'
  | 'onInputKeyDown'
  | 'onInputBlur'
  | 'PrivacyIcon'
  | 'newTitle'
  | 'sandboxTitle'
>;

const SandboxTitle: React.FC<SandboxTitleProps> = React.memo(
  ({
    isFrozen,
    originalGit,
    prNumber,
    editing,
    stoppedScrolling,
    onContextMenu,
    onSubmit,
    onChange,
    onInputKeyDown,
    onInputBlur,
    PrivacyIcon,
    newTitle,
    sandboxTitle,
  }) => (
    <Stack justify="space-between" marginLeft={5} marginRight={2}>
      {editing ? (
        <form onSubmit={onSubmit}>
          <Input
            autoFocus
            value={newTitle}
            onChange={onChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        </form>
      ) : (
        <Stack gap={2} align="center">
          {prNumber ? (
            <Link
              title="Open pull request on GitHub"
              css={css({ display: 'flex' })}
              href={`https://github.com/${originalGit.username}/${originalGit.repo}/pull/${prNumber}`}
              target="_blank"
            >
              <Icon name="pr" color="#5BC266" />
            </Link>
          ) : null}
          {isFrozen && (
            <Tooltip label={stoppedScrolling ? 'Frozen Sandbox' : null}>
              <span style={{ marginTop: '2px' }}>
                <Icon size={14} title="Frozen Sandbox" name="frozen" />
              </span>
            </Tooltip>
          )}

          <PrivacyIcon />
          <Text size={3} weight="medium">
            {sandboxTitle}
          </Text>
        </Stack>
      )}

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

type SandboxStatsProps = Pick<
  SandboxItemComponentProps,
  'noDrag' | 'viewCount' | 'sandboxLocation' | 'lastUpdated' | 'alwaysOn'
>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({ noDrag, viewCount, sandboxLocation, lastUpdated, alwaysOn }) => {
    const views = (
      <Stack align="center" key="views">
        <Icon style={{ marginRight: 4, minWidth: 14 }} name="eye" size={14} />{' '}
        {viewCount}
      </Stack>
    );

    const lastUpdatedText = (
      <Text key="last-updated" css={{ whiteSpace: 'nowrap' }}>
        {shortDistance(lastUpdated)}
      </Text>
    );

    const sandboxLocationText = sandboxLocation && (
      <Text key="location" maxWidth="100%">
        {sandboxLocation}
      </Text>
    );

    const alwaysOnText = (
      <Text key="always-on" css={css({ color: 'green' })}>
        Always-On
      </Text>
    );

    let footer = [];

    if (alwaysOn) {
      footer = [sandboxLocationText, alwaysOnText];
    } else {
      footer = [views, noDrag ? null : lastUpdatedText, sandboxLocationText];
    }

    return (
      <div>
        <Stack
          marginLeft={5}
          as={Text}
          align="center"
          gap={4}
          size={3}
          variant="muted"
        >
          {footer.map(item => item)}
        </Stack>
      </div>
    );
  }
);

export const SandboxCard = ({
  sandbox,
  sandboxTitle,
  sandboxLocation,
  noDrag,
  autoFork,
  lastUpdated,
  viewCount,
  TemplateIcon,
  PrivacyIcon,
  screenshotUrl,
  alwaysOn,
  // interactions
  isScrolling,
  selected,
  onClick,
  onDoubleClick,
  onBlur,
  onContextMenu,
  // editing
  editing,
  newTitle,
  onChange,
  onInputKeyDown,
  onSubmit,
  onInputBlur,
  // drag preview
  thumbnailRef,
  opacity,
  ...props
}: SandboxItemComponentProps) => {
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
      onClick={onClick}
      onDoubleClick={editing ? undefined : onDoubleClick}
      onBlur={onBlur}
      onContextMenu={onContextMenu}
      {...props}
      css={css({
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor: selected ? 'purple' : 'transparent',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'background ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        opacity,
        ':hover, :focus, :focus-within': {
          backgroundColor: 'card.backgroundHover',
        },
        ':focus-visible': {
          boxShadow: '0 0 2px 1px rgba(255, 255, 255, 0.4)',
        },
      })}
    >
      <Thumbnail
        sandboxId={sandbox.id}
        thumbnailRef={thumbnailRef}
        TemplateIcon={TemplateIcon}
        screenshotUrl={screenshotUrl}
        screenshotOutdated={sandbox.screenshotOutdated}
      />

      <Stack
        direction="vertical"
        justify="space-between"
        css={css({ flexGrow: 1, paddingY: 5 })}
      >
        <SandboxTitle
          originalGit={sandbox.originalGit}
          prNumber={sandbox.prNumber}
          isFrozen={sandbox.isFrozen && !sandbox.customTemplate}
          editing={editing}
          stoppedScrolling={stoppedScrolling}
          onContextMenu={onContextMenu}
          onSubmit={onSubmit}
          onChange={onChange}
          onInputKeyDown={onInputKeyDown}
          onInputBlur={onInputBlur}
          PrivacyIcon={PrivacyIcon}
          newTitle={newTitle}
          sandboxTitle={sandboxTitle}
        />
        <SandboxStats
          noDrag={noDrag}
          lastUpdated={lastUpdated}
          viewCount={viewCount}
          sandboxLocation={sandboxLocation}
          alwaysOn={alwaysOn}
        />
      </Stack>
    </Stack>
  );
};

const Thumbnail = ({
  sandboxId,
  thumbnailRef,
  TemplateIcon,
  screenshotUrl,
  screenshotOutdated,
}) => {
  // 0. Use template icon as starting point and fallback
  // 1. se sandbox.screenshotUrl if it can be successfully loaded (might not exist)
  // 2. If screenshot is outdated, lazily load a newer screenshot. Switch when image loaded.
  const SCREENSHOT_TIMEOUT = 5000;

  const [latestScreenshotUrl, setLatestScreenshotUrl] = React.useState(null);

  const screenshotUrlLoaded = useImageLoaded(screenshotUrl);
  const latestScreenshotUrlLoaded = useImageLoaded(latestScreenshotUrl);

  let screenshotToUse: string;
  if (latestScreenshotUrlLoaded) screenshotToUse = latestScreenshotUrl;
  else if (screenshotUrlLoaded) screenshotToUse = screenshotUrl;

  React.useEffect(
    function lazyLoadLatestScreenshot() {
      const timer = window.setTimeout(() => {
        if (!screenshotOutdated) return;
        const url = `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/screenshot.png`;
        setLatestScreenshotUrl(url);
      }, SCREENSHOT_TIMEOUT);

      return () => window.clearTimeout(timer);
    },
    [sandboxId, screenshotOutdated, setLatestScreenshotUrl]
  );

  return (
    <>
      <div
        ref={thumbnailRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '120px',
          backgroundColor: '#242424',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid',
          borderColor: '#242424',
          [screenshotToUse
            ? 'backgroundImage'
            : null]: `url(${screenshotToUse})`,
        }}
      >
        {!screenshotUrlLoaded && (
          <TemplateIcon
            style={{ filter: 'grayscale(1)', opacity: 0.1 }}
            width="60"
            height="60"
          />
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 18,
          height: 18,
          borderRadius: 4,
          backgroundColor: '#343434',
          borderColor: '#343434',
          padding: 4,
        }}
      >
        <TemplateIcon width="18" height="18" />
      </div>
    </>
  );
};

export const SkeletonCard = () => (
  <Stack
    direction="vertical"
    gap={4}
    css={css({
      width: '100%',
      height: 240,
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      overflow: 'hidden',
    })}
  >
    <SkeletonText css={{ width: '100%', height: 120, borderRadius: 0 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);
