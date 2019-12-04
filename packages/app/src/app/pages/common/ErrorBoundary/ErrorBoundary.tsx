import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CodeSadbox } from './CodeSadbox';
import { IErrorBoundaryProps, ErrorInfo, IErrorBoundaryState } from './types';

export class ErrorBoundary extends Component<
  RouteComponentProps & IErrorBoundaryProps,
  IErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  static getDerivedStateFromProps(
    props: IErrorBoundaryProps,
    state: IErrorBoundaryState
  ) {
    if (props.location !== state.previousLocation) {
      return {
        error: null,
        info: null,
        previousLocation: props.location,
      };
    }

    return null;
  }

  state = {
    error: null,
    info: null,
    previousLocation: null,
  };

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info ? info.componentStack : '');
      } catch {} // eslint-disable-line
    }

    this.setState({ info });
  }

  render() {
    const { children, FallbackComponent = CodeSadbox } = this.props;
    const { error, info } = this.state;

    return error !== null ? (
      <FallbackComponent
        error={error}
        trace={info ? info.componentStack : ''}
      />
    ) : (
      children || null
    );
  }
}
