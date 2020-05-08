import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import { ColorIcons } from '@codesandbox/template-icons';

import './style.css';

function App() {
  return (
    <div className="App">
      <ul>
        {Object.keys(ColorIcons).map(key => (
          <li>
            <span>{key}</span>
            <div>{ColorIcons[key]({})}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
const mountNode = document.getElementById('app');
ReactDOM.render(<App />, mountNode);
