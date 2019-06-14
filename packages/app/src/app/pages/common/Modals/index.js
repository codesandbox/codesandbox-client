import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from 'app/components/Modal';
import { ThemeProvider } from 'styled-components';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import codesandbox from '@codesandbox/common/lib/themes/codesandbox.json';
import getVSCodeTheme from 'app/src/app/pages/Sandbox/Editor/utils/get-vscode-theme';
import { useSignals, useStore } from 'app/store';
import { modals } from './modals';

export const Modals = observer(() => {
  const { modalClosed } = useSignals();
  const {
    preferences: { settings },
    editor: { currentSandbox },
    currentModal,
  } = useStore();
  const [theme, setTheme] = useState({ colors: {}, vscodeTheme: codesandbox });

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setTheme(await getVSCodeTheme('', settings.customVSCodeTheme));
      } catch (e) {
        console.error(e);
      }
    };
    loadTheme();
  }, [settings.customVSCodeTheme]);

  const templateDef =
    currentSandbox && getTemplateDefinition(currentSandbox.template);
  const modal = currentModal && modals[currentModal];

  return (
    <ThemeProvider
      theme={{
        templateColor: templateDef && templateDef.color,
        templateBackgroundColor: templateDef && templateDef.backgroundColor,
        ...theme,
      }}
    >
      <Modal
        isOpen={Boolean(modal)}
        width={modal && modal.width}
        top={modal && modal.top}
        onClose={(isKeyDown: boolean) => modalClosed({ isKeyDown })}
      >
        {modal
          ? React.createElement(modal.Component, {
              closeModal: () => modalClosed({ isKeyDown: false }),
            })
          : null}
      </Modal>
    </ThemeProvider>
  );
});
