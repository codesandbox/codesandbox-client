import React, { useEffect } from 'react';
import { Collapsible, Stack, Text } from '@codesandbox/components';
import * as childProcess from 'node-services/lib/child_process';
import TSWorker from 'worker-loader!./ts-worker';

import {
  getInspectorStateService,
  EditorInspectorState,
} from 'inspector/lib/editor';
import {
  Fiber as FiberType,
  FiberSourceInformation,
  StaticComponentInformation,
  CodeRange,
} from 'inspector/lib/common/fibers';

import { useOvermind } from 'app/overmind';
import { Fiber } from './Fiber';
import { BaseKnob } from './Knobs';
import { VSCodeRange } from '@codesandbox/common/lib/types';

childProcess.addForkHandler('ts-worker.ts', TSWorker);
setTimeout(() => {
  childProcess.fork('ts-worker.ts');
}, 5000);

function componentRangeToViewRange(range: CodeRange): VSCodeRange {
  return {
    startLineNumber: range.startLineNumber,
    endLineNumber: range.endLineNumber,
    startColumn: range.startColumnNumber,
    endColumn: range.endColumnNumber,
  };
}

export const Inspector = () => {
  const { actions, effects } = useOvermind();
  const inspectorStateService = React.useRef<EditorInspectorState>();
  const [fibers, setFibers] = React.useState<FiberType[]>([]);
  const [selectedFiber, setSelectedFiber] = React.useState<FiberType | null>(
    null
  );
  const [
    componentInformation,
    setComponentInformation,
  ] = React.useState<StaticComponentInformation | null>(null);
  const [
    propsSourceInformation,
    setPropsSourceInformation,
  ] = React.useState<FiberSourceInformation | null>(null);

  useEffect(() => {
    const inspector = getInspectorStateService();
    inspectorStateService.current = inspector;
    inspector.getFibers().then(editorFibers => {
      setFibers(editorFibers);
    });
    inspector.onSelectionChanged(fiber => {
      setComponentInformation(null);
      setSelectedFiber(fiber);

      actions.editor.moduleSelected({ path: fiber.location.path }).then(() => {
        effects.vscode.setSelectionFromRange({
          startLineNumber: fiber.location.codePosition.startLineNumber,
          endLineNumber: fiber.location.codePosition.endLineNumber,
          startColumn: fiber.location.codePosition.startColumnNumber,
          endColumn: fiber.location.codePosition.endColumnNumber,
        });

        const model = effects.vscode.getModelByPath(fiber.location.path);
        model.onDidChangeContent(e => {
          inspector
            .getFiberPropSources(fiber.id, model.getValue())
            .then(setPropsSourceInformation);
        });

        inspector
          .getFiberComponentInformation(fiber.id)
          .then(setComponentInformation);
        inspector
          .getFiberPropSources(fiber.id, model.getValue())
          .then(sourceInfo => {
            setPropsSourceInformation(sourceInfo);

            Object.keys(sourceInfo.props).forEach(async prop => {
              const source = sourceInfo.props[prop];
              const subscription = await effects.vscode.subscribeToSpan(
                fiber.location.path,
                componentRangeToViewRange(source.valuePosition)
              );

              console.log(prop, subscription);

              subscription.onContentChange(newContent => {
                console.log(prop, 'CONTENT CHANGED', newContent);
              });
              subscription.onRangeChange(newRange => {
                console.log(prop, 'RANGE CHANGED', newRange);
              });
            });
          });
      });
    });
  }, []);

  return (
    <>
      <Collapsible defaultOpen title="App Structure">
        <div style={{ marginTop: -16 }}>
          {fibers.map(fiber => (
            <Fiber
              key={fiber.id}
              id={fiber.id}
              name={fiber.name || 'Anonymous'}
              depth={fiber.depth}
              selected={selectedFiber?.id === fiber.id}
              onSelect={id => {
                inspectorStateService.current.selectFiber(id);
              }}
              onMouseEnter={id => {
                inspectorStateService.current.highlightFiber(id);

                effects.vscode.highlightRange(
                  fiber.location.path,
                  componentRangeToViewRange(fiber.location.codePosition),
                  '#6CC7F650',
                  'inspector'
                );
              }}
              onMouseLeave={id => {
                inspectorStateService.current.stopHighlightFiber(id);

                effects.vscode.clearHighlightedRange(
                  fiber.location.path,
                  'inspector'
                );
              }}
            />
          ))}
        </div>
      </Collapsible>
      <Collapsible defaultOpen title="Knobs">
        {selectedFiber && (
          <Stack
            gap={2}
            direction="vertical"
            padding={3}
            style={{ marginTop: -16 }}
          >
            <Text weight="bold" color="white">
              {selectedFiber.name || 'Anonymous'}
            </Text>

            {propsSourceInformation &&
              componentInformation &&
              componentInformation.props.map(val => (
                <BaseKnob
                  onClick={() => {
                    const propInfo = propsSourceInformation.props[val.name];
                    if (propInfo) {
                      const range = componentRangeToViewRange(
                        propInfo.valuePosition
                      );
                      effects.vscode.highlightRange(
                        selectedFiber.location.path,
                        range,
                        '#6CC7F650',
                        'inspector-value'
                      );

                      console.log(
                        effects.vscode.subscribeToSpan(
                          selectedFiber.location.path,
                          range
                        )
                      );
                    }
                  }}
                  disabled={!propsSourceInformation.props[val.name]}
                  key={val.name}
                  label={val.name}
                />
              ))}
          </Stack>
        )}
      </Collapsible>
    </>
  );
};
