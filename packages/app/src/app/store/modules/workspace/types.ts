import { ComputedValue } from '@cerebral/fluent'

type Item = {
  id: string
  name: string
  show?: boolean
}

export type State = {
  openedWorkspaceItem: string
  items: ComputedValue<Item>
}
