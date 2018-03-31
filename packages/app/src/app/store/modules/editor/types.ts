import { Dictionary } from '@cerebral/fluent';
import { UserSelection } from '../live/types';
import { Git } from 'app/store/types';

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
    npmDependencies: Dictionary<string>;
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

export type PendingOperation = string | number;

export type PendingUserSelection = {
    userId: string;
    name: string;
    selection: UserSelection;
    color: number[];
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
    pendingOperation: PendingOperation[];
    pendingUserSelections: PendingUserSelection[];
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
    previewWindow: {
        content: string;
        width: number;
        height: number;
        x: number;
        y: number;
    };
    isAllModulesSynced: boolean;
    currentSandbox: Sandbox;
    currentModule: Module;
    mainModule: Module;
    currentPackageJSON: any;
    currentPackageJSONCode: string;
    parsedConfigurations: any;
};
