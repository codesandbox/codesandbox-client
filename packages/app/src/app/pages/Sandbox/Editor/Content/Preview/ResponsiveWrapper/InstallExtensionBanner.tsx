import Modal from 'app/components/Modal';
import { ThemeProvider } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Alert } from 'app/pages/common/Modals/Common/Alert';
import * as React from 'react';
import styled, { withTheme } from 'styled-components';

const Wrapper = styled.div({
  position: 'absolute',
  height: 35,
  left: 0,
  top: 0,
  transition: 'top 0.5s ease-in',
  width: '100%',
  backgroundColor: 'red',
  zIndex: 3,
});

const ADDRESSBAR_HEIGHT = 35;
const RESPONSIVE_BAR_HEIGHT = 42;

export const InstallExtensionBanner = withTheme(({ theme }: { theme: any }) => {
  const [isShowing, setShowing] = React.useState(false);
  const { state, actions } = useOvermind();

  React.useEffect(() => {
    setShowing(true);
  }, []);

  const isResponsive =
    state.preview.mode === 'responsive' ||
    state.preview.mode === 'responsive-add-comment';

  return (
    <ThemeProvider theme={theme.vscodeTheme}>
    <Wrapper
      style={{
        top: isShowing
          ? isResponsive
            ? ADDRESSBAR_HEIGHT + RESPONSIVE_BAR_HEIGHT
            : ADDRESSBAR_HEIGHT
          : 0,
      }}
    >
      Get a better experience
      <button
        type="button"
        onClick={() => {
          actions.preview.installExtension();
        }}
      >
        install
      </button>
      <Modal
        isOpen={state.modals.extensionInstalledModal.isCurrent}
        width={450}
        onClose={() => actions.modals.extensionInstalledModal.close(false)}
      >

<Alert
        title="CodeSandbox Extension"
        description="If you installed the extension, the browser needs to refresh to activate it"
        onCancel={() => {
          actions.modals.extensionInstalledModal.close(false)
        }}
        cancelMessage="Cancel"
        onPrimaryAction={() => {
          actions.modals.extensionInstalledModal.close(true)
        }}
        confirmMessage="Ok"
      />

      </Modal>
    </Wrapper>
    </ThemeProvider>
  );
});
