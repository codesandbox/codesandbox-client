import React from 'react';
import { render } from 'react-dom';

export default class ReactMode {
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

        return `${typeof module[f]}: ${f}(${args.join(', ')})`;
      }
      return `${typeof module[f]}: ${f}`;
    });

    render(
      <div>
        <h1>Function mode, not done yet</h1>
        <ul>
          {exported.map(f => <li key={f}>{f}</li>)}
        </ul>
      </div>
    , this.element);
  }
}
