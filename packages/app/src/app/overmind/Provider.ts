import { Overmind, IConfiguration, OvermindMock } from 'overmind';
import { createContext } from 'react';

export const context = createContext<Overmind<IConfiguration>>({} as Overmind<
  IConfiguration
>);

export const Provider: React.ProviderExoticComponent<
  React.ProviderProps<Overmind<IConfiguration> | OvermindMock<IConfiguration>>
> = context.Provider;
