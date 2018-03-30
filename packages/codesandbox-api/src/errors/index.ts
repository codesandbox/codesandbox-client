export interface Module {
    id: string;
    title: string;
    code: string;
    shortid: string;
    directoryShortid: string | undefined;
    isNotSynced: boolean;
    sourceId: string;
}

export interface TranspiledModule {
    initiators: Set<TranspiledModule>;
    dependencies: Set<TranspiledModule>;
    transpilationDependencies: Set<TranspiledModule>;
    transpilationInitiators: Set<TranspiledModule>;
    childModules: Array<TranspiledModule>;

    source: {
        compiledCode: string;
    };
    module: Module;
}

const transformers: Check[] = [];

export type SuggestionAction = (module: TranspiledModule, modules: TranspiledModule[]) => boolean;

export interface Suggestion {
    title: string;
    action: SuggestionAction;
}

export type Check = (
    error: Error,
    module: TranspiledModule,
    modules: TranspiledModule[]
) => {
    name: string | undefined;
    message: string;
    suggestions: Suggestion[];
} | null;

export function transformError(error: Error, module: TranspiledModule, modules: TranspiledModule[]) {
    const transformedErrors = transformers.map((c) => c(error, module, modules)).filter((x) => x != null);

    return transformedErrors[0];
}

export function clearErrorTransformers() {
    transformers.length = 0;
}

export function registerErrorTransformer(check: Check) {
    transformers.push(check);
}
