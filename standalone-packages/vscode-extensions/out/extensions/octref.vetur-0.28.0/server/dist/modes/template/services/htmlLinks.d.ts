import { TextDocument, DocumentLink } from 'vscode-languageserver-types';
import { DocumentContext } from '../../../types';
export declare function findDocumentLinks(document: TextDocument, documentContext: DocumentContext): DocumentLink[];
