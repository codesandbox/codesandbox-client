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
    restricted,
    TemplateIcon,
    interaction,
    ...props
  }) => (
    <Stack css={{ zIndex: 2 }} justify="space-between">
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
        <Stack gap={2} align="flex-start" css={{ overflow: 'hidden' }}>
          <TemplateIcon width="16" height="16" />

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
              <Text
                size={13}
                weight="medium"
                color={restricted ? '#999999' : '#E5E5E5'}
                truncate
              >
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
                }}
                onClick={onClick}
                onDoubleClick={editing ? undefined : onDoubleClick}
                onBlur={onBlur}
                onContextMenu={onContextMenu}
                {...props}
              >
                <Text
                  size={13}
                  weight="medium"
                  color={restricted ? '#999999' : '#E5E5E5'}
                  truncate
                >
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
          zIndex: 2,
          height: '16px',
          color: hasThumbnail ? '#C2C2C2' : '#999',
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

// TODO: Colors experiment (WIP)
// export const TEMPLATE_COLORS: Record<string, string> = {
//   'create-react-app': '#202a2a',
//   next: '#202020',
//   'vue-cli': '#202a20',
//   node: '#202a20',
//   nuxt: '#202a20',
//   parcel: '#2a2a20',
//   static: '#2a2320',
//   'angular-cli': '#2a2020',
//   svelte: '#2a2320',
//   'preact-cli': '#2a202a',
//   gatsby: '#2a202a',
//   remix: '2a2a2a',
// };

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
  const sandboxThumbnail = useSandboxThumbnail({
    sandboxId: sandbox.id,
    screenshotOutdated: sandbox.screenshotOutdated,
    screenshotUrl,
  });

  // TODO: Colors experiment (WIP)
  // const color = TEMPLATE_COLORS[sandbox.source.template] || '#1a1a1a';

  return (
    <InteractiveOverlay>
      <StyledCard
        dimmed={isDragging}
        selected={selected}
        css={{
          position: 'relative',
          // background: color,
        }}
      >
        <SandboxTitle restricted={restricted} {...props} />
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
        {/* <Element
          css={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            right: 0,
            zIndex: 1,
            borderRadius: '4px',
            background: `linear-gradient(135deg, ${color}, transparent)`,
          }}
        /> */}
        <Element
          className="thumbnail"
          ref={thumbnailRef}
          css={{
            opacity: 0.15,
            // opacity: 0.5,
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            right: 0,
            zIndex: 0,
            borderRadius: '4px',
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
