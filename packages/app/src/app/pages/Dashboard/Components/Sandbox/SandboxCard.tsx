import React from 'react';
import { RepoFragmentDashboardFragment } from 'app/graphql/types';
import {
  Badge,
  Stack,
  Text,
  Input,
  Icon,
  IconButton,
  Link,
  Tooltip,
  Element,
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
  isViewOnly?: boolean;
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
    isViewOnly,
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
              css={{ display: 'flex' }}
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
          <Text
            size={3}
            weight="medium"
            css={{ color: isViewOnly ? '#999999' : '#E5E5E5' }}
          >
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
          variant="square"
          name="more"
          size={14}
          title="Sandbox Actions"
          onClick={onContextMenu}
        />
      )}
    </Stack>
  )
);

type SandboxStatsProps = Pick<
  SandboxItemComponentProps,
  'noDrag' | 'viewCount' | 'sandboxLocation' | 'lastUpdated'
>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({ noDrag, viewCount, sandboxLocation, lastUpdated }) => {
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

    const footer = [
      views,
      noDrag ? null : lastUpdatedText,
      sandboxLocationText,
    ];

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
  isViewOnly,
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
      css={{
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: selected ? '#292929' : '#1D1D1D',
        border: '1px solid',
        borderColor: selected ? '#242424' : 'transparent',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'background ease-in-out',
        transitionDuration: '100ms',
        opacity,
        ':hover': {
          backgroundColor: '#292929',
        },
        ':has(button:hover)': {
          backgroundColor: '#1D1D1D',
        },
        ':focus-visible': {
          borderColor: '#242424',
        },
      }}
    >
      {isViewOnly ? (
        <Element css={{ position: 'absolute', top: 8, left: 8 }}>
          <Badge color="accent" isPadded>
            View only
          </Badge>
        </Element>
      ) : null}

      <Thumbnail
        sandboxId={sandbox.id}
        thumbnailRef={thumbnailRef}
        TemplateIcon={TemplateIcon}
        screenshotUrl={screenshotUrl}
        screenshotOutdated={sandbox.screenshotOutdated}
        showBetaBadge={sandbox.isV2}
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
          isViewOnly={isViewOnly}
        />
        <SandboxStats
          noDrag={noDrag}
          lastUpdated={lastUpdated}
          viewCount={viewCount}
          sandboxLocation={sandboxLocation}
        />
      </Stack>
    </Stack>
  );
};

const Thumbnail = ({
  sandboxId,
  thumbnailRef,
  TemplateIcon,
  showBetaBadge,
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
      <Stack gap={1} css={{ position: 'absolute', top: 8, right: 8 }}>
        {showBetaBadge && <Badge icon="cloud">Beta</Badge>}
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            backgroundColor: '#343434',
            borderColor: '#343434',
            padding: 3,
          }}
        >
          <TemplateIcon width="18" height="18" />
        </div>
      </Stack>
    </>
  );
};
