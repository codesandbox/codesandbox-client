import { Module } from '@codesandbox/common/lib/types';
import {
  resourceIsCss,
  createExternalCSSLink,
  createExternalJSLink,
} from 'sandbox/external-resources';

const PATHS_TO_INJECT = ['/public/index.html'];

function addElementToHTMLHead(code: string, resource: string) {
  const element: HTMLLinkElement | HTMLScriptElement = resourceIsCss(resource)
    ? createExternalCSSLink(resource)
    : createExternalJSLink(resource);

  const newCode = code.replace(/<\/head>/g, `${element.outerHTML}\n</head>`);

  return newCode;
}

// Returns the modules with the externalResources injected.
// Useful for static exports.
export function injectExternalResources(
  modules: Module[],
  externalResources: string[]
): Module[] {
  const modifiedModules = modules.map(mod => {
    const modifiedModule = { ...mod };

    if (mod.type === 'file' && PATHS_TO_INJECT.includes(mod.path)) {
      externalResources.forEach(resource => {
        modifiedModule.code = addElementToHTMLHead(
          modifiedModule.code,
          resource
        );
      });
    }

    return modifiedModule;
  });

  return modifiedModules;
}
