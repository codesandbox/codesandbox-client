import React from 'react';
import { Location } from 'history';

export type ErrorInfo = {
  componentStack: string;
};

export interface IFallbackComponentProps {
  error?: Error;
  trace?: string;
  theme?: any;
}

export interface IErrorBoundaryProps {
  children?: React.ReactNode;
  FallbackComponent?: React.ComponentType<IFallbackComponentProps>;
  onError?: (error: Error, trace: string) => void;
  location?: Location;
}

export interface IErrorBoundaryState {
  error?: Error;
  info?: ErrorInfo;
  previousLocation?: Location;
}
