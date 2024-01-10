import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { LiveUser } from '@codesandbox/common/lib/types';
import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Icons } from 'app/components/CodeEditor/elements';
import { useAppState } from 'app/overmind';
import * as React from 'react';
import QuestionIcon from 'react-icons/lib/go/question';

export const EditorToast = () => {
  const state = useAppState();

  const sandbox = state.editor.currentSandbox;
  const { currentModule } = state.editor;
  const modulePath = currentModule.path;
  const template = sandbox && getTemplateDefinition(sandbox.template);
  const config = template && template.configurationFiles[modulePath];

  const followingUserId = state.live.followingUserId;
  let followingUser: LiveUser | undefined;

  if (followingUserId && state.live.roomInfo && state.live.isLive) {
    followingUser = state.live.roomInfo.users.find(
      u => u.id === followingUserId
    );
  }

  return (
    <Stack
      css={css({
        position: 'absolute',
        bottom: 0,
        zIndex: 45,
        right: 15,
      })}
      gap={1}
      direction="vertical"
      align="flex-end"
    >
      {followingUser && (
        <div
          css={{
            transition: '0.3s ease opacity',
            background: `rgb(${followingUser.color.join(',')})`,
            padding: '2px 8px',
            fontSize: '12px',
            float: 'right',
            width: 'max-content',
            borderTopLeftRadius: 2,
            color:
              (followingUser.color[0] * 299 +
                followingUser.color[1] * 587 +
                followingUser.color[2] * 114) /
                1000 >
              128
                ? 'rgba(0, 0, 0, 0.8)'
                : 'white',

            ':hover': {
              opacity: 0.5,
            },
          }}
        >
          Following {followingUser.username}
        </div>
      )}

      {config ? (
        <Icons>
          {config.partialSupportDisclaimer ? (
            <Tooltip
              placement="bottom"
              content={config.partialSupportDisclaimer}
              style={{
                display: 'flex',
                'align-items': 'center',
              }}
            >
              Partially Supported Config{' '}
              <QuestionIcon style={{ marginLeft: '.5rem' }} />
            </Tooltip>
          ) : (
            <div>Supported Configuration</div>
          )}
        </Icons>
      ) : null}
    </Stack>
  );
};
