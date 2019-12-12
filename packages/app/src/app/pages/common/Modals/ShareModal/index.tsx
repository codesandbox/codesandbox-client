import { Button } from '@codesandbox/common/lib/components/Button';
import track from '@codesandbox/common/lib/utils/analytics';
import { EMBED_LIGHT_THEME } from '@codesandbox/common/lib/utils/feature-flags';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
// eslint-disable-next-line
import Files from 'embed/components/legacy/Files';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';

import {
  ButtonContainer,
  FilesContainer,
  Inputs,
  LinkName,
  PaddedPreference,
  ShareOptions,
  SideTitle,
  Wrapper,
} from './elements';
import {
  BUTTON_URL,
  THEME_OPTIONS,
  VIEW_OPTIONS,
  getButtonHTML,
  getButtonMarkdown,
  getEditorUrl,
  getEmbedUrl,
  getIframeScript,
} from './getCode';
import { Title } from './Title';

interface Props {}

export const ShareModal: React.FC<Props> = () => {
  const {
    state: { editor },
  } = useOvermind();
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

  function setTheme(theme: string) {
    updateState({ ...state, theme });
  }

  function select(event) {
    event.target.select();
  }

  const { mainModule, currentSandbox: sandbox } = editor;
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
    <>
      <header
        // eslint-disable-next-line
        dangerouslySetInnerHTML={{
          __html: getIframeScript(sandbox, mainModule, state),
        }}
      />

      <ShareOptions>
        <Wrapper>
          <section>
            <SideTitle>Configure</SideTitle>
            <Title title="Appearance">
              <PaddedPreference
                title="Default View"
                type="dropdown"
                options={VIEW_OPTIONS}
                value={view}
                setValue={setView}
              />
              {EMBED_LIGHT_THEME && (
                <PaddedPreference
                  title="Theme"
                  type="dropdown"
                  options={THEME_OPTIONS}
                  value={theme}
                  setValue={setTheme}
                />
              )}
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
            </Title>
            <Title title="Sandbox Options">
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
                {/* eslint-disable-next-line */}
                <h4>Default module to show</h4>

                <FilesContainer>
                  {/* 
                  // @ts-ignore */}
                  <Files
                    modules={sandbox.modules}
                    directoryId={null}
                    directories={sandbox.directories}
                    currentModule={defaultModule}
                    setCurrentModule={setDefaultModule}
                  />
                </FilesContainer>
              </div>
            </Title>
            <Title title="Other Options">
              <Inputs>
                <LinkName>Project Initial Path</LinkName>
                <input
                  onFocus={select}
                  placeholder="e.g: /home"
                  value={initialPath}
                  onChange={setInitialPath}
                />
              </Inputs>
            </Title>
          </section>
          <section>
            <SideTitle>Share</SideTitle>
            <Title title="Share embed" open>
              <Inputs>
                <LinkName>Editor url (also works on Medium)</LinkName>
                <input
                  onFocus={select}
                  value={getEditorUrl(sandbox, mainModule, state)}
                  readOnly
                />
              </Inputs>
              <Inputs>
                <LinkName>Embed url</LinkName>
                <input
                  onFocus={select}
                  value={getEmbedUrl(sandbox, mainModule, state)}
                  readOnly
                />
              </Inputs>
              <Inputs>
                <LinkName>iframe</LinkName>
                <textarea
                  onFocus={select}
                  value={getIframeScript(sandbox, mainModule, state)}
                  readOnly
                />
              </Inputs>
            </Title>
            <Title title="Share CodeSandbox Button">
              <Inputs>
                <ButtonContainer>
                  <a href={sandboxUrl(sandbox)}>
                    <img alt={getSandboxName(sandbox)} src={BUTTON_URL} />
                  </a>
                </ButtonContainer>
              </Inputs>
              <Inputs>
                <LinkName>Markdown</LinkName>
                <textarea
                  onFocus={select}
                  value={getButtonMarkdown(sandbox, mainModule, state)}
                  readOnly
                />
              </Inputs>
              <Inputs>
                <LinkName>HTML</LinkName>
                <textarea
                  onFocus={select}
                  value={getButtonHTML(sandbox, mainModule, state)}
                  readOnly
                />
              </Inputs>
            </Title>
            <Title title="Share QR code">
              <Inputs>
                <QRCode
                  value={getEmbedUrl(sandbox, mainModule, state)}
                  size="100%"
                  renderAs="svg"
                />
              </Inputs>
            </Title>
            <Title title="Share on Social Media">
              <Inputs
                style={{
                  margin: '20px 0',
                }}
              >
                <Button
                  small
                  target="_blank"
                  href={`https://dev.to/new?prefill=---%5Cn%20title:${encodeURIComponent(
                    sandbox.title || sandbox.id
                  )}%5Cn%20published:%20false%5Cn%20tags:%20codesandbox%5Cn%20---%5Cn%20%5Cn%20%5Cn%20%5Cn%20%7B%25%20codesandbox%20${encodeURIComponent(
                    sandbox.id
                  )}%20%25%7D`}
                >
                  Share on DEV
                </Button>
                <Button
                  style={{ marginLeft: '1em' }}
                  small
                  target="_blank"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `${sandbox.title || sandbox.id}. ${getEditorUrl(
                      sandbox,
                      mainModule,
                      state
                    )}`
                  )}`}
                >
                  Share on Twitter
                </Button>
              </Inputs>
            </Title>
          </section>
        </Wrapper>
      </ShareOptions>
    </>
  );
};
