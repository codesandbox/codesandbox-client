import {
  Button,
  Text,
  Stack,
  Element,
  Collapsible,
  Textarea,
  Input,
  FormField,
} from '@codesandbox/components';
import css from '@styled-system/css';
import track from '@codesandbox/common/lib/utils/analytics';
import { useOvermind } from 'app/overmind';
// eslint-disable-next-line
import Files from 'embed/components/Sidebar/FileTree';
import React, { useEffect, useState } from 'react';

import { PaddedPreference } from './elements';
import { VIEW_OPTIONS, getEditorUrl, getIframeScript } from './getCode';
import { SocialShare } from './SocialShare';

interface Props {}

export const Field = ({ children, label }) => (
  <FormField
    css={css({
      padding: 0,
      marginTop: 4,
      label: {
        marginBottom: 1,
      },
    })}
    direction="vertical"
    label={label}
  >
    {children}
  </FormField>
);

export const ShareModal: React.FC<Props> = () => {
  const {
    state: { editor },
    effects,
  } = useOvermind();
  const [copied, setCopied] = useState(false);
  const [state, updateState] = useState({
    view: VIEW_OPTIONS[0],
    theme: 'dark',
    testsView: false,
    defaultModule: null,
    autoResize: false,
    hideNavigation: true,
    isCurrentModuleView: false,
    fontSize: 14,
    initialPath: '',
    useCodeMirror: false,
    enableEslint: false,
    expandDevTools: false,
  });

  useEffect(() => {
    track('Share Modal Opened', {});
  }, []);

  function setDefaultModule(id: string) {
    updateState({ ...state, defaultModule: id });
  }

  function setAutoResize(autoResize: boolean) {
    updateState({ ...state, autoResize });
  }

  function setHideNavigation(hideNavigation: boolean) {
    updateState({ ...state, hideNavigation });
  }

  function setUseCodeMirror(useCodeMirror: boolean) {
    updateState({ ...state, useCodeMirror });
  }

  function setEnableEslint(enableEslint: boolean) {
    updateState({ ...state, enableEslint });
  }

  function setIsCurrentModuleView(isCurrentModuleView: boolean) {
    updateState({ ...state, isCurrentModuleView });
  }

  function setExpandDevTools(expandDevTools: boolean) {
    updateState({ ...state, expandDevTools });
  }

  function setFontSize(fontSize: number) {
    updateState({ ...state, fontSize });
  }

  function setTestsView(testsView: boolean) {
    updateState({ ...state, testsView });
  }

  function setInitialPath({ target }) {
    const initialPath = target.value;
    updateState({ ...state, initialPath });
  }

  function setView(view: string) {
    updateState({ ...state, view });
  }

  function setTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    updateState({ ...state, theme: newTheme });
  }

  function select(event) {
    event.target.select();
  }

  const {
    mainModule,
    currentSandbox: sandbox,
  }: { mainModule: any; currentSandbox: any } = editor;
  const {
    view,
    theme,
    testsView,
    autoResize,
    hideNavigation,
    isCurrentModuleView,
    fontSize,
    initialPath,
    useCodeMirror,
    enableEslint,
    expandDevTools,
  } = state;

  const defaultModule = state.defaultModule || mainModule.id;

  return (
    <Stack>
      <Element
        css={css({
          overflow: 'auto',
          width: 320,
          maxHeight: 600,
          backgroundColor: 'sideBar.background',
          borderRight: '1px solid',
          borderColor: 'sideBar.border',
        })}
      >
        <Collapsible title="Embed" defaultOpen>
          <Element paddingX={4}>
            <Text block variant="muted">
              Customize the embed to better integrate with your website, blog or
              documentation{' '}
            </Text>
            <Element
              marginTop={4}
              css={css({
                'div > div': {
                  width: '100%',
                },
              })}
            >
              <PaddedPreference
                type="dropdown"
                options={VIEW_OPTIONS}
                value={view}
                setValue={setView}
              />
            </Element>
            <Element marginTop={4}>
              <PaddedPreference
                title="Light Theme"
                type="boolean"
                value={theme === 'light'}
                setValue={setTheme}
              />
            </Element>
          </Element>
        </Collapsible>
        <Collapsible title="Share" defaultOpen>
          <Element paddingX={4}>
            <Textarea
              onFocus={select}
              value={getIframeScript(sandbox, mainModule, state, 500)}
              readOnly
            />
            <Button
              marginTop={4}
              onClick={() => {
                setCopied(true);
                window.setTimeout(() => {
                  setCopied(false);
                }, 2000);
                effects.browser.copyToClipboard(
                  getIframeScript(sandbox, mainModule, state, 500)
                );
              }}
            >
              {copied ? 'Copied' : 'Copy Embed Code'}
            </Button>
            <Field label="Editor url (also works on Medium)">
              <Input
                onFocus={select}
                value={getEditorUrl(sandbox, mainModule, state)}
                readOnly
              />
            </Field>
          </Element>
        </Collapsible>
        <Collapsible title="Preview">
          <Element paddingX={4}>
            <PaddedPreference
              title="Auto resize"
              type="boolean"
              tooltip="Works only on Medium"
              value={autoResize}
              setValue={setAutoResize}
            />
            <PaddedPreference
              title="Hide navigation bar"
              type="boolean"
              value={hideNavigation}
              setValue={setHideNavigation}
            />
            <PaddedPreference
              title="Expand console"
              type="boolean"
              value={expandDevTools}
              setValue={setExpandDevTools}
            />
            <PaddedPreference
              title="Show current module view"
              type="boolean"
              tooltip="Only show the module that's currently open"
              value={isCurrentModuleView}
              setValue={setIsCurrentModuleView}
            />
            <PaddedPreference
              title="Show Tests (instead of browser preview)"
              type="boolean"
              value={testsView}
              setValue={setTestsView}
            />
            <PaddedPreference
              title="Font size"
              type="number"
              value={fontSize}
              setValue={setFontSize}
            />
          </Element>
        </Collapsible>
        <Collapsible title="Advanced Options">
          <Element paddingX={4}>
            <PaddedPreference
              title="Use CodeMirror instead of Monaco editor"
              type="boolean"
              value={useCodeMirror}
              setValue={setUseCodeMirror}
            />
            <PaddedPreference
              title="Enable eslint (significantly higher bundle size)"
              type="boolean"
              value={enableEslint}
              setValue={setEnableEslint}
            />
            <div>
              <Text size={3} block paddingBottom={2}>
                Default module to show
              </Text>
              <Element
                css={css({
                  maxHeight: 300,
                  overflow: 'auto',
                  '> div > div[class*="FileContainer"]': {
                    paddingLeft: 0,
                  },
                })}
              >
                {/* @ts-ignore */}
                <Files
                  sandbox={sandbox}
                  currentModuleId={defaultModule}
                  setCurrentModuleId={setDefaultModule}
                />
              </Element>
            </div>
            <Field label="Project Initial Path">
              <Input
                onFocus={select}
                placeholder="e.g: /home"
                value={initialPath}
                onChange={setInitialPath}
              />
            </Field>
          </Element>
        </Collapsible>
        <SocialShare
          sandbox={sandbox}
          mainModule={mainModule}
          state={state}
          select={select}
        />
      </Element>
      <Element
        css={css({
          width: '100%',
          height: '100%',
          position: 'relative',
          iframe: {
            display: 'block',
            borderRadius: '0 !important',
          },
        })}
        // eslint-disable-next-line
        dangerouslySetInnerHTML={{
          __html: getIframeScript(sandbox, mainModule, state, 600),
        }}
      />
    </Stack>
  );
};
