import React from 'react';
import { Navigator } from '.';
import { SandpackWrapper } from '../../elements';
import { SandpackProvider } from '../../utils/sandpack-context';
import { Preview } from '../Preview';

export default {
  title: 'components/Navigator',
};

export const Component = () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <SandpackWrapper>
      <Navigator />
    </SandpackWrapper>
  </SandpackProvider>
);

export const WithRoutingExample = () => (
  <SandpackProvider
    entry="/index.js"
    template="create-react-app"
    files={{
      '/index.html': {
        code: `<div id="root"></div>`,
      },
      '/index.js': {
        code: `import React from "react";
import ReactDOM from "react-dom";
import App from "./example";

ReactDOM.render(<App />, document.getElementById("root"));
        `,
      },
      '/example.js': {
        code: `import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
        
`,
      },
    }}
    dependencies={{
      'react-router-dom': 'latest',
      'react-scripts': '2.0.0',
      react: 'latest',
      'react-dom': 'latest',
    }}
  >
    <SandpackWrapper>
      <Preview showNavigator />
    </SandpackWrapper>
  </SandpackProvider>
);
