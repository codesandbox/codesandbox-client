import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { camelizeKeys } from 'humps';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import type { Module, Sandbox } from '@codesandbox/common/lib/types';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import {
  findCurrentModule,
  findMainModule,
} from '@codesandbox/common/lib/sandbox/modules';
import { isIOS, isAndroid } from '@codesandbox/common/lib/utils/platform';
import { Title } from 'app/components/Title';
import { SubTitle } from 'app/components/SubTitle';
import { signInPageUrl } from '@codesandbox/common/lib/utils/url-generator';
import { hasLogIn } from '@codesandbox/common/lib/utils/user';
import Content from '../Content';
import Sidebar from '../Sidebar';
import { Container, Fullscreen, Moving } from './elements';
import { SIDEBAR_SHOW_SCREEN_SIZE } from '../../util/constants';
import { getTheme } from '../../theme';

// Okay, this looks veeeery strange, we need this because Webpack has a bug currently
// that makes it think we havecore-js/es6/map available in embed, but we don't.
// So we explicitly make sure that we have `core-js/es6/map` available by declaring
// new Map.
new Map(); // eslint-disable-line

type State = {
  notFound: boolean,
  sandbox: ?Sandbox,
  fontSize: number,
  showEditor: boolean,
  showPreview: boolean,
  previewWindow: string,
  isInProjectView: boolean,
  currentModule: string,
  initialPath: string,
  sidebarOpen: boolean,
  autoResize: boolean,
  hideNavigation: boolean,
  enableEslint: boolean,
  useCodeMirror: boolean,
  editorSize: number,
  forceRefresh: boolean,
  expandDevTools: boolean,
  hideDevTools: boolean,
  runOnClick: boolean,
  verticalMode: boolean,
  highlightedLines: Array<number>,
  tabs?: Array<number>,
  theme: string,
};

export default class App extends React.PureComponent<
  {
    id?: string,
    embedOptions?: Object,
    sandbox?: any,
  },
  State
> {
  constructor(props) {
    super(props);

    const {
      currentModule,
      initialPath,
      isInProjectView,
      isPreviewScreen,
      isEditorScreen,
      previewWindow,
      isSplitScreen,
      autoResize,
      hideNavigation,
      fontSize,
      enableEslint,
      useCodeMirror,
      editorSize,
      highlightedLines,
      forceRefresh,
      expandDevTools,
      hideDevTools,
      runOnClick,
      verticalMode = window.innerWidth < window.innerHeight,
      tabs,
      theme = 'dark',
    } = props.embedOptions || getSandboxOptions(document.location.href);

    this.state = {
      notFound: false,
      sandbox: this.props.sandbox || null,
      fontSize: fontSize || 16,
      showEditor: isSplitScreen || isEditorScreen,
      showPreview: isSplitScreen || isPreviewScreen,
      previewWindow,
      isInProjectView,
      currentModule,
      initialPath,
      sidebarOpen: window.innerWidth > SIDEBAR_SHOW_SCREEN_SIZE,
      autoResize,
      hideNavigation,
      enableEslint,
      useCodeMirror,
      editorSize,
      forceRefresh,
      expandDevTools,
      hideDevTools,
      tabs,
      theme,
      runOnClick: runOnClick === undefined ? isAndroid || isIOS : runOnClick,
      verticalMode,
      highlightedLines: highlightedLines || [],
    };
  }

  getId = () => {
    if (this.props.id) {
      return this.props.id;
    }

    if (this.props.sandbox) {
      return this.props.sandbox.id;
    }

    const matches = location.pathname.match(/^\/embed\/(.*?)$/);

    if (matches && matches.length > 1) {
      return matches[1];
    }
    return null;
  };

  getAppOrigin = () => location.origin.replace('embed.', '');

  fetchSandbox = async (id: string) => {
    if (id === 'custom') {
      await new Promise(resolve => {
        window.parent.postMessage('ready', '*');
        window.addEventListener('message', e => {
          if (e.data && e.data.sandbox) {
            this.setState({
              sandbox: e.data.sandbox,
            });

            resolve();
          }
        });
      });
    } else {
      try {
        const response = await fetch(
          `${this.getAppOrigin()}/api/v1/sandboxes/${id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.jwt()}`,
              'x-codesandbox-client': 'legacy-embed',
            },
          }
        )
          .then(res => res.json())
          .then(camelizeKeys);

        document.title = `${
          response.data.title || response.data.id
        } - CodeSandbox`;

        this.setState({ sandbox: response.data });
      } catch (e) {
        this.setState({ notFound: true });
      }
    }
  };

  UNSAFE_componentWillMount() {
    if (window.__SANDBOX_DATA__) {
      this.setState({ sandbox: camelizeKeys(window.__SANDBOX_DATA__) });
    } else {
      const id = this.getId();

      if (!id) {
        this.setState({ notFound: true });
        return;
      }

      this.fetchSandbox(id);
    }
  }

  // TODO: See if this is still useful
  setEditorView = () => this.setState({ showEditor: true, showPreview: false });
  setPreviewView = () =>
    this.setState({ showEditor: false, showPreview: true });

  setMixedView = () => this.setState({ showEditor: true, showPreview: true });

  setCurrentModule = (id: string) => {
    const newState: {
      currentModule: string,
      showEditor?: boolean,
      showPreview?: boolean,
    } = { currentModule: id };

    if (!this.state.showEditor) {
      newState.showEditor = true;
      if (this.state.showPreview) {
        // Means that the user was only looking at preview, which suggests that the screen is small.
        newState.showPreview = false;
      }
    }

    this.setState(newState);
  };

  toggleSidebar = () =>
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));

  // eslint-disable-next-line
  setProjectView = (sandboxId?: ?string, isOpen: boolean, cb: Function) => {
    return this.setState({ isInProjectView: isOpen }, cb);
  };

  getCurrentModuleFromPath = (sandbox: Sandbox): Module => {
    const { currentModule: currentModulePath } = this.state;

    return findCurrentModule(
      sandbox.modules,
      sandbox.directories,
      currentModulePath,
      findMainModule(sandbox)
    );
  };

  jwt = () => {
    try {
      return JSON.parse(localStorage.getItem('jwt'));
    } catch (e) {
      return undefined;
    }
  };

  toggleLike = () => {
    const jwt = this.jwt();
    track('Embed - Toggle Like');

    const sandboxId = this.state.sandbox.id;
    if (sandboxId.includes('/')) {
      // The sandbox id comes from a message that's sent to the window,
      // so we can't trust it. We'll check if there's a / in there.
      return;
    }
    if (this.state.sandbox.userLiked && jwt) {
      this.setState(s => ({
        sandbox: {
          ...s.sandbox,
          userLiked: false,
          likeCount: s.sandbox.likeCount - 1,
        },
      }));
      fetch(`/api/v1/sandboxes/${sandboxId}/likes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
          'x-codesandbox-client': 'legacy-embed',
        },
        body: JSON.stringify({
          id: sandboxId,
        }),
      })
        .then(x => x.json())
        .then(res => {
          this.setState(s => ({
            sandbox: {
              ...s.sandbox,
              userLiked: false,
              likeCount: res.count,
            },
          }));
        })
        .catch(() => {
          this.setState(s => ({
            sandbox: {
              ...s.sandbox,
              userLiked: true,
              likeCount: s.sandbox.likeCount + 1,
            },
          }));
        });
    } else {
      this.setState(s => ({
        sandbox: {
          ...s.sandbox,
          userLiked: true,
          likeCount: s.sandbox.likeCount + 1,
        },
      }));
      fetch(`/api/v1/sandboxes/${sandboxId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
          'x-codesandbox-client': 'legacy-embed',
        },
      })
        .then(x => x.json())
        .then(res => {
          this.setState(s => ({
            sandbox: { ...s.sandbox, userLiked: true, likeCount: res.count },
          }));
        })
        .catch(() => {
          this.setState(s => ({
            sandbox: {
              ...s.sandbox,
              userLiked: false,
              likeCount: s.sandbox.likeCount - 1,
            },
          }));
        });
    }
  };

  content = () => {
    if (this.state.notFound) {
      const isSignedIn = hasLogIn();
      return (
        <Centered style={{ height: '100%' }} vertical horizontal>
          <div style={{ maxWidth: 900, textAlign: 'center' }}>
            <Title style={{ textAlign: 'center' }} delay={0.1}>
              Not Found
            </Title>
            <SubTitle style={{ marginTop: 16, lineHeight: 1.4 }} delay={0.05}>
              We could not find the sandbox you{"'"}re looking for.
              {!isSignedIn && (
                <p style={{ marginTop: 8 }}>
                  If the sandbox is private, you might need to{' '}
                  <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href={signInPageUrl()}
                  >
                    sign in
                  </a>
                  <br />
                  and reload the page to see the sandbox.
                </p>
              )}
            </SubTitle>
          </div>
        </Centered>
      );
    }

    const { sandbox } = this.state;

    if (!sandbox) {
      return (
        <Centered vertical horizontal>
          <Title delay={0.3}>Loading Sandbox...</Title>
        </Centered>
      );
    }

    const {
      showEditor,
      verticalMode,
      showPreview,
      previewWindow,
      isInProjectView,
      runOnClick,
    } = this.state;

    /**
     * Sandpack integration
     */
    if (/sandpack=experimental/.test(window.location.search)) {
      const sandpackFiles = sandbox.modules.reduce((acc, module) => {
        const folder = sandbox.directories.find(
          d => d.shortid === module.directoryShortid
        )?.title;

        if (folder) {
          acc[`/${folder}/${module.title}`] = {
            code: module.code,
            id: module.id,
            path: `/${folder}/${module.title}`,
          };
        } else {
          acc[`/${module.title}`] = {
            code: module.code,
            id: module.id,
            path: module.title,
          };
        }

        return acc;
      }, {});
      const currentFile = this.getCurrentModuleFromPath(sandbox);
      const activeFilePath = Object.values(sandpackFiles).find(
        file => file.id === currentFile.id
      );

      return (
        <SandpackProvider
          files={sandpackFiles}
          customSetup={{
            environment: sandbox.template,
            entry: sandbox.entry,
            dependencies: sandpackFiles['/package.json']
              ? undefined
              : sandbox.npmDependencies,
          }}
          options={{
            activeFile: activeFilePath.path,
            visibleFiles: [activeFilePath.path],
          }}
        >
          <SandpackLayout
            style={{ '--sp-layout-height': `${window.innerHeight - 2}px` }}
          >
            <SandpackFileExplorer />
            <SandpackCodeEditor showLineNumbers showTabs closableTabs />
            <SandpackPreview showNavigator />
          </SandpackLayout>
        </SandpackProvider>
      );
    }

    return (
      <ThemeProvider
        theme={{
          templateColor: getTemplateDefinition(sandbox.template).color,
        }}
      >
        <Container>
          <Content
            showEditor={showEditor}
            showPreview={showPreview}
            setEditorView={this.setEditorView}
            setPreviewView={this.setPreviewView}
            setMixedView={this.setMixedView}
            previewWindow={previewWindow}
            isInProjectView={isInProjectView}
            setProjectView={this.setProjectView}
            sandbox={sandbox}
            currentModule={this.getCurrentModuleFromPath(sandbox)}
            hideNavigation={this.state.hideNavigation}
            autoResize={this.state.autoResize}
            fontSize={this.state.fontSize}
            initialPath={this.state.initialPath}
            setCurrentModule={this.setCurrentModule}
            useCodeMirror={this.state.useCodeMirror}
            enableEslint={this.state.enableEslint}
            editorSize={this.state.editorSize}
            highlightedLines={this.state.highlightedLines}
            forceRefresh={this.state.forceRefresh}
            expandDevTools={this.state.expandDevTools}
            hideDevTools={this.state.hideDevTools}
            tabs={this.state.tabs}
            runOnClick={runOnClick}
            verticalMode={verticalMode}
            sidebarOpen={this.state.sidebarOpen}
            toggleSidebar={this.toggleSidebar}
            toggleLike={this.jwt() && this.toggleLike}
          />
        </Container>
      </ThemeProvider>
    );
  };

  render() {
    const { sandbox } = this.state;
    const theme = getTheme(this.state.theme);

    if (/sandpack=experimental/.test(window.location.search)) {
      return this.content();
    }

    if (this.state.notFound) {
      return (
        <ThemeProvider theme={theme}>
          <Fullscreen>{this.content()}</Fullscreen>
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Fullscreen sidebarOpen={this.state.sidebarOpen}>
          {sandbox && (
            <Sidebar
              setCurrentModule={this.setCurrentModule}
              currentModule={this.getCurrentModuleFromPath(sandbox).id}
              sandbox={sandbox}
            />
          )}
          <Moving sidebarOpen={this.state.sidebarOpen}>{this.content()}</Moving>
        </Fullscreen>
      </ThemeProvider>
    );
  }
}
