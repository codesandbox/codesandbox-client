## ts-doc-gen

> INFO: This package is deprecated please use [suf-cli](https://www.npmjs.com/package/suf-cli) instead.

cli for generating markdown docs from `d.ts` files.

### Usage

just run `tdg`.

| Flag                | Default     | Description                                                               |
| ------------------- | ----------- | ------------------------------------------------------------------------- |
| `--out OUTPUT_FILE` | `README.md` | Relative path to the output file with extension.                          |
| `--dir DIR`         | `dist`      | Relative path to the input dir.                                           |
| `--name NAME`       | `Docs`      | Header name.                                                              |
| `--exclude FILES`   | `''`        | Comma separated list of files to exclude, cannot be used with `--include` |
| `--include FILES`   | `''`        | Comma separated list of files to include, cannot be used with `--exclude` |
| `-h --help`         |             | Displays help Message.                                                    |
