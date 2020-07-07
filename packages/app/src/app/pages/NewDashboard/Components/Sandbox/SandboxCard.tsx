import React from 'react';
import { RepoFragmentDashboardFragment } from 'app/graphql/types';
import {
  Stack,
  Element,
  Text,
  Input,
  Icon,
  IconButton,
  SkeletonText,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { SandboxItemComponentProps } from './types';

const useImageLoaded = (url: string) => {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
    };

    img.src = url;

    if (img.complete) {
      setLoaded(true);
    }
  }, [url]);

  return loaded;
};

type SandboxTitleProps = {
  stoppedScrolling: boolean;
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
    <Stack justify="space-between" align="center" marginLeft={4}>
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
        <Stack gap={1} align="center">
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
          title="Sandbox actions"
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
  ({ noDrag, viewCount, sandboxLocation, lastUpdated }) => (
    <Stack marginX={4} gap={1} align="center">
      <Stack gap={1} align="center">
        <Icon name="eye" size={14} css={css({ color: 'mutedForeground' })} />
        <Text size={3} variant="muted">
          {viewCount}
        </Text>
      </Stack>
      {noDrag ? null : (
        <>
          <Text size={3} variant="muted">
            •
          </Text>
          <Text size={3} variant="muted" css={{ flexShrink: 0 }}>
            {shortDistance(lastUpdated)}
          </Text>
        </>
      )}
      {sandboxLocation ? (
        <>
          <Text size={3} variant="muted">
            •
          </Text>
          <Text size={3} variant="muted" maxWidth="100%">
            {sandboxLocation}
          </Text>
        </>
      ) : null}
    </Stack>
  )
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
  // drag preview
  thumbnailRef,
  opacity,
  ...props
}: SandboxItemComponentProps) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);
  const [guaranteedScreenshotUrl, setGuaranteedScreenshotUrl] = React.useState<
    string
  >(screenshotUrl);

  const imageLoaded = useImageLoaded(guaranteedScreenshotUrl);

  React.useEffect(() => {
    // We only want to render the screenshot once the user has stopped scrolling
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  React.useEffect(() => {
    // We always try to show the cached screenshot first, if someone looks at a sandbox we will try to
    // generate a new one based on the latest contents.
    const generateScreenshotUrl = `/api/v1/sandboxes/${sandbox.id}/screenshot.png`;
    if (stoppedScrolling && !guaranteedScreenshotUrl) {
      setGuaranteedScreenshotUrl(generateScreenshotUrl);
    }
  }, [stoppedScrolling, guaranteedScreenshotUrl, sandbox.id]);

  return (
    <Stack
      direction="vertical"
      gap={2}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onBlur={onBlur}
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
        opacity,
        ':hover, :focus, :focus-within': {
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
    >
      <Stack
        ref={thumbnailRef}
        justify="center"
        align="center"
        css={css({
          height: 160,
          backgroundColor: 'grays.600',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid',
          borderColor: 'grays.600',
          svg: {
            filter: 'grayscale(1)',
            opacity: 0.1,
          },
        })}
        style={{
          [imageLoaded
            ? 'backgroundImage'
            : null]: `url(${guaranteedScreenshotUrl})`,
        }}
      >
        {imageLoaded ? null : <TemplateIcon width="60" height="60" />}
      </Stack>
      <Element
        css={css({
          position: 'absolute',
          top: 1,
          right: 1,
          size: 6,
          width: '22px',
          height: '22px',
          backgroundColor: 'grays.500',
          border: '3px solid',
          borderColor: 'grays.500',
          borderRadius: 'medium',
        })}
      >
        <TemplateIcon width="16" height="16" />
      </Element>

      <SandboxTitle
        originalGit={sandbox.originalGit}
        prNumber={sandbox.prNumber}
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
      />
    </Stack>
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
    <SkeletonText css={{ width: '100%', height: 160, borderRadius: 0 }} />
    <Stack direction="vertical" gap={2} marginX={4}>
      <SkeletonText css={{ width: 120 }} />
      <SkeletonText css={{ width: 180 }} />
    </Stack>
  </Stack>
);

const shortDistance = distance =>
  // we remove long names for short letters
  distance
    .replace(' years', 'y')
    .replace(' year', 'y')
    .replace(' months', 'm')
    .replace(' month', 'm')
    .replace(' days', 'd')
    .replace(' day', 'd')
    .replace(' hours', 'h')
    .replace(' hour', 'h')
    .replace(' minutes', 'min')
    .replace(' minute', 'min')
    .replace(' seconds', 's')
    .replace(' second', 's');
