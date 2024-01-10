import React from 'react';

export class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // do nothing
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
