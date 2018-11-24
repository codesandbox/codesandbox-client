/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import { render } from 'react-dom';
import { join } from 'path';

export default function(
  module: string,
  container,
  currentPath: string,
  findBoilerplate,
  evalBoilerplate,
  manager
) {
  if (!module.__csbMdx) {
    return;
  }

  const node = document.createElement('div');
  container.appendChild(node);

  const components = {
    a: props => {
      if (props.href && props.href.startsWith('.')) {
        return (
          <a
            {...props}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              const api = require('codesandbox-api');

              api.dispatch(
                api.actions.editor.openModule(join(currentPath, props.href))
              );
            }}
          />
        );
      }

      return <a target="_blank" rel="noopener noreferrer" {...props} />;
    },

    code: class Evaluate extends React.Component {
      handleCodeChange = async e => {
        if (this.transpiling) {
          return;
        }

        const code = e.target.textContent;

        const module = manager.transpiledModules[this.props.metastring].module;

        manager.updateModule({ ...module, code });

        this.compileCode();
      };

      compileCode = async element => {
        this.element = this.element || element;
        const tModule =
          manager.transpiledModules[this.props.metastring].tModules[''];
        const module = manager.transpiledModules[this.props.metastring].module;

        try {
          this.transpiling = true;
          await tModule.transpile(manager);

          const compiledSource = tModule.source.compiledCode;

          const compiled = tModule.evaluate(manager, {
            inScope: !/^exports\..*? =/m.test(compiledSource),
          });

          let boilerplate = findBoilerplate(module);
          if (!boilerplate.module) {
            if (boilerplate.prepare) {
              await boilerplate.prepare(manager);
            }
            boilerplate = await evalBoilerplate(boilerplate);
          }

          this.element.innerHTML = '';

          boilerplate.module.default(
            compiled,
            this.element,
            currentPath,
            findBoilerplate,
            evalBoilerplate,
            manager
          );
        } catch (e) {
          console.error(e);
        } finally {
          this.transpiling = false;
        }
      };

      render() {
        const { props } = this;

        return (
          <div>
            <code
              style={{
                padding: '0.8em',
                borderRadius: 4,
                display: 'block',
                fontSize: 16,
                fontFamily: 'Menlo',
              }}
              contentEditable="true"
              onInput={this.handleCodeChange}
            >
              {props.children}
            </code>
            <div
              style={{
                padding: '0.8em',
                backgroundColor: 'white',
                color: 'rgba(0, 0, 0, 0.9)',
              }}
              ref={this.compileCode}
            />
          </div>
        );
      }
    },
  };

  render(React.createElement(module.__csbMdx, { components }), node);
}
