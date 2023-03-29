import React, { useMemo } from 'react';
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
  InteractiveOverlay,
  Element,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import styled from 'styled-components';
import { SandboxItemComponentProps } from './types';
import { StyledCard } from '../shared/StyledCard';
import { useSandboxThumbnail } from './useSandboxThumbnail';
import { Brightness } from './useImageBrightness';

type SandboxTitleProps = {
  brightness?: Brightness;
} & Pick<
  SandboxItemComponentProps,
  | 'editing'
  | 'onClick'
  | 'onDoubleClick'
  | 'onBlur'
  | 'onContextMenu'
  | 'onSubmit'
  | 'onChange'
  | 'onInputKeyDown'
  | 'onInputBlur'
  | 'TemplateIcon'
  | 'newTitle'
  | 'sandboxTitle'
  | 'interaction'
>;

const SandboxTitle: React.FC<SandboxTitleProps> = React.memo(
  ({
    editing,
    onClick,
    onDoubleClick,
    onBlur,
    onContextMenu,
    onSubmit,
    onChange,
    onInputKeyDown,
    onInputBlur,
    newTitle,
    sandboxTitle,
    TemplateIcon,
    interaction,
    brightness,
    ...props
  }) => {
    return (
      <Stack justify="space-between">
        {editing ? (
          <form onSubmit={onSubmit}>
            <Input
              css={{
                border: 0,
                marginTop: '-4px',
                marginLeft: '16px',
                fontWeight: 500,
              }}
              autoFocus
              value={newTitle}
              onChange={onChange}
              onKeyDown={onInputKeyDown}
              onBlur={onInputBlur}
            />
          </form>
        ) : (
          <Stack gap={3} align="flex-start" css={{ overflow: 'hidden' }}>
            <Element css={{ flexShrink: 0 }}>
              <TemplateIcon width="16" height="16" />
            </Element>

            {interaction === 'button' ? (
              <InteractiveOverlay.Button
                css={{ overflow: 'hidden' }}
                radius={4}
                onClick={onClick}
                onDoubleClick={editing ? undefined : onDoubleClick}
                onBlur={onBlur}
                onContextMenu={onContextMenu}
                {...props}
              >
                <Text size={13} weight="medium" color="inherit" truncate>
                  {sandboxTitle}
                </Text>
              </InteractiveOverlay.Button>
            ) : (
              <InteractiveOverlay.Item radius={4}>
                <Element
                  css={{
                    display: 'flex',
                    overflow: 'hidden',
                    lineHeight: '16px',
                    color: 'inherit',
                  }}
                  onClick={onClick}
                  onDoubleClick={editing ? undefined : onDoubleClick}
                  onBlur={onBlur}
                  onContextMenu={onContextMenu}
                  {...props}
                >
                  <Text size={13} weight="medium" color="inherit" truncate>
                    {sandboxTitle}
                  </Text>
                </Element>
              </InteractiveOverlay.Item>
            )}
          </Stack>
        )}

        <IconButton
          css={{
            marginRight: '-4px',
            marginTop: '-4px',
          }} /* Align icon to top-right corner */
          variant="square"
          name="more"
          size={16}
          title="Sandbox Actions"
          onClick={onContextMenu}
          className="sandbox-actions"
        />
      </Stack>
    );
  }
);

type SandboxStatsProps = {
  isFrozen?: boolean;
  prNumber?: number;
  restricted: boolean;
  showBetaBadge: boolean;
  originalGit?: RepoFragmentDashboardFragment['originalGit'];
} & Pick<SandboxItemComponentProps, 'noDrag' | 'lastUpdated' | 'PrivacyIcon'>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({
    isFrozen,
    restricted,
    showBetaBadge,
    noDrag,
    lastUpdated,
    PrivacyIcon,
    prNumber,
    originalGit,
  }) => {
    const lastUpdatedText = (
      <Text key="last-updated" size={12} truncate>
        {shortDistance(lastUpdated)}
      </Text>
    );

    const badge = useMemo<JSX.Element>(() => {
      if (restricted) {
        return <Badge variant="trial">Restricted</Badge>;
      }

      if (showBetaBadge) {
        return <Badge icon="cloud">Beta</Badge>;
      }

      return null;
    }, [restricted, showBetaBadge]);

    return (
      <Stack
        justify="space-between"
        align="center"
        css={{
          height: '16px',
        }}
        className="sandbox-stats"
      >
        <Stack gap={2} align="center">
          <PrivacyIcon />
          {isFrozen && (
            <Tooltip label="Frozen Sandbox">
              <Icon size={16} title="Frozen Sandbox" name="frozen" />
            </Tooltip>
          )}
          {prNumber ? (
            <Link
              title="Open pull request on GitHub"
              css={{ display: 'flex' }}
              href={`https://github.com/${originalGit.username}/${originalGit.repo}/pull/${prNumber}`}
              target="_blank"
            >
              <Icon size={16} name="pr" color="#5BC266" />
            </Link>
          ) : null}
          {noDrag ? null : lastUpdatedText}
        </Stack>
        {badge}
      </Stack>
    );
  }
);

export const SandboxCard = ({
  sandbox,
  noDrag,
  lastUpdated,
  PrivacyIcon,
  screenshotUrl,
  // interactions
  selected,
  restricted,
  // drag preview
  thumbnailRef,
  isDragging,
  ...props
}: SandboxItemComponentProps) => {
  const thumbnail = useSandboxThumbnail({
    thumbnailUrl: screenshotUrl,
  });

  let textColor = '#EBEBEB'; // default

  if (restricted) {
    textColor = thumbnail.isCustom ? textColor : '#999999';
  } else if (thumbnail?.brightness && thumbnail.isCustom) {
    textColor = thumbnail.brightness === 'light' ? '#0E0E0E' : '#FFFFFF';
  }

  return (
    <InteractiveOverlay>
      <StyledCard
        dimmed={isDragging}
        css={{
          overflow: 'hidden',

          // Reset padding for now as it's set in the card
          // content component instead.
          padding: 0,

          // Display grid to overlap the children without needing
          // position absolute.
          display: 'grid',
          gridTemplate: '1fr / 1fr',

          // Text color based on restricted and brightness
          color: textColor,
          transition: 'color ease-in, background-color ease-in',
          transitionDuration: '.1s', // === theme.speeds[2]

          // Hide sandbox stats and context menu button if the
          // sandbox thumbnail isCustom and not restricted
          '.sandbox-stats, .sandbox-actions':
            thumbnail.isCustom && !restricted
              ? {
                  opacity: 0,
                  transition: 'opacity ease-in',
                  transitionDuration: '.150s', // === theme.speeds[3]
                }
              : undefined,

          '&:hover, &:focus-within': {
            // update background color in case there is
            // no thumbnail.
            backgroundColor: '#252525',

            // update text color to contrast scrim
            color: '#EBEBEB',

            [`${CardThumbnail}`]: {
              '&::before':
                thumbnail.isCustom && !restricted
                  ? {
                      // show scrim
                      opacity: 0.8,
                    }
                  : {
                      // change scrim color when it's already
                      // shown without hover
                      backgroundColor: '#252525',
                    },
            },

            // Show sandbox stats and context menu button if the
            // sandbox thumbnail isCustom and not restricted as it's
            // already shown in that case
            '.sandbox-stats, .sandbox-actions':
              thumbnail.isCustom && !restricted
                ? {
                    opacity: 1,
                  }
                : undefined,
          },
        }}
      >
        {thumbnail?.isLoaded ? (
          <CardThumbnail
            // The thumbnailRef is used for the drag and
            // drop preview.
            ref={thumbnailRef}
            hasCustomThumbnail={thumbnail.isCustom}
            forceScrim={restricted}
            source={thumbnail.src}
          />
        ) : null}

        <CardContent selected={selected}>
          <SandboxTitle brightness={thumbnail.brightness} {...props} />
          <SandboxStats
            noDrag={noDrag}
            originalGit={sandbox.originalGit}
            prNumber={sandbox.prNumber}
            lastUpdated={lastUpdated}
            isFrozen={sandbox.isFrozen && !sandbox.customTemplate}
            PrivacyIcon={PrivacyIcon}
            restricted={restricted}
            showBetaBadge={sandbox.isV2}
          />
        </CardContent>
      </StyledCard>
    </InteractiveOverlay>
  );
};

const CardThumbnail = styled.div<{
  source: string;
  hasCustomThumbnail: boolean;
  forceScrim: boolean;
}>`
  grid-row: 1 / -1;
  grid-column: 1 / -1;

  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: url(${({ source }) => source});

  // The ::before pseudo elements acts as a scrim over the thumbnail
  // image.
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    // top: 0;
    // right: 0;
    background-color: #212121;

    // For custom thumbs we only show the scrim on hover. The hover is triggered
    // from the css property on the StyledCard comopnent.
    opacity: ${({ hasCustomThumbnail, forceScrim }) =>
      hasCustomThumbnail && !forceScrim ? 0 : 0.8};
    transition: opacity ease-in;
    transition-duration: ${({ theme }) => theme.speeds[2]}; // 100ms
  }

  // Target siblings and add position relative to make sure the
  // siblings overlap the absolute positioned scrim.
  & ~ * {
    position: relative;
  }
`;

const CardContent = styled.div<{ selected: boolean }>`
  grid-row: 1 / -1;
  grid-column: 1 / -1;

  // Set padding on this element instead of on the parent
  // to allow the thumbnail and scrim to be full width.
  padding: 24px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  ${({ selected }) =>
    selected &&
    `
    outline: #ac9cff solid 2px;
    outline-offset: -2px;
    `}
`;
