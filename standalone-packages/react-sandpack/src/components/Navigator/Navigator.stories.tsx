import React from 'react';
import { SandpackLayout } from '../../components/SandpackLayout';
import { SandpackProvider } from '../../contexts/sandpack-context';
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
    <SandpackLayout>
      <Preview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithRoutingExample = () => (
  <SandpackProvider
    entry="/index.js"
    environment="create-react-app"
    files={{
      '/index.html': {
        code: `<div id="root"></div>`,
      },
      '/index.js': {
        code: `import ReactDOM from "react-dom";
import App from "./example";

ReactDOM.render(<App />, document.getElementById("root"));
        `,
      },
      '/example.js': {
        code: `import {
  BrowserRouter as Router,
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
      'react-scripts': 'latest',
      react: 'latest',
      'react-dom': 'latest',
    }}
  >
    <SandpackLayout>
      <Preview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
