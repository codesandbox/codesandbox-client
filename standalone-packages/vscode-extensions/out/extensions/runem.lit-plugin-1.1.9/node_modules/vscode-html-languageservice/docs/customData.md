# Custom Data for HTML Language Service

In VS Code, there are two ways of loading custom HTML datasets:

1. With setting `html.experimental.customData`
2. With an extension that contributes `contributes.html.experimental.customData`

Both setting point to a list of JSON files. This document describes the shape of the JSON files.

## Custom Data Format

🚧 The data format is in experimental phase and subject to change. 🚧

The JSON have one required property, `version` and 3 other top level properties:

```jsonc
{
  "version": 1,
  "tags": [],
  "globalAttributes": [],
  "valueSets": []
}
```

Version denotes the schema version you are using. The latest schema version is V1.

You can find other properties' shapes at [htmlLanguageTypes.ts](../src/htmlLanguageTypes.ts) or the [JSON Schema](./customData.schema.json).

You might want to use the `json.schemas` setting to check your data against the schema and get auto-completion:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["/html.json"],
      "url": "https://raw.githubusercontent.com/Microsoft/vscode-html-languageservice/master/docs/customData.schema.json"
    }
  ]
}
```

[html5.ts](../src/languageFacts/data/html5.ts) contains that built-in dataset that conforms to the spec.

## Language Features

Custom data receives the following language features:

- Completion on tag, attirbute and attribute value
- Hover on tag (here's the [issue](https://github.com/Microsoft/vscode-html-languageservice/issues/47) for hover on attribute / attribute-name)

For example, for the following custom data:

```json
{
  "tags": [
    {
      "name": "foo",
      "description": "The foo element",
      "attributes": [
        { "name": "bar" },
        {
          "name": "baz",
          "values": [
            {
              "name": "baz-val-1"
            }
          ]
        }
      ]
    }
  ],
  "globalAttributes": [
    { "name": "fooAttr", "description": "Foo Attribute" },
    { "name": "xattr", "description": "X attributes", "valueSet": "x" }
  ],
  "valueSets": [
    {
      "name": "x",
      "values": [
        {
          "name": "xval",
          "description": "x value"
        }
      ]
    }
  ]
}
```

- Completion on `<|` will provide `foo`
- Completion on `<foo |` will provide `bar` and `baz`
- Completion on `<foo baz=|` will provide `baz-val-1`
- Completion on `<foo |` will also provide the global attributes `fooAttr` and `xattr`
- Completion on `<foo xattr=>` will provide all values in valueSet `x`, which is `xval`
- Hover on `foo` will show `The foo element`