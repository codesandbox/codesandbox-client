import * as htmlparser2 from 'htmlparser2';

const EXCLUDED_TAGS = ['noscript'];

function parseDOM(content: string) {
  return new Promise((resolve, reject) => {
    const domHandler = new htmlparser2.DomHandler((err, dom) => {
      if (err) {
        reject(err);
      } else {
        resolve(dom);
      }
    });
    const parser = new htmlparser2.Parser(domHandler);
    parser.write(content);
    parser.end();
  });
}

function addTagNode(node: any, firstElement: ChildNode, parent: HTMLElement) {
  // Skip noscript nodes as this is a script...
  if (EXCLUDED_TAGS.includes(node.name)) {
    return;
  }

  const nodeToInsert = document.createElement(node.name);
  Object.entries(node.attribs).forEach(([key, value]) => {
    nodeToInsert.setAttribute(key, value);
  });
  if (node.name === 'script' && !node.attribs.async) {
    nodeToInsert.setAttribute('async', 'false');
  }
  if (node.children) {
    writeDOMNodes(node.children, nodeToInsert);
  }
  parent.insertBefore(nodeToInsert, firstElement);
}

function writeDOMNodes(nodes: Array<any>, parent: HTMLElement) {
  const firstElement = parent.firstChild;

  nodes.forEach(node => {
    if (node.type === 'text') {
      parent.insertBefore(document.createTextNode(node.data), firstElement);
    } else if (node.type === 'comment') {
      parent.insertBefore(document.createComment(node.data), firstElement);
    } else if (typeof node.attribs !== 'undefined') {
      // We can't use node.type === 'tag' as that's different for script and style
      addTagNode(node, firstElement, parent);
    }
  });
}

export async function appendHTML(origin: string, parent: HTMLElement) {
  const domTree: any = await parseDOM(origin);
  writeDOMNodes(domTree, parent);
}
