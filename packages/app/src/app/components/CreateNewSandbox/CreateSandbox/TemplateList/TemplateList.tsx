import React from 'react';
import { TemplateFragment } from 'app/graphql/types';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import getTemplateDefinition, {
  TemplateType,
} from '@codesandbox/common/lib/templates';
import { useAppState, useActions } from 'app/overmind';
import useKey from 'react-use/lib/useKey';
import { isMac } from '@codesandbox/common/lib/utils/platform';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import history from 'app/utils/history';
import MdEditIcon from 'react-icons/lib/md/edit';

import { Tooltip } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { SandboxCard } from '../SandboxCard';
import { SubHeader, Grid } from '../elements';
import { EditIcon, TemplateInfoContainer } from './elements';

export interface ITemplateInfo {
  title?: string;
  key: string;
  templates: TemplateFragment[];
  isOwned?: boolean;
}

export interface ITemplateListProps {
  // ❗️ TODO: rename to templates
  templateInfos: ITemplateInfo[];
  forkOnOpen?: boolean;
  columnCount?: number;
  showSecondaryShortcuts?: boolean;
  collectionId?: string;
}

const MODIFIER_KEY = isMac ? 'Ctrl' : '⇧';

const getNumber = (e: KeyboardEvent): number => {
  if (e.code && e.code.startsWith('Digit')) {
    return parseInt(e.code.replace('Digit', ''), 10);
  }

  return NaN;
};

export const TemplateList = ({
  templateInfos,
  forkOnOpen,
  showSecondaryShortcuts,
  columnCount = 2,
  collectionId,
}: ITemplateListProps) => {
  const state = useAppState();
  const actions = useActions();
  const [focusedTemplateIndex, setFocusedTemplate] = React.useState(0);
  const lastMouseMoveEventAt = React.useRef<number>(Date.now());

  const openSandbox = (
    sandbox: TemplateFragment['sandbox'],
    openInNewWindow = false
  ) => {
    // We can't fork a sandbox that's server and if you're signed in, so then we just go to it
    const templateDefinition = getTemplateDefinition(
      sandbox.source.template as TemplateType
    );
    const cannotFork = templateDefinition.isServer && !state.isLoggedIn;

    if (forkOnOpen && !cannotFork) {
      actions.modals.newSandboxModal.close();
      actions.editor.forkExternalSandbox({
        sandboxId: sandbox.id,
        openInNewWindow,
        body: {
          collectionId,
        },
      });
    } else {
      history.push(sandboxUrl(sandbox));
    }

    return actions.modalClosed();
  };

  React.useEffect(() => {
    const listener = () => {
      lastMouseMoveEventAt.current = Date.now();
    };

    window.addEventListener('mousemove', listener);

    return () => {
      window.removeEventListener('mousemove', listener);
    };
  }, []);

  const getTemplateInfoByIndex = React.useCallback(
    (index: number) => {
      let count = 0;
      let i = 0;
      while (index >= count && i < templateInfos.length) {
        count += templateInfos[i].templates.length;
        i++;
      }
      return {
        templateInfo: templateInfos[i - 1],
        offset: count - templateInfos[i - 1].templates.length,
      };
    },
    [templateInfos]
  );

  const getTemplateByIndex = React.useCallback(
    (index: number) => {
      const { templateInfo, offset } = getTemplateInfoByIndex(index);

      const indexInTemplateInfo = index - offset;
      return templateInfo.templates[indexInTemplateInfo];
    },
    [getTemplateInfoByIndex]
  );

  const getTotalTemplateCount = React.useCallback(
    () =>
      templateInfos.reduce(
        (total, templateInfo) => total + templateInfo.templates.length,
        0
      ),
    [templateInfos]
  );

  /**
   * Ensures that the next set is in bound of 0 and the max template count
   */
  const safeSetFocusedTemplate = React.useCallback(
    (setter: (newPos: number) => number) => {
      const totalCount = getTotalTemplateCount();

      return setFocusedTemplate(i =>
        Math.max(0, Math.min(setter(i), totalCount - 1))
      );
    },
    [getTotalTemplateCount]
  );

  React.useEffect(() => {
    // Make sure our index stays in bounds with max templateInfos

    const totalCount = getTotalTemplateCount();

    if (focusedTemplateIndex >= totalCount || focusedTemplateIndex < 0) {
      safeSetFocusedTemplate(i => i);
    }

    // We only want this check to happen if templateInfos changes. Only then we
    // can get our index out of bounds
    // eslint-disable-next-line
  }, [templateInfos]);

  /**
   * Our listener for CMD/CTRL + Num calls
   */
  useKey(
    e => {
      const num = getNumber(e);
      const modifierCheck = isMac ? e.ctrlKey : e.shiftKey;
      return num > 0 && num < 10 && modifierCheck;
    },
    e => {
      if (showSecondaryShortcuts) {
        const num = getNumber(e);

        const template = getTemplateByIndex(num - 1);

        if (!template) {
          return;
        }

        track('Template Modal - Open Sandbox', { source: 'num-keys' });
        openSandbox(template.sandbox);
      }
    },
    {},
    [focusedTemplateIndex, getTemplateByIndex, openSandbox]
  );

  /**
   * We have this one to listen to any opening when focus is on an input
   */
  useKey(
    'Enter',
    e => {
      if (
        !e.defaultPrevented &&
        document.activeElement &&
        document.activeElement.tagName === 'INPUT'
      ) {
        e.preventDefault();
        const currentTemplate = getTemplateByIndex(focusedTemplateIndex);

        if (!currentTemplate) {
          // There are no sandboxes
          return;
        }

        track('Template Modal - Open Sandbox', { source: 'enter' });
        openSandbox(currentTemplate.sandbox, isMac ? e.metaKey : e.ctrlKey);
      }
    },
    {},
    [focusedTemplateIndex, getTemplateByIndex, openSandbox]
  );

  let offset = 0;
  return (
    <>
      {templateInfos.map(
        ({ templates, title, key, isOwned }, templateInfoIndex) => {
          if (templateInfoIndex > 0) {
            offset += templateInfos[templateInfoIndex - 1].templates.length;
          }

          if (templates.length === 0) {
            return null;
          }

          return (
            <TemplateInfoContainer key={key}>
              {title !== undefined && <SubHeader>{title}</SubHeader>}
              <Grid
                columnCount={window.screen.availWidth < 600 ? 1 : columnCount}
              >
                {templates.map((template: TemplateFragment, i) => {
                  const index = offset + i;
                  const focused = focusedTemplateIndex === offset + i;
                  const owner = template.sandbox
                    ? template.sandbox.collection?.team?.name ||
                      template.sandbox.author?.username
                    : '';
                  let shortKey = '';

                  if (showSecondaryShortcuts) {
                    shortKey = index < 9 ? `${MODIFIER_KEY}+${index + 1}` : '';
                  }

                  const detailText = focused ? '↵' : shortKey;

                  return (
                    <SandboxCard
                      key={template.id}
                      title={getSandboxName(template.sandbox)}
                      iconUrl={template.iconUrl}
                      // @ts-ignore
                      environment={template.sandbox.source.template}
                      owner={owner}
                      color={template.color}
                      onFocus={() => {
                        safeSetFocusedTemplate(() => index);
                      }}
                      onMouseOver={() => {
                        // This is to prevent selecting with your mouse on scroll move
                        if (Date.now() - lastMouseMoveEventAt.current < 500) {
                          safeSetFocusedTemplate(() => index);
                        }
                      }}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();

                          track('Template Modal - Open Sandbox', {
                            source: 'enter',
                          });
                          openSandbox(
                            template.sandbox,
                            isMac ? e.metaKey : e.ctrlKey
                          );
                        }
                      }}
                      onClick={e => {
                        e.preventDefault();

                        track('Template Modal - Open Sandbox', {
                          source: 'click',
                        });
                        openSandbox(
                          template.sandbox,
                          isMac ? e.metaKey : e.ctrlKey
                        );
                      }}
                      focused={focused}
                      detailText={detailText}
                      DetailComponent={
                        isOwned
                          ? () => (
                              <Tooltip label="Edit Template">
                                <EditIcon
                                  onClick={evt => {
                                    evt.stopPropagation();
                                    actions.modalClosed();
                                  }}
                                  to={sandboxUrl(template.sandbox)}
                                >
                                  <MdEditIcon />
                                </EditIcon>
                              </Tooltip>
                            )
                          : undefined
                      }
                    />
                  );
                })}
              </Grid>
            </TemplateInfoContainer>
          );
        }
      )}
    </>
  );
};
