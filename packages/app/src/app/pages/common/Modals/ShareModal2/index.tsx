/**
Done: 
- convert to typescript
- include darkMode in settings
- check what initial path does
- add default module to show
TODO:
- visual polish
	- overflow-x
	- multiline
	- style more info in brackets
	- total height of the container is beyond preview
BONUS:
- add postMessage to embed for smoother embed modal
*/

import React from 'react';
import queryString from 'query-string';
import { useOvermind } from 'app/overmind';
import { ThemeProvider } from 'styled-components';

import { theme } from '@codesandbox/common/lib/design-language';
import { Sandbox } from '@codesandbox/common/lib/types';

import FileTree from 'embed/components/Sidebar/FileTree';
import { Section, SectionBody, Switch } from './components';

import {
  Container,
  Sidebar,
  Heading,
  Description,
  Option,
  Input,
  TextArea,
  Button,
  Preview,
} from './elements';

// outside of presets
const globalOptions = {
  darkMode: true,
  fontSize: 14,
  highlightLines: null,
  initialPath: '/',
  useCodeMirror: false,
  enableESLint: false,
  defaultFile: null,
  showNavigation: false,
  currentModuleId: null,
};

const presets = {
  'split-view': {
    showEditor: true,
    showPreview: true,
    showNavigation: false,
    expandDevtools: false,
    showTests: false,
  },
  'preview-only': {
    showEditor: false,
    showPreview: true,
    showNavigation: false,
    expandDevtools: false,
    showTests: false,
  },
  'code-only': {
    showEditor: true,
    showPreview: false,
  },
  'code-with-tests': {
    showEditor: true,
    showPreview: true,
    showNavigation: false,
    expandDevtools: true,
    showTests: true,
  },
};

function getView({ showEditor, showPreview }) {
  if (showEditor && showPreview) return 'split';
  if (showEditor) return 'editor';
  return 'preview';
}

const getModulePath = ({
  sandbox,
  moduleId,
}: {
  sandbox: Sandbox;
  moduleId: string;
}): string => {
  const selectedModule = sandbox.modules.find(module => module.id === moduleId);
  return selectedModule.path;
};

function getUrl({ settings, sandbox }) {
  const flags = {
    hidenavigation: settings.showNavigation ? 0 : 1,
    theme: settings.darkMode ? 'dark' : 'light',
    fontsize: settings.fontSize || 14,
    expanddevtools: settings.expandDevTools ? 1 : null,
    hidedevtools: settings.expandDevTools ? 0 : 1,
    view: getView(settings),
    previewwindow: settings.showTests ? 'tests' : null,
    codemirror: settings.useCodeMirror ? 1 : null,
    highlights: settings.highlightLines || null,
    eslint: settings.enableESLint ? 1 : null,
    initialpath: settings.initialPath || null,
    module: settings.currentModuleId
      ? getModulePath({ sandbox, moduleId: settings.currentModuleId })
      : null,
  };

  const stringified = queryString.stringify(flags, {
    encode: false,
    skipNull: true,
  });

  const url = `https://codesandbox.io/embed/${sandbox.alias}?` + stringified;

  return url;
}

function ShareModal() {
  const {
    state: {
      editor: { currentSandbox: sandbox, mainModule },
    },
  } = useOvermind();

  const [settings, setSettings] = React.useState({
    preset: 'split-view',
    ...globalOptions,
    ...presets['split-view'],
  });

  const change = property => {
    setSettings(currentSettings => {
      // set new property in settings
      const newSettings = { ...currentSettings, ...property };

      // if the property is part of a preset options (not global options),
      // then change preset to custom
      const propertyName = Object.keys(property)[0];
      if (Object.prototype.hasOwnProperty.call(globalOptions, propertyName)) {
        newSettings.preset = 'custom';
      }

      return newSettings;
    });
  };

  const toggle = property => {
    change({ [property]: !settings[property] });
  };

  const applyPreset = name => {
    setSettings({ ...settings, preset: name, ...presets[name] });
  };

  /** Copy Embed code */
  const urlContainer = React.useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = React.useState(false);

  const copyEmbedCode = () => {
    const copyText = urlContainer.current;
    copyText.select();
    document.execCommand('copy');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Sidebar>
          <SectionBody style={{ paddingBottom: 0 }}>
            <Heading>Embed</Heading>
            <Description>
              Customize the embed to better intergrate with your website, blog
              or documentation
            </Description>
            <Option>
              <Input
                as="select"
                placeholder="Select an preset"
                onChange={event => applyPreset(event.target.value)}
                value={settings.preset}
              >
                <option value="split-view">Split view</option>
                <option value="preview-only">Preview only</option>
                <option value="code-only">Code only</option>
                <option value="code-with-tests">Code with tests</option>
                <option value="custom">Custom</option>
              </Input>
            </Option>
            <Option>
              Dark theme
              <Switch
                on={settings.darkMode}
                onChange={() => toggle('darkMode')}
              />
            </Option>
          </SectionBody>

          <Section title="Editor">
            <Option>
              Show Editor
              <Switch
                on={settings.showEditor}
                onChange={() => toggle('showEditor')}
              />
            </Option>
            <Option disabled={!settings.showEditor}>
              Font-size
              <Input
                type="number"
                defaultValue={String(settings.fontSize)}
                disabled={!settings.showEditor}
                onChange={event => change({ fontSize: event.target.value })}
              />
            </Option>
          </Section>

          <Section title="Preview">
            <Option>
              Show Preview
              <Switch
                on={settings.showPreview}
                onChange={() => toggle('showPreview')}
              />
            </Option>
            <Option disabled={!settings.showPreview}>
              Show Navigation Bar
              <Switch
                on={settings.showNavigation}
                onChange={() => toggle('showNavigation')}
                disabled={!settings.showPreview}
              />
            </Option>
            <Option disabled={!settings.showPreview}>
              Expand Dev Tools
              <Switch
                disabled={!settings.showPreview}
                onChange={() => toggle('expandDevTools')}
              />
            </Option>
            <Option disabled={!settings.showPreview}>
              Show Tests (instead of preview)
              <Switch
                on={settings.showTests}
                onChange={() => toggle('showTests')}
                disabled={!settings.showPreview}
              />
            </Option>
          </Section>
          <Section title="Advanced Options">
            <Option>
              Use CodeMirror insted of Monaco
              <Switch
                on={settings.useCodeMirror}
                onChange={() => toggle('useCodeMirror')}
                disabled={!settings.showEditor}
              />
            </Option>
            <Option disabled={!settings.useCodeMirror}>
              Highlight lines (with CodeMirror)
              <Input
                type="text"
                defaultValue={settings.highlightLines}
                placeholder="1,2,3"
                onChange={event =>
                  change({ highlightLines: event.target.value })
                }
                disabled={!settings.useCodeMirror}
              />
            </Option>
            <Option>
              Enable ESLint (bigger bundle size)
              <Switch
                on={settings.enableESLint}
                onChange={() => toggle('enableESLint')}
              />
            </Option>
            <Option multiline>
              Project Initial Path
              <Input
                placeholder="e.g. /home"
                onChange={event =>
                  change({
                    initialPath: event.target.value,
                  })
                }
              />
            </Option>
            <Option multiline>
              Default file to show
              <ThemeProvider
                theme={{
                  // we borrow this component from embed, so we have to pass
                  // it the required theme token
                  colors: { sideBar: { border: theme.colors.grays[700] } },
                }}
              >
                <FileTree
                  sandbox={sandbox}
                  currentModuleId={settings.currentModuleId || mainModule.id}
                  setCurrentModuleId={value =>
                    change({ currentModuleId: value })
                  }
                />
              </ThemeProvider>
            </Option>
          </Section>
          <SectionBody>
            <TextArea
              code
              rows={5}
              readOnly
              value={getUrl({ settings, sandbox })}
              ref={urlContainer}
            />
            <Button onClick={copyEmbedCode}>
              {copied ? 'Copied!' : 'Copy Embed Code'}
            </Button>
            <Option multiline>
              Editor url (also works on Medium)
              <Input
                code
                readOnly
                value={getUrl({ settings, sandbox }).replace('embed', 's')}
              />
            </Option>
          </SectionBody>
        </Sidebar>
        <Preview>
          <iframe
            src={getUrl({ settings, sandbox })}
            title="Dark Magic Variant"
            allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
            sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
          />
        </Preview>
      </Container>
    </ThemeProvider>
  );
}

export { ShareModal };
