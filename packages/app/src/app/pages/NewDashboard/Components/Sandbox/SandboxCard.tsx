import React from 'react';
import {
  Stack,
  Text,
  Input,
  Icon,
  IconButton,
  SkeletonText,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
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

type SandboxTitleProps = { stoppedScrolling: boolean } & Pick<
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
  'isHomeTemplate' | 'sandbox' | 'viewCount' | 'sandboxLocation' | 'lastUpdated'
>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({ isHomeTemplate, viewCount, sandboxLocation, lastUpdated }) => {
    let finalText = viewCount;

    if (!isHomeTemplate) {
      finalText += ` • ${shortDistance(lastUpdated)}`;
    }

    if (sandboxLocation) {
      finalText += ` • ${sandboxLocation}`;
    }

    return (
      <div style={{ margin: '0 16px' }}>
        <Text
          style={{ display: 'flex', alignItems: 'center' }}
          size={3}
          variant="muted"
        >
          <Icon style={{ marginRight: 2 }} name="eye" size={14} /> {finalText}
        </Text>
      </div>
    );
  }
);

export const SandboxCard = ({
  sandbox,
  sandboxTitle,
  sandboxLocation,
  isHomeTemplate,
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

  const lastSandboxId = React.useRef(sandbox.id);
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
    if (
      stoppedScrolling &&
      (lastSandboxId.current !== sandbox.id || !guaranteedScreenshotUrl)
    ) {
      setGuaranteedScreenshotUrl(
        sandbox.screenshotUrl || generateScreenshotUrl
      );
      lastSandboxId.current = sandbox.id;
    }
  }, [
    stoppedScrolling,
    guaranteedScreenshotUrl,
    sandbox.id,
    sandbox.screenshotUrl,
  ]);

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
      <div
        ref={thumbnailRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '160px',
          backgroundColor: '#242424',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',

          [imageLoaded
            ? 'backgroundImage'
            : null]: `url(${guaranteedScreenshotUrl})`,
        }}
      >
        {imageLoaded ? null : (
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
        isHomeTemplate={isHomeTemplate}
        lastUpdated={lastUpdated}
        sandbox={sandbox}
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
