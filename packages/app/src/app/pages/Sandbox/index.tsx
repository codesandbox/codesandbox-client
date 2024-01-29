import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { useAppState, useActions } from 'app/overmind';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

import { useBetaSandboxEditor } from 'app/hooks/useBetaSandboxEditor';
import { Editor } from './Editor';
import { OnBoarding } from './OnBoarding';

interface Props {
  showNewSandboxModal?: boolean;
  match?: {
    params: {
      id: string;
    };
  };
}

export const Sandbox = React.memo<Props>(
  ({ match, showNewSandboxModal }) => {
    const state = useAppState();
    const actions = useActions();
    const [hasBetaEditorExperiment] = useBetaSandboxEditor();
    const { sandboxPageMounted } = actions;

    /**
     * !important Hard bug fix
     *
     * This address temporarily many unexpected
     * behaviors that occurs when  navigating away
     * from the editor and go back to it
     * Eg: Editor -> Dashboard -> Editor
     *
     * @link https://www.notion.so/Unexpected-behaviors-when-navigating-away-from-the-editor-and-go-back-to-it-b5fcc670c3fb46afa8a57dd05f701bcb
     */
    useEffect(() => {
      if (window.CSEditor) {
        window.location.reload();
      }
    }, []);

    useEffect(() => {
      sandboxPageMounted();
    }, [sandboxPageMounted]);

    useEffect(() => {
      if (!showNewSandboxModal) {
        if (window.screen.availWidth < 800) {
          if (!document.location.search.includes('from-embed')) {
            const addedSign = document.location.search ? '&' : '?';
            document.location.href =
              document.location.href.replace('/s/', '/embed/') +
              addedSign +
              'codemirror=1';
          } else {
            actions.preferences.codeMirrorForced();
          }
        }
      }

      actions.live.onNavigateAway();
      if (match?.params) {
        actions.editor.sandboxChanged({
          id: match.params.id,
          hasBetaEditorExperiment,
        });
      }

      // eslint-disable-next-line
    }, [
      actions.live,
      actions.editor,
      actions.preferences,
      showNewSandboxModal,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      match?.params,
    ]);

    useEffect(
      () => () => {
        actions.live.onNavigateAway();
      },
      [actions.live]
    );

    const sandbox = state.editor.currentSandbox;

    const getTitle = () => {
      if (showNewSandboxModal) {
        return 'Create a new Sandbox';
      }

      if (sandbox) {
        return getSandboxName(sandbox);
      }

      return 'Loading...';
    };

    return (
      <>
        <Helmet>
          <title>{getTitle()} - CodeSandbox</title>
        </Helmet>
        <OnBoarding />
        <Editor showNewSandboxModal={showNewSandboxModal} />
      </>
    );
  },
  (prev, next) => prev.match.params.id === next.match.params.id
);
