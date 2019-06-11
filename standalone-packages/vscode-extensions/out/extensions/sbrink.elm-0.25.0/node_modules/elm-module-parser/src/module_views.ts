import * as T from './types'
import { keyBy } from './util'

export function exposedOnlyView(module: T.Module): T.ModuleView {
   const exposing_by_name = keyBy(module.exposing, e => e.name)

   const exposed_types = module.exposes_all
      ? module.types
      : module.types.filter(t => {
           if (exposing_by_name[t.name] == null) {
              return false
           }

           if (exposing_by_name[t.name].type === 'constructor') {
              return t.type === 'custom-type'
           } else if (exposing_by_name[t.name].type === 'type') {
              return t.type === 'type-alias'
           } else {
              return false
           }
        })

   const annotations_by_name = keyBy(module.function_annotations, f => f.name)
   const declarations_by_name = keyBy(module.function_declarations, f => f.name)
   const all_function_names = [...new Set(Object.keys(annotations_by_name).concat(Object.keys(declarations_by_name)))]

   const functions = all_function_names.map(n => {
      return {
         name: n,
         annotation: annotations_by_name[n] || null,
         declaration: declarations_by_name[n] || null,
         location: (annotations_by_name[n] || declarations_by_name[n]).location,
      }
   })

   return {
      type: module.type,
      name: module.name,
      custom_types: <T.CustomTypeDeclaration[]>exposed_types.filter(x => x.type === 'custom-type'),
      type_aliases: <T.TypeAliasDeclaration[]>exposed_types.filter(x => x.type === 'type-alias'),
      functions: functions,
   }
}
