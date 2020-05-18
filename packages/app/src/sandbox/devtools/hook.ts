import { actions, dispatch } from 'codesandbox-api';
import * as docgen from 'react-docgen';
import { getElementDimensions } from './utils';
import { getCurrentManager } from 'sandbox/compile';

function buildStyles(
  layout: { x: number; y: number; width: number; height: number },
  color
) {
  return `
  position:fixed;
  pointer-events: none;
  top:${layout.y}px;
  left:${layout.x}px;
  width:${layout.width}px;
  height:${layout.height}px;
  background-color:${color};
  opacity:0.4;
`;
}

export function injectHook() {
  let inspectActivated = false;

  let layoutEl;
  let layoutInnerEl;
  let inspectorTool;

  const clickListener = e => {
    if (!inspectActivated) {
      return;
    }

    const targetEl = e.target;

    if (!targetEl) {
      return;
    }

    const componentInfo = __REACT_DEVTOOLS_GLOBAL_HOOK__.renderers
      .get(1)
      .findFiberByHostInstance(targetEl);

    if (!componentInfo) {
      return;
    }
    const parent = componentInfo._debugOwner;
    const parentProps = parent.memoizedProps;
    console.log('component', componentInfo);
    console.log('parent', parent);

    console.log(docgen);

    inspectorTool = inspectorTool || document.createElement('div');
    inspectorTool.style = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 450px;
      background-color: #ddd;
      padding: 0.5rem;
    `;
    document.body.appendChild(inspectorTool);

    let propsInfo;
    try {
      const module = getCurrentManager().transpiledModules[
        componentInfo._debugSource.fileName
      ].module;
      const info = docgen.parse(module.code);

      propsInfo = info.props;
    } catch (er) {
      console.warn(er);
    }

    inspectorTool.innerHTML = `
<div style="margin-bottom:4px;">ComponentName: <code>${
      parent.type.name
    }</code></div>
<div style="margin-bottom:4px;">Props: <code>${JSON.stringify(
      parentProps
    )}</code></div>
<div style="margin-bottom:4px;">Location: <code>${JSON.stringify(
      parent._debugSource
    )}</code></div>

    <div style="margin-bottom:4px;">Props Info: <pre>${JSON.stringify(
      propsInfo,
      null,
      2
    )}</pre></div>
    `;

    dispatch(
      actions.editor.openModule(
        parent._debugSource.fileName,
        parent._debugSource.lineNumber
      )
    );
  };

  const createLayoutEl = (element: HTMLElement) => {
    if (!layoutEl) {
      layoutEl = document.createElement('div');
      document.body.append(layoutEl);
    }

    if (!layoutInnerEl) {
      layoutInnerEl = document.createElement('div');
      document.body.append(layoutInnerEl);
    }

    const layout = element.getBoundingClientRect();
    const layoutInner = getElementDimensions(element);
    const layoutInnerConverted = {
      x: layout.x - layoutInner.marginLeft,
      y: layout.y - layoutInner.marginTop,
      width: layout.width + layoutInner.marginLeft + layoutInner.marginRight,
      height: layout.height + layoutInner.marginTop + layoutInner.marginBottom,
    };

    layoutEl.style = buildStyles(layout, 'blue');
    layoutInnerEl.style = buildStyles(layoutInnerConverted, 'orange');
  };
  const removeLayoutEl = () => {
    document.body.removeChild(layoutEl);
    layoutEl = null;
    document.body.removeChild(layoutInnerEl);
    layoutInnerEl = null;
  };

  const downListener = (e: KeyboardEvent) => {
    if (e.key === 'Meta') {
      inspectActivated = true;
      document.addEventListener('mouseover', overListener);
      createLayoutEl(e.target);
    }
  };
  const upListener = (e: KeyboardEvent) => {
    if (e.key === 'Meta') {
      inspectActivated = false;
      document.removeEventListener('mouseover', overListener);
      removeLayoutEl();
    }
  };

  const overListener = e => {
    const element: HTMLElement = e.target;

    createLayoutEl(e.target);
  };

  document.addEventListener('click', clickListener);
  document.addEventListener('keydown', downListener);
  document.addEventListener('keyup', upListener);
}
