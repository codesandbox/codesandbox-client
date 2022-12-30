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
import { SandboxItemComponentProps } from './types';
import { StyledCard } from '../shared/StyledCard';
import { useSandboxThumbnail } from './useSandboxThumbnail';

type SandboxTitleProps = {
  restricted?: boolean;
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
    restricted,
    TemplateIcon,
  }) => (
    <Stack css={{ zIndex: 1 }} justify="space-between">
      {editing ? (
        <form onSubmit={onSubmit}>
          <Input
            css={{
              marginTop: '-5px',
              marginLeft: '15px',
            }}
            autoFocus
            value={newTitle}
            onChange={onChange}
            onKeyDown={onInputKeyDown}
            onBlur={onInputBlur}
          />
        </form>
      ) : (
        <Stack gap={2} css={{ overflow: 'hidden' }}>
          <TemplateIcon width="16" height="16" />

          <InteractiveOverlay.Button
            css={{ overflow: 'hidden' }}
            radius={4}
            onClick={onClick}
            onDoubleClick={editing ? undefined : onDoubleClick}
            onBlur={onBlur}
            onContextMenu={onContextMenu}
          >
            <Text
              size={13}
              weight="medium"
              color={restricted ? '#999999' : '#E5E5E5'}
              truncate
            >
              {sandboxTitle}
            </Text>
          </InteractiveOverlay.Button>
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
      />
    </Stack>
  )
);

type SandboxStatsProps = {
  isFrozen?: boolean;
  prNumber?: number;
  restricted: boolean;
  showBetaBadge: boolean;
  hasThumbnail: boolean;
  originalGit?: RepoFragmentDashboardFragment['originalGit'];
} & Pick<SandboxItemComponentProps, 'noDrag' | 'lastUpdated' | 'PrivacyIcon'>;
const SandboxStats: React.FC<SandboxStatsProps> = React.memo(
  ({
    hasThumbnail,
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
          zIndex: 1,
          height: '16px',
          color: hasThumbnail ? '#fff' : '#999',
        }}
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
  restricted,
  // drag preview
  thumbnailRef,
  isDragging,
}: SandboxItemComponentProps) => {
  const sandboxThumbnail = useSandboxThumbnail({
    sandboxId: sandbox.id,
    screenshotOutdated: sandbox.screenshotOutdated,
    screenshotUrl,
  });

  return (
    <InteractiveOverlay>
      <StyledCard
        dimmed={isDragging}
        selected={selected}
        css={{
          position: 'relative',
        }}
      >
        <SandboxTitle
          editing={editing}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onBlur={onBlur}
          onContextMenu={onContextMenu}
          onSubmit={onSubmit}
          onChange={onChange}
          onInputKeyDown={onInputKeyDown}
          onInputBlur={onInputBlur}
          newTitle={newTitle}
          sandboxTitle={sandboxTitle}
          TemplateIcon={TemplateIcon}
          restricted={restricted}
        />
        <SandboxStats
          noDrag={noDrag}
          originalGit={sandbox.originalGit}
          prNumber={sandbox.prNumber}
          lastUpdated={lastUpdated}
          isFrozen={sandbox.isFrozen && !sandbox.customTemplate}
          PrivacyIcon={PrivacyIcon}
          restricted={restricted}
          showBetaBadge={sandbox.isV2}
          hasThumbnail={!!sandboxThumbnail}
        />
        <Element
          className="thumbnail"
          ref={thumbnailRef}
          css={{
            opacity: 0.2,
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            right: 0,
            zIndex: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: sandboxThumbnail
              ? `url(${sandboxThumbnail})`
              : undefined,
          }}
        />
      </StyledCard>
    </InteractiveOverlay>
  );
};
