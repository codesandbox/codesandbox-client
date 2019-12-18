/** TODO:
- convert to typescript
- add default module to show
- check what initial path does
- visual polish
	- overflow-x
	- multiline
	- style more info in brackets
	- total height of the container is beyond preview
- add postMessage to embed for smoother embed modal
- include darkMode in settings
*/

import React from 'react';
import queryString from 'query-string';
import { ThemeProvider } from 'styled-components';
import { theme } from '@codesandbox/common/lib/design-language';

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
  fontSize: 14,
  highlightLines: null,
  initialPath: '/',
  useCodeMirror: false,
  enableESLint: false,
  defaultFile: null,
  showNavigation: false,
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

function getUrl(settings, darkMode) {
  const flags = {
    hidenavigation: settings.showNavigation ? 0 : 1,
    theme: darkMode ? 'dark' : 'light',
    fontsize: settings.fontSize || 14,
    expanddevtools: settings.expandDevTools ? 1 : null,
    hidedevtools: settings.expandDevTools ? 0 : 1,
    view: getView(settings),
    previewwindow: settings.showTests ? 'tests' : null,
    codemirror: settings.useCodeMirror ? 1 : null,
    highlights: settings.highlightLines || null,
    eslint: settings.enableESLint ? 1 : null,
    initialpath: settings.initialPath || null,
  };

  const stringified = queryString.stringify(flags, {
    encode: false,
    skipNull: true,
  });

  const url =
    `https://codesandbox.io/embed/dark-magic-variant-5pj49?` + stringified;

  return url;
}

function ShareModal() {
  const [settings, setSettings] = React.useState({
    preset: 'split-view',
    ...globalOptions,
    ...presets['split-view'],
  });

  const [darkMode, setDarkMode] = React.useState<boolean>(true);

  const change = property => {
    setSettings({ ...settings, preset: 'custom', ...property });
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
              <Switch on={darkMode} onChange={() => setDarkMode(!darkMode)} />
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
          </Section>
          <SectionBody>
            <TextArea
              code
              rows={5}
              readOnly
              value={getUrl(settings, darkMode)}
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
                value={getUrl(settings, darkMode).replace('embed', 's')}
              />
            </Option>
          </SectionBody>
        </Sidebar>
        <Preview>
          <iframe
            src={getUrl(settings, darkMode)}
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
