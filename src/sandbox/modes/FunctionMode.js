import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';

const Container = styled.div`
  font-family: sans-serif;
`;

export default class FunctionMode {
  constructor(element) {
    this.element = element;
  }

  static type = 'function';

  render(module) {
    const exported = Object.keys(module).map((f) => {
      if (typeof module[f] === 'function') {
        const args = module[f].toString()
          .match(/function\s.*?\(([^)]*)\)/)[1]
          .split(',').map(arg =>
            // Ensure no inline comments are parsed and trim the whitespace.
            arg.replace(/\/\*.*\*\//, '').trim())
          .filter(arg => arg);

        return {
          name: f,
          component: (
            <div>
              <div>{typeof module[f]}: {f}({args.join(', ')})</div>
              {args.map(arg => (
                <input placeholder={arg} />
              ))}
              =
            </div>
          ),
        };
      }
      return { name: f, component: `${typeof module[f]}: ${f}` };
    });

    render(
      <Container>
        <h1>Functions</h1>
        <ul>
          {exported.map(f => <li key={f.name}>{f.component}</li>)}
        </ul>
      </Container>
    , this.element);
  }
}
