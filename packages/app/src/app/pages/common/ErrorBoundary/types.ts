import React from 'react';
import { Location } from 'history';
import { RouteComponentProps } from 'react-router';

export type ErrorInfo = {
  componentStack: string;
};

export interface IFallbackComponentProps {
  error?: Error;
  trace?: string;
}

export interface IErrorBoundaryProps extends RouteComponentProps {
  children?: React.ReactNode;
  FallbackComponent?: React.ComponentType<IFallbackComponentProps>;
  onError?: (error: Error, trace: string) => void;
}

export interface IErrorBoundaryState {
  error?: Error;
  info?: ErrorInfo;
  previousLocation?: Location;
}
