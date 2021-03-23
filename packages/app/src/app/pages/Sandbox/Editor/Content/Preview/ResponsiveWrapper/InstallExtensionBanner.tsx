import Modal from 'app/components/Modal';
import css from '@styled-system/css';
import { ThemeProvider, Stack, Text } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { Alert } from 'app/pages/common/Modals/Common/Alert';
import * as React from 'react';
import { withTheme } from 'styled-components';
import { DismissIcon } from './Icons';

const ADDRESSBAR_HEIGHT = 35;
const RESPONSIVE_BAR_HEIGHT = 40;

const clearButtonStyles = {
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
  border: 'none',
};

export const InstallExtensionBanner = withTheme(({ theme }: { theme: any }) => {
  const [isShowing, setShowing] = React.useState(false);
  const {
    preview: { mode },
    modals,
  } = useAppState();
  const actions = useActions();

  React.useEffect(() => {
    setShowing(true);
  }, []);

  const isResponsive =
    mode === 'responsive' || mode === 'responsive-add-comment';

  const getTop = () => {
    if (isShowing) {
      if (isResponsive) {
        return ADDRESSBAR_HEIGHT + RESPONSIVE_BAR_HEIGHT;
      }
      return ADDRESSBAR_HEIGHT;
    }

    return 0;
  };

  return (
    <ThemeProvider theme={theme.vscodeTheme}>
      <Stack
        align="center"
        justify="space-between"
        style={{
          top: getTop(),
        }}
        padding={2}
        css={css({
          position: 'absolute',
          height: 40,
          left: 0,
          top: 0,
          transition: 'top 0.5s ease-in',
          width: '100%',
          backgroundColor: 'sideBar.background',
          zIndex: 3,
        })}
      >
        <Stack
          gap={4}
          align="center"
          css={css({
            flexGrow: 1,
          })}
        >
          <button
            type="button"
            onClick={() => {
              actions.preview.closeExtensionBanner();
            }}
            css={css({
              ...clearButtonStyles,
              color: 'mutedForeground',
            })}
          >
            <DismissIcon />
          </button>
          <Text
            style={{
              maxWidth: '70%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Get a better experience creating comments
          </Text>
        </Stack>
        <button
          type="button"
          onClick={() => {
            actions.preview.installExtension();
          }}
          css={css({
            ...clearButtonStyles,
            color: 'blues.500',
            flexShrink: 0,
          })}
        >
          Install Extension
        </button>
        <Modal
          isOpen={modals.extensionInstalledModal.isCurrent}
          width={450}
          onClose={() => actions.modals.extensionInstalledModal.close(false)}
        >
          <Alert
            title="CodeSandbox Extension"
            description="If you installed the extension, the browser needs to refresh to activate it"
            onCancel={() => {
              actions.modals.extensionInstalledModal.close(false);
            }}
            cancelMessage="Cancel"
            onPrimaryAction={() => {
              actions.modals.extensionInstalledModal.close(true);
            }}
            confirmMessage="Ok"
          />
        </Modal>
      </Stack>
    </ThemeProvider>
  );
});
