import React, { Component } from 'react';
import { CodeSadbox } from './CodeSadbox';
import { IErrorBoundaryProps, ErrorInfo, IErrorBoundaryState } from './types';

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  static defaultProps = {
    FallbackComponent: CodeSadbox,
  };

  state = {
    error: null,
    info: null,
  };

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info ? info.componentStack : '');
      } catch {}
    }

    this.setState({ error, info });
  }

  render() {
    const { children, FallbackComponent } = this.props;
    const { error, info } = this.state;

    if (error !== null) {
      return (
        <FallbackComponent
          error={error}
          trace={info ? info.componentStack : ''}
        />
      );
    }

    return children || null;
  }
}
