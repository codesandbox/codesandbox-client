import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import { DarkIcons, LightIcons, ColorIcons } from '@codesandbox/template-icons';

import './style.css';

function App() {
  return (
    <div className="App">
      <ul>
        {Object.keys(DarkIcons).map(key => (
          <li>
            <span>{key}</span>
            <div>{DarkIcons[key]({})}</div>
          </li>
        ))}
      </ul>
      <ul className="light">
        {Object.keys(LightIcons).map(key => (
          <li>
            <span>{key}</span>
            <div>{LightIcons[key]({})}</div>
          </li>
        ))}
      </ul>
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
