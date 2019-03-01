/// <reference types="react" />
export declare type Props = {
    tag: string;
    removeTag?: ({ tag }: {
        tag: string;
    }) => void;
};
export default function Tag({ tag, removeTag }: Props): JSX.Element;
