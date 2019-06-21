import * as T from './types'

export function keyBy<T>(items: T[], keyFn: (item: T) => string): { [key: string]: T } {
   return items.reduce((acc: { [key: string]: T }, e) => {
      acc[keyFn(e)] = e
      return acc
   }, {})
}

export function loadParser<T>(path: string): T.Parser<T> {
   const parse = require(`../parsers/${path}`).parse
   return (input: string, args: any) => {
      return {
         ...parse(input, args),
         text: input,
      }
   }
}
