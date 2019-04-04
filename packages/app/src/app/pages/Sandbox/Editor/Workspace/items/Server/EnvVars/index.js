import React from 'react';
import { inject, observer } from 'mobx-react';

import { WorkspaceInputContainer } from '../../../elements';

import EnvEntry from './EnvEntry';
import EnvModal from './EnvModal';

class EnvironmentVariables extends React.Component {
  componentDidMount() {
    this.props.signals.editor.fetchEnvironmentVariables();
  }

  createEnv = ({ name, value }) => {
    this.props.signals.editor.updateEnvironmentVariables({ name, value });
  };

  deleteEnv = name => {
    this.props.signals.editor.deleteEnvironmentVariable({ name });
  };

  render() {
    const envVars = this.props.store.editor.currentSandbox.environmentVariables;

    if (!envVars) {
      return (
        <WorkspaceInputContainer>
          <div style={{ fontStyle: 'italic' }}>Loading...</div>
        </WorkspaceInputContainer>
      );
    }

    return (
      <div>
        {Object.keys(envVars.toJSON()).map(keyName => (
          <EnvEntry
            onSubmit={this.createEnv}
            onDelete={this.deleteEnv}
            key={keyName}
            name={keyName}
            value={envVars.get(keyName)}
          />
        ))}

        <WorkspaceInputContainer style={{ flexDirection: 'column' }}>
          <EnvModal onSubmit={this.createEnv} />
        </WorkspaceInputContainer>
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(EnvironmentVariables));
