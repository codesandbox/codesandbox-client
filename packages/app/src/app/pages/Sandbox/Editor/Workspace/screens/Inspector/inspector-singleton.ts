import {
  rpcProtocol,
  sandboxProxyIdentifier,
  editorProxyIdentifier,
} from 'inspector/lib/common/proxies';
import { EditorInspectorState } from 'inspector/lib/editor';
import vscodeEffect from 'app/overmind/effects/vscode';
import { VSCodeEditorBridge } from './editor-bridge';

let inspectorStateService: EditorInspectorState | undefined;

export function getInspectorStateService(params: {
  vscodeEffect: typeof vscodeEffect;
}) {
  if (!inspectorStateService) {
    const sandboxProxy = rpcProtocol.getProxy(sandboxProxyIdentifier);
    inspectorStateService = new EditorInspectorState(
      sandboxProxy,
      new VSCodeEditorBridge(params.vscodeEffect)
    );
    rpcProtocol.set(editorProxyIdentifier, inspectorStateService);
  }

  return inspectorStateService;
}
