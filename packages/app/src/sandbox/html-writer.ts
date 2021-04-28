import { Parser } from 'htmlparser2';
import { DomHandler } from 'domhandler';

const EXCLUDED_TAGS = ['noscript'];
const TAGS_TO_RELOAD = ['script', 'style'];
const TAGNAME_RE = /^[A-Za-z_-][A-Za-z0-9_-]*$/;

export function isValidTagName(tagName: string): boolean {
  if (TAGNAME_RE.test(tagName)) {
    return !tagName.startsWith('-') && !tagName.endsWith('-');
  }

  return false;
}

function parseDOM(content: string) {
  return new Promise((resolve, reject) => {
    const domHandler = new DomHandler((err, dom) => {
      if (err) {
        reject(err);
      } else {
        resolve(dom);
      }
    });
    const parser = new Parser(domHandler);
    parser.write(content);
    parser.end();
  });
}

function addTagNode(
  node: any,
  firstElement: ChildNode,
  parent: HTMLElement
): boolean {
  // Skip invalid tag names
  if (!isValidTagName(node.name)) {
    parent.insertBefore(
      document.createComment(` Invalid tagname: "${node.name}" `),
      firstElement
    );
    return false;
  }

  // Skip excluded tags
  if (EXCLUDED_TAGS.includes(node.name)) {
    return false;
  }

  let shouldRefresh = false;
  try {
    const nodeToInsert = document.createElement(node.name);
    Object.entries(node.attribs).forEach(([key, value]) => {
      nodeToInsert.setAttribute(key, value);
    });
    if (node.name === 'script' && !node.attribs.async) {
      nodeToInsert.setAttribute('async', 'false');
    }
    if (node.children) {
      shouldRefresh = writeDOMNodes(node.children, nodeToInsert);
    }
    if (!shouldRefresh) {
      shouldRefresh =
        TAGS_TO_RELOAD.includes(node.name) ||
        (node.name === 'link' && node.attribs?.rel === 'stylesheet');
    }
    parent.insertBefore(nodeToInsert, firstElement);
  } catch (err) {
    // Failsafe in case we didn't handle some weird edge case
    console.warn(err);
  }

  return shouldRefresh;
}

function writeDOMNodes(nodes: Array<any>, parent: HTMLElement): boolean {
  const firstElement = parent.firstChild;
  let shouldRefresh = false;
  nodes.forEach(node => {
    if (node.type === 'text') {
      parent.insertBefore(document.createTextNode(node.data), firstElement);
    } else if (node.type === 'comment') {
      parent.insertBefore(document.createComment(node.data), firstElement);
    } else if (typeof node.attribs !== 'undefined') {
      // We can't use node.type === 'tag' as that's different for script and style
      shouldRefresh = shouldRefresh || addTagNode(node, firstElement, parent);
    }
  });
  return shouldRefresh;
}

// Appends HTML, returns true if it encountered anything that should cause a refresh when appending to existing page
export async function appendHTML(
  origin: string,
  parent: HTMLElement
): Promise<boolean> {
  const domTree: any = await parseDOM(origin);
  return writeDOMNodes(domTree, parent);
}
