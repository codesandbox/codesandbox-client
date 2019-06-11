import * as T from './types'
import { loadParser } from './util'

const elmModuleParser = loadParser<T.Module>('elm_module_parser')

const ElmDefaultImports: T.ModuleImport[] = elmModuleParser(`
module Default

import Basics exposing (..)
import List exposing (List, (::))
import Maybe exposing (Maybe(..))
import Result exposing (Result(..))
import String exposing (String)
import Char exposing (Char)
import Tuple
import Debug
import Platform exposing ( Program )
import Platform.Cmd as Cmd exposing ( Cmd )
import Platform.Sub as Sub exposing ( Sub )
`).imports.map(
   (a): T.ModuleImport => ({
      type: 'default-import',
      module: a.module,
      location: null,
      alias: null,
      exposes_all: a.exposes_all,
      exposing: a.exposing.map(e => ({
         type: e.type,
         name: e.name,
         location: null,
      })),
   })
)

export const parseElmModule = (input: string): T.Module => {
   const parsed_module = elmModuleParser(`${input}\n`)

   return {
      ...parsed_module,
      imports: parsed_module.imports.concat(ElmDefaultImports),
   }
}
