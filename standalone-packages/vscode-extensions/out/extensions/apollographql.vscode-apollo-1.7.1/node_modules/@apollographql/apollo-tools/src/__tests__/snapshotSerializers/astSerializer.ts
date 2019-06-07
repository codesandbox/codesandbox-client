import { ASTNode, print } from "graphql";
import { Plugin, Config, Refs, Printer } from "pretty-format";

export = {
  test(value: any) {
    return value && typeof value.kind === "string";
  },

  serialize(
    value: ASTNode,
    config: Config,
    indentation: string,
    depth: number,
    refs: Refs,
    printer: Printer
  ): string {
    return (
      indentation +
      print(value)
        .trim()
        .replace(/\n/g, "\n" + indentation)
    );
  }
} as Plugin;
