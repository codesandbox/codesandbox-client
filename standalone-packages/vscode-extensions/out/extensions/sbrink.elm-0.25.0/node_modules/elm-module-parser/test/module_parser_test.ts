import * as T from '../src/types'
import * as S from './samples/modules'
import * as Elm18 from './samples/elm_18'
import { expect } from 'chai'
import { parseElmModule } from '../src/index'

describe('Module Parser', () => {
   const runParser = (input: string): T.Module => {
      try {
         return parseElmModule(input)
      } catch (error) {
         return error
      }
   }

   it('should parse a file with only module declaration', () => {
      const result = runParser(`${S.MODULE_DECLARATION}`)
      expect(result.type).to.equal('module')
   })

   it('should parse port modules declarations', () => {
      const result = runParser(`port ${S.MODULE_DECLARATION}`)
      expect(result.type).to.equal('port-module')
   })

   it('should parse a module along with its imports', () => {
      const result = runParser(`${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}`)

      expect(
         result.imports.map(x => ({
            module: x.module,
            alias: x.type === 'import' ? x.alias : null,
            exposes_all: x.exposes_all,
            exposing: x.exposing.map(e => e.name),
         }))
      ).to.deep.equal([
         { module: 'Basics', alias: null, exposes_all: true, exposing: [] },
         { module: 'List', alias: null, exposes_all: false, exposing: ['::'] },
         { module: 'Maybe', alias: null, exposes_all: false, exposing: ['Maybe'] },
         { module: 'Result', alias: null, exposes_all: false, exposing: ['Result'] },
         { module: 'String', alias: null, exposes_all: false, exposing: [] },
         { module: 'Tuple', alias: null, exposes_all: false, exposing: [] },
         { module: 'Browser', alias: null, exposes_all: false, exposing: [] },
         { module: 'Html', alias: null, exposes_all: false, exposing: ['Html', 'button', 'div', 'text'] },
         { module: 'Html.Events', alias: null, exposes_all: false, exposing: ['onClick', 'A', 'c', 'E'] },
         { module: 'Foo.Bar', alias: 'Baz', exposes_all: false, exposing: ['B', 'C', 'D', 'E'] },
         { module: 'Plink', alias: null, exposes_all: true, exposing: [] },
         { module: 'Kluck', alias: null, exposes_all: false, exposing: ['Chicken'] },
         {
            alias: null,
            exposes_all: true,
            exposing: [],
            module: 'Basics',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['List', '::'],
            module: 'List',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Maybe'],
            module: 'Maybe',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Result'],
            module: 'Result',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['String'],
            module: 'String',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Char'],
            module: 'Char',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: [],
            module: 'Tuple',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: [],
            module: 'Debug',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Program'],
            module: 'Platform',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Cmd'],
            module: 'Platform.Cmd',
         },
         {
            alias: null,
            exposes_all: false,
            exposing: ['Sub'],
            module: 'Platform.Sub',
         },
      ])
   })

   describe('full module', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.REST_OF_MODULE}`
      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('function annotations', () => {
         expect(result.function_annotations.map(d => d.name)).to.deep.equal(['shuffleList', 'main'])
      })

      it('custom types', () => {
         expect(result.types.filter(x => x.type === 'custom-type').map(d => d.name)).to.deep.equal(['Msg', 'Foo'])
      })

      it('custom type variants', () => {
         const msgType = result.types.find(x => x.type === 'custom-type' && x.name === 'Msg') as T.CustomTypeDeclaration

         expect(msgType.constructors.map(x => ({ name: x.name, type: x.type }))).to.deep.equal([
            { name: 'Shuffle', type: 'constructor' },
            { name: 'Update', type: 'constructor' },
         ])
      })

      it('function declarations', () => {
         expect(result.function_declarations.map(d => ({ name: d.name, parameters: d.parameters }))).to.deep.equal([
            { name: 'shuffleList', parameters: ['list'] },
            { name: 'main', parameters: [] },
            { name: 'init', parameters: ['_'] },
            { name: 'update', parameters: ['msg', 'model'] },
            { name: 'view', parameters: ['model', 'foo', 'bar'] },
         ])
      })
   })

   describe('parameterized types', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.PARAMETERIZED_TYPE}`
      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('multiple parameters', () => {
         expect(result.types.map(d => d.name)).to.deep.equal([
            'ValidRange',
            'LowerBoundedValidRange',
            'RangeBound',
            'Either',
         ])
      })
   })

   describe('function with let expression', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.FUNCTION_WITH_LET}`
      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('function annotations', () => {
         expect(result.function_annotations.map(d => d.name)).to.deep.equal(['optionalDecoder'])
      })

      it('function declarations', () => {
         expect(result.function_declarations.map(d => ({ name: d.name, parameters: d.parameters }))).to.deep.equal([
            { name: 'optionalDecoder', parameters: ['pathDecoder', 'valDecoder', 'fallback'] },
         ])
      })
   })

   describe('function with pattern expression', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.FUNCTION_WITH_PATTERN}`
      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('function annotations', () => {
         expect(
            result.function_annotations.map(d => ({
               name: d.name,
               type_annotation: d.type_annotation,
            }))
         ).to.deep.equal([
            {
               name: 'functionWithPattern',
               type_annotation: 'TypeName -> { a | foo : Int, bar : String }, (Result Http.Error () -> msg) -> Cmd msg',
            },
            { name: 'myTime', type_annotation: 'Foo -> Int' },
            { name: 'tuplePatterns', type_annotation: '(Int, Int) -> Int' },
            { name: 'unitPattern', type_annotation: '() -> Int' },
            { name: 'emptyRecordPattern', type_annotation: '{ a | b : Int } -> Int' },
         ])
      })

      it('function declarations', () => {
         expect(result.function_declarations.map(d => ({ name: d.name, parameters: d.parameters }))).to.deep.equal([
            { name: 'functionWithPattern', parameters: ['id', 'bar', 'foo'] },
            { name: 'myTime', parameters: ['model', 'bar'] },
            { name: 'tuplePatterns', parameters: ['a', 'b'] },
            { name: 'unitPattern', parameters: ['()'] },
            { name: 'emptyRecordPattern', parameters: [] },
         ])
      })
   })

   describe('ports', () => {
      const input = `${S.MODULE_DECLARATION}\n${S.IMPORT_LIST}\n${S.PORTS}`
      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('port annotations', () => {
         expect(result.port_annotations.map(d => ({ name: d.name }))).to.deep.equal([
            { name: 'load' },
            { name: 'modifyUrl' },
            { name: 'newUrl' },
            { name: 'onUrlChange' },
         ])
      })
   })

   describe('elm 18', () => {
      const input = Elm18.MODULE

      let result: T.Module = null

      before(() => {
         result = runParser(input)
      })

      it('module name', () => {
         expect(result.name).to.be.equal('Module')
      })

      it('port annotations', () => {
         expect(result.port_annotations.map(d => d.name)).to.deep.equal(['somePort'])
      })

      it('port declarations', () => {
         expect(result.port_declarations.map(d => d.name)).to.deep.equal(['somePort'])
      })

      it('function annotations', () => {
         expect(result.function_annotations.map(d => d.name)).to.deep.equal(['function', '%%', 'multiLineFunction'])
      })

      it('function declarations', () => {
         expect(result.function_declarations.map(d => d.name)).to.deep.equal(['function', '%%', 'multiLineFunction'])
      })
   })
})
