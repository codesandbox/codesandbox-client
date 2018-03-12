import { IContext, IBranchContext, SequenceFactory, SequenceWithPropsFactory, ConnectFactory } from '@cerebral/fluent'
import { State as StoreState } from './store/types'
import { State as PatronState } from './store/modules/patron/types'
import { State as ProfileState } from './store/modules/profile/types'

export type State = StoreState & {
  patron: PatronState
  profile: ProfileState
}

// Create an interface where you compose your providers together
interface Providers {
  state: State
}

// Create a type used with your sequences and actions
export type Context<Props = {}> = IContext<Props> & Providers;

// This type is used when you define actions that returns a path
export type BranchContext<Paths, Props = {}> = IBranchContext<Paths, Props> & Providers;

// This function is used to connect components to Cerebral
export const connect = ConnectFactory<State, any>();

// This function is used to define sequences
export const sequence = SequenceFactory<Context>();

// This function is used to define sequences that expect to receive some initial
// props
export const sequenceWithProps = SequenceWithPropsFactory<Context>();
