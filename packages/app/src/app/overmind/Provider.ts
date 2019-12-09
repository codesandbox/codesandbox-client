import { Overmind, IConfiguration } from 'overmind';
import { createContext } from 'react';

export const context = createContext<Overmind<IConfiguration>>(
  {} as Overmind<IConfiguration>
);

export const { Provider } = context;
