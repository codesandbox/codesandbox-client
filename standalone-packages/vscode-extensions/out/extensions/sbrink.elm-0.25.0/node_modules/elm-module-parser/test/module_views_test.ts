import * as T from '../src/types'
import { expect } from 'chai'
import { exposedOnlyView } from '../src/module_views'

describe('exposedOnlyView', () => {
   it('should provide only exposed members', () => {
      const this_module: T.Module = {
         name: 'B',
         types: [
            {
               name: 'MyName',
               constructors: [
                  {
                     name: 'Foo',
                     type: 'constructor',
                     location: null,
                  },
                  {
                     name: 'Bar',
                     type: 'constructor',
                     location: null,
                  },
               ],
               type: 'custom-type',
               location: null,
            },
            {
               name: 'MyTypeAlias',
               type: 'type-alias',
               location: null,
            },
         ],
         text: '',
         location: null,
         function_declarations: [
            {
               name: 'foo',
               parameters: [],
               type: 'function-declaration',
               location: {
                  start: { column: 0, line: 1, offset: 1 },
                  end: { column: 0, line: 1, offset: 2 },
               },
            },
            {
               name: 'noAnnotationFunction',
               parameters: [],
               type: 'function-declaration',
               location: {
                  start: { column: 0, line: 2, offset: 3 },
                  end: { column: 0, line: 2, offset: 4 },
               },
            },
         ],
         function_annotations: [
            {
               name: 'foo',
               type: 'function-annotation',
               type_annotation: '',
               location: {
                  start: { column: 0, line: 3, offset: 5 },
                  end: { column: 0, line: 3, offset: 6 },
               },
            },
         ],
         port_annotations: [],
         port_declarations: [],
         exposes_all: true,
         exposing: [],
         imports: [],
         type: 'module',
      }

      const view = exposedOnlyView(this_module)

      const expected: T.ModuleView = {
         name: this_module.name,
         type: this_module.type,
         custom_types: <T.CustomTypeDeclaration[]>this_module.types.filter(x => x.type === 'custom-type'),
         type_aliases: <T.TypeAliasDeclaration[]>this_module.types.filter(x => x.type === 'type-alias'),
         functions: [
            {
               name: this_module.function_declarations[0].name,
               declaration: this_module.function_declarations[0],
               annotation: this_module.function_annotations[0],
               location: this_module.function_annotations[0].location,
            },
            {
               name: this_module.function_declarations[1].name,
               declaration: this_module.function_declarations[1],
               annotation: null,
               location: this_module.function_declarations[1].location,
            },
         ],
      }

      expect(view).to.deep.equal(expected)
   })
})
