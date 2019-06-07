import { isNamedType, GraphQLNamedType, printType } from "graphql";
import { Plugin, Config, Refs, Printer } from "pretty-format";

export = {
  test(value: any) {
    return value && isNamedType(value);
  },

  serialize(
    value: GraphQLNamedType,
    config: Config,
    indentation: string,
    depth: number,
    refs: Refs,
    printer: Printer
  ): string {
    return printType(value);
  }
} as Plugin;
