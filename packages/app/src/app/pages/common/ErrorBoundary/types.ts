import React from 'react';

export type ErrorInfo = {
  componentStack: string;
};

export interface IFallbackComponentProps {
  error?: Error;
  trace?: string;
}

export interface IErrorBoundaryProps {
  children?: React.ReactNode;
  FallbackComponent: React.ComponentType<IFallbackComponentProps>;
  onError?: (error: Error, trace: string) => void;
}

export interface IErrorBoundaryState {
  error?: Error;
  info?: ErrorInfo;
}
