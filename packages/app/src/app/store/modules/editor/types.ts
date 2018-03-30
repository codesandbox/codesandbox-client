import { Dictionary } from '@cerebral/fluent';

export type Badge = {
    id: string;
    name: string;
    visible: boolean;
};

export type Author = {
    avatarUrl: string;
    badges: Badge[];
    forkedCount: number;
    givenLikeCount: number;
    id: string;
    name: string;
    receivedLikeCount: number;
    sandboxCount: number;
    showcasedSandboxShortid: string;
    subscriptionSince: string;
    username: string;
    viewCount: number;
};

export type Directory = {
    directoryShortid: string;
    id: string;
    shortid: string;
    sourceId: string;
    title: string;
};

export type Module = {
    code: string;
    directoryShortid: string;
    id: string;
    isBinary: boolean;
    shortid: string;
    sourceId: string;
    title: string;
};

export type Git = {
    branch: string;
    commitSha: string;
    path: string;
    repo: string;
    username: string;
};

export type ForkedSandbox = {
    viewCount: number;
    updatedAt: string;
    title: string;
    template: string;
    privacy: number;
    likeCount: number;
    insertedAt: string;
    id: string;
    git: Git;
    forkCount: number;
};

export type NPMDependencies = Dictionary<string>;

export type Sandbox = {
    author: Author;
    description: string;
    directories: Directory[];
    entry: string;
    externalResources: string[];
    forkCount: number;
    forkedFromSandbox: ForkedSandbox;
    git: Git;
    id: string;
    likeCount: number;
    modules: Module[];
    npmDependencies: NPMDependencies;
    originalGit: Git;
    originalGitCommitSha: string;
    owned: boolean;
    privacy: number;
    sourceId: string;
    tags: string[];
    template: string;
    title: string;
    userLiked: boolean;
    version: number;
    viewCount: number;
};

export type Tab = {
    type: string;
    moduleShortid: string;
    dirty: boolean;
};

export type SandboxError = {
    column: number;
    line: number;
    message: string;
    title: string;
    moduleId: string;
};

export type Glyph = {
    line: number;
    className: string;
    moduleId: string;
};

export type Correction = {
    column: number;
    line: number;
    message: string;
    source: string;
    moduleId: string;
    severity: string;
};

export type PreviewWindow = {
    content: string;
    width: number;
    height: number;
    x: number;
    y: number;
};

export type State = {
    currentId: string;
    currentModuleShortid: string;
    isForkingSandbox: boolean;
    mainModuleShortid: string;
    sandboxes: Dictionary<Sandbox>;
    isLoading: boolean;
    notFound: boolean;
    error: string;
    isResizing: boolean;
    changedModuleShortids: string[];
    tabs: Tab[];
    errors: SandboxError[];
    glyphs: Glyph[];
    corrections: Correction[];
    isInProjectView: boolean;
    forceRender: number;
    initialPath: string;
    highlightedLines: number[];
    isUpdatingPrivacy: boolean;
    quickActionsOpen: boolean;
    previewWindow: PreviewWindow;
    isAllModulesSynced: boolean;
    currentSandbox: Sandbox;
    currentModule: Module;
    mainModule: Module;
    currentPackageJSON: any;
    currentPackageJSONCode: string;
    parsedConfigurations: any;
};
