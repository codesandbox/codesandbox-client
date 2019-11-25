import React from 'react';
import queryString from 'query-string';
import { ThemeProvider } from 'styled-components';
import { theme } from '@codesandbox/common/lib/design-language';

import {
  Container,
  Sidebar,
  Section,
  Heading,
  Description,
  Option,
  Input,
  TextArea,
  Button,
  Switch,
  Preview,
} from './elements';

// outside of presets
const globalOptions = {
  fontSize: 14,
  highlightLines: null,
  initialPath: '/',
  useCodemirror: false,
  enableEslint: false,
  defaultFile: null,
  showNavigation: false,
};

const presets = {
  'split-view': {
    showEditor: true,
    showTabbarSidebar: true,
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
    showTabbarSidebar: false,
    showPreview: false,
  },
  'code-with-tests': {
    showEditor: true,
    showTabbarSidebar: true,
    showPreview: true,
    showNavigation: false,
    expandDevtools: true,
    showTests: true,
  },
};

function ShareSheet() {
  const [settings, setSettings] = React.useState({
    preset: 'split-view',
    ...globalOptions,
    ...presets['split-view'],
  });

  const [darkMode, setDarkMode] = React.useState(true);

  const change = property => {
    setSettings({ ...settings, preset: 'custom', ...property });
  };

  const toggle = property => {
    change({ [property]: !settings[property] });
  };

  const applyPreset = name => {
    setSettings({ ...settings, preset: name, ...presets[name] });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Sidebar>
          <Section.Body css={{ paddingBottom: 0 }}>
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
          </Section.Body>

          <Section title="Editor">
            <Option>
              Show Editor
              <Switch
                on={settings.showEditor}
                onChange={() => toggle('showEditor')}
              />
            </Option>
            <Option disabled={!settings.showEditor}>
              <span style={{ textDecoration: 'line-through' }}>
                Tabbar + Sidebar
              </span>
              <Switch
                on={settings.showEditorControls}
                disabled={!settings.showEditor}
                onChange={() => toggle('showEditorControls')}
              />
            </Option>
            <Option disabled={!settings.showEditor}>
              Font-size
              <Input
                type="number"
                defaultValue={settings.fontSize}
                disabled={!settings.showEditor}
                onChange={event => change({ fontSize: event.target.value })}
              />
            </Option>
            <Option disabled={!settings.showEditor}>
              Highlight lines (with CodeMirror)
              <Input
                type="text"
                defaultValue={settings.highlightLines}
                onChange={event =>
                  change({ highlightLines: event.target.value })
                }
                disabled={!settings.showEditor}
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
              <Switch on />
            </Option>
            <Option>
              Enable eslint (bigger bundle size)
              <Switch />
            </Option>
            <Option multiline>
              Project Initial Path
              <Input placeholder="e.g. /home" />
            </Option>
          </Section>
          <Section.Body>
            <TextArea
              as="textarea"
              code
              rows="5"
              readOnly
              value={`<iframe src="https://codesandbox.io/embed/portfolio-danny-ruchtie-4q2i9?autoresize=1&fontsize=14" title="Portfolio Danny Ruchtie"`}
            />
            <Button>Copy Embed Code</Button>
            <Option multiline>
              Editor url (also works on Medium)
              <Input code readOnly value="https://codesandbox.io/s/xoj79" />
            </Option>
          </Section.Body>
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

function getUrl(settings, darkMode) {
  const flags = {
    hidenavigation: settings.showNavigation ? 0 : 1,
    theme: darkMode ? 'dark' : 'light',
    fontsize: 14,
    expanddevtools: settings.expandDevTools ? 1 : null,
    hidedevtools: settings.expandDevTools ? 0 : 1,
    view:
      settings.showEditor && settings.showPreview
        ? 'split'
        : settings.showEditor
        ? 'editor'
        : 'preview',
    previewwindow: settings.showTests ? 'tests' : null,
  };

  const stringified = queryString.stringify(flags, { skipNull: true });
  const url =
    `https://codesandbox.io/embed/dark-magic-variant-5pj49?` + stringified;

  return url;
}

export default ShareSheet;
