/// <reference types="react" />
declare type Props = {
    tags: Array<string>;
    align?: 'right' | 'left';
};
declare function Tags({ tags, align, ...props }: Props): JSX.Element;
export default Tags;
