export type Parser<T> = {
   (input: string, options?: any): T
}

export interface Location {
   start: {
      offset: number
      line: number
      column: number
   }
   end: {
      offset: number
      line: number
      column: number
   }
}

export interface Locatable {
   location: Location
}

export type Exposed = { type: 'type' | 'function' | 'constructor'; name: string; location: Location | null }

export type FunctionDeclaration = { type: 'function-declaration'; name: string; parameters: string[] } & Locatable

export type FunctionAnnotation = { type: 'function-annotation'; name: string; type_annotation: string } & Locatable

export type PortDeclaration = { type: 'port-declaration'; name: string; parameters: string[] } & Locatable

export type PortAnnotation = { type: 'port-annotation'; name: string; type_annotation: string } & Locatable

export type TypeAliasDeclaration = { type: 'type-alias'; name: string } & Locatable

export type ConstructorDeclaration = { type: 'constructor'; name: string } & Locatable

export type CustomTypeDeclaration = {
   type: 'custom-type'
   constructors: ConstructorDeclaration[]
   name: string
} & Locatable

export type TypeDeclaration = TypeAliasDeclaration | CustomTypeDeclaration

export interface ModuleImport {
   type: 'import' | 'default-import'
   module: string
   alias: string
   exposes_all: boolean
   exposing: Exposed[]
   location: Location | null
}

export interface Module {
   type: 'module' | 'port-module'
   name: string
   text: string
   exposes_all: boolean
   exposing: Exposed[]
   imports: ModuleImport[]
   types: TypeDeclaration[]
   function_declarations: FunctionDeclaration[]
   function_annotations: FunctionAnnotation[]
   port_annotations: PortAnnotation[]
   port_declarations: PortDeclaration[]
   location: Location
}

export interface ModuleView {
   type: 'module' | 'port-module'
   name: string
   custom_types: CustomTypeDeclaration[]
   type_aliases: TypeAliasDeclaration[]
   functions: {
      name: string
      location: Location
      declaration: FunctionDeclaration
      annotation: FunctionAnnotation
   }[]
}
