const gqlRequire = require("../src");
const gqlDefault = require("../src").default;
const assert = require("chai").assert;

[gqlRequire, gqlDefault].forEach((gql, i) => {
  describe(`gql ${i}`, () => {
    it("is correct for a simple query", () => {
      const ast = gql`
        {
          user(id: 5) {
            firstName
            lastName
          }
        }
      `;

      assert.equal(ast.kind, "Document");
      assert.deepEqual(ast.definitions, [
        {
          kind: "OperationDefinition",
          operation: "query",
          name: undefined,
          variableDefinitions: [],
          directives: [],
          selectionSet: {
            kind: "SelectionSet",
            selections: [
              {
                kind: "Field",
                alias: undefined,
                name: {
                  kind: "Name",
                  value: "user"
                },
                arguments: [
                  {
                    kind: "Argument",
                    name: {
                      kind: "Name",
                      value: "id"
                    },
                    value: {
                      kind: "IntValue",
                      value: "5"
                    }
                  }
                ],
                directives: [],
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [
                    {
                      kind: "Field",
                      alias: undefined,
                      name: {
                        kind: "Name",
                        value: "firstName"
                      },
                      arguments: [],
                      directives: [],
                      selectionSet: undefined
                    },
                    {
                      kind: "Field",
                      alias: undefined,
                      name: {
                        kind: "Name",
                        value: "lastName"
                      },
                      arguments: [],
                      directives: [],
                      selectionSet: undefined
                    }
                  ]
                }
              }
            ]
          }
        }
      ]);
    });

    it("is correct for a fragment", () => {
      const ast = gql`
        fragment UserFragment on User {
          firstName
          lastName
        }
      `;

      assert.equal(ast.kind, "Document");
      assert.deepEqual(ast.definitions, [
        {
          kind: "FragmentDefinition",
          name: {
            kind: "Name",
            value: "UserFragment"
          },
          typeCondition: {
            kind: "NamedType",
            name: {
              kind: "Name",
              value: "User"
            }
          },
          directives: [],
          selectionSet: {
            kind: "SelectionSet",
            selections: [
              {
                kind: "Field",
                alias: undefined,
                name: {
                  kind: "Name",
                  value: "firstName"
                },
                arguments: [],
                directives: [],
                selectionSet: undefined
              },
              {
                kind: "Field",
                alias: undefined,
                name: {
                  kind: "Name",
                  value: "lastName"
                },
                arguments: [],
                directives: [],
                selectionSet: undefined
              }
            ]
          }
        }
      ]);
    });
  });
});
