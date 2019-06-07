import { relative } from "path";
import minimatch = require("minimatch");
import glob from "glob";
import { invariant } from "@apollographql/apollo-tools";
import URI from "vscode-uri";
import { normalizeURI } from "./utilities";

export class FileSet {
  private rootURI: URI;
  private includes: string[];
  private excludes: string[];

  constructor({
    rootURI,
    includes,
    excludes,
    configURI
  }: {
    rootURI: URI;
    includes: string[];
    excludes: string[];
    configURI?: URI;
  }) {
    invariant(rootURI, `Must provide "rootURI".`);
    invariant(includes, `Must provide "includes".`);
    invariant(excludes, `Must provide "excludes".`);

    this.rootURI = rootURI;
    this.includes = includes;
    this.excludes = excludes;
  }

  includesFile(filePath: string): boolean {
    return this.allFiles().includes(normalizeURI(filePath));
  }

  allFiles(): string[] {
    // since glob.sync takes a single pattern, but we allow an array of `includes`, we can join all the
    // `includes` globs into a single pattern and pass to glob.sync. The `ignore` option does, however, allow
    // an array of globs to ignore, so we can pass it in directly
    const joinedIncludes = `{${this.includes.join(",")}}`;
    return glob
      .sync(joinedIncludes, {
        cwd: this.rootURI.fsPath,
        absolute: true,
        ignore: this.excludes
      })
      .map(normalizeURI);
  }
}
