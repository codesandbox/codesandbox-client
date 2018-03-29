import { ComputedValue } from '@cerebral/fluent';

type Item = {
    id: string;
    name: string;
    show?: boolean;
};

export type State = {
    project: {
        title: string;
        description: string;
    };
    tags: {
        tag: string;
        tagName: string;
    };
    openedWorkspaceItem: string;
    items: ComputedValue<Item[]>;
};
