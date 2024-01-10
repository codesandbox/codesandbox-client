import { ElementContainer } from './element-container';
import { TextContainer } from './text-container';
import { ImageElementContainer } from './replaced-elements/image-element-container';
import { CanvasElementContainer } from './replaced-elements/canvas-element-container';
import { SVGElementContainer } from './replaced-elements/svg-element-container';
import { LIElementContainer } from './elements/li-element-container';
import { OLElementContainer } from './elements/ol-element-container';
import { InputElementContainer } from './replaced-elements/input-element-container';
import { SelectElementContainer } from './elements/select-element-container';
import { TextareaElementContainer } from './elements/textarea-element-container';
import { IFrameElementContainer } from './replaced-elements/iframe-element-container';
const LIST_OWNERS = ['OL', 'UL', 'MENU'];
const parseNodeTree = (node, parent, root) => {
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;
        if (isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new TextContainer(childNode, parent.styles));
        }
        else if (isElementNode(childNode)) {
            const container = createContainer(childNode);
            if (container.styles.isVisible()) {
                if (createsRealStackingContext(childNode, container, root)) {
                    container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
                }
                else if (createsStackingContext(container.styles)) {
                    container.flags |= 2 /* CREATES_STACKING_CONTEXT */;
                }
                if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                    container.flags |= 8 /* IS_LIST_OWNER */;
                }
                parent.elements.push(container);
                if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
                    parseNodeTree(childNode, container, root);
                }
            }
        }
    }
};
const createContainer = (element) => {
    if (isImageElement(element)) {
        return new ImageElementContainer(element);
    }
    if (isCanvasElement(element)) {
        return new CanvasElementContainer(element);
    }
    if (isSVGElement(element)) {
        return new SVGElementContainer(element);
    }
    if (isLIElement(element)) {
        return new LIElementContainer(element);
    }
    if (isOLElement(element)) {
        return new OLElementContainer(element);
    }
    if (isInputElement(element)) {
        return new InputElementContainer(element);
    }
    if (isSelectElement(element)) {
        return new SelectElementContainer(element);
    }
    if (isTextareaElement(element)) {
        return new TextareaElementContainer(element);
    }
    if (isIFrameElement(element)) {
        return new IFrameElementContainer(element);
    }
    return new ElementContainer(element);
};
export const parseTree = (element) => {
    const container = createContainer(element);
    container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
    parseNodeTree(element, container, container);
    return container;
};
const createsRealStackingContext = (node, container, root) => {
    return (container.styles.isPositionedWithZIndex() ||
        container.styles.opacity < 1 ||
        container.styles.isTransformed() ||
        (isBodyElement(node) && root.styles.isTransparent()));
};
const createsStackingContext = (styles) => styles.isPositioned() || styles.isFloating();
export const isTextNode = (node) => node.nodeType === Node.TEXT_NODE;
export const isElementNode = (node) => node.nodeType === Node.ELEMENT_NODE;
export const isHTMLElementNode = (node) => isElementNode(node) && typeof node.style !== 'undefined' && !isSVGElementNode(node);
export const isSVGElementNode = (element) => typeof element.className === 'object';
export const isLIElement = (node) => node.tagName === 'LI';
export const isOLElement = (node) => node.tagName === 'OL';
export const isInputElement = (node) => node.tagName === 'INPUT';
export const isHTMLElement = (node) => node.tagName === 'HTML';
export const isSVGElement = (node) => node.tagName === 'svg';
export const isBodyElement = (node) => node.tagName === 'BODY';
export const isCanvasElement = (node) => node.tagName === 'CANVAS';
export const isImageElement = (node) => node.tagName === 'IMG';
export const isIFrameElement = (node) => node.tagName === 'IFRAME';
export const isStyleElement = (node) => node.tagName === 'STYLE';
export const isScriptElement = (node) => node.tagName === 'SCRIPT';
export const isTextareaElement = (node) => node.tagName === 'TEXTAREA';
export const isSelectElement = (node) => node.tagName === 'SELECT';
