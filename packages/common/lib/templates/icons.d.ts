/// <reference types="react" />
import { TemplateType } from './';
export default function getIcon(theme: TemplateType): (({ width, height, className, }: {
    width: number;
    height: number;
    className?: string;
}) => JSX.Element) | (({ width, height, className }: {
    width?: number;
    height?: number;
    className: any;
}) => JSX.Element);
