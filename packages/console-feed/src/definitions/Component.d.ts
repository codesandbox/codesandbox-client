import { Payload } from './Payload'
import { Styles } from './Styles'
import { Methods } from './Methods'
import type { Options } from 'linkifyjs'

export type Variants = 'light' | 'dark'

export interface Theme {
  variant: Variants
  styles: Styles
}

export interface Context extends Theme {
  method: Methods
}

export interface Message extends Payload {
  data: any[]
  amount?: number
}

export interface Props {
  logs: Message[]
  variant?: Variants
  styles?: Styles
  filter?: Methods[]
  searchKeywords?: string
  logFilter?: Function
  logGrouping?: Boolean
  linkifyOptions?: Options
}

export interface MessageProps {
  log: Message
  linkifyOptions?: Options
}
