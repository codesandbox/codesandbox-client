import * as ts from 'typescript/lib/tsserverlibrary';
import TemplateSourceHelper from './template-source-helper';
import ScriptSourceHelper from './script-source-helper';
import TemplateContext from './template-context';
import TemplateSettings from './template-settings';
import Logger from './logger';
export default class StandardTemplateSourceHelper implements TemplateSourceHelper {
    private readonly typescript;
    private readonly templateStringSettings;
    private readonly helper;
    constructor(typescript: typeof ts, templateStringSettings: TemplateSettings, helper: ScriptSourceHelper, _logger: Logger);
    getTemplate(fileName: string, position: number): TemplateContext | undefined;
    getAllTemplates(fileName: string): ReadonlyArray<TemplateContext>;
    getRelativePosition(context: TemplateContext, offset: number): ts.LineAndCharacter;
    private getValidTemplateNode;
}
