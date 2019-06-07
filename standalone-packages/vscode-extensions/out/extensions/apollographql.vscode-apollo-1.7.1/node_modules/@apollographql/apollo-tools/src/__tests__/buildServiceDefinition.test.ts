import gql from "graphql-tag";
import { buildServiceDefinition } from "../buildServiceDefinition";
import { GraphQLObjectType } from "graphql";

describe("buildServiceDefinition", () => {
  describe(`type definitions`, () => {
    it(`should include types from different modules`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }
        `,
        gql`
          type Post {
            title: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("User")).toMatchInlineSnapshot(`
type User {
  name: String
}
`);

      expect(schema.getType("Post")).toMatchInlineSnapshot(`
type Post {
  title: String
}
`);
    });

    it(`should not allow two types with the same name in the same module`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }
        `,
        gql`
          type User {
            title: String
          }
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Type "User" was defined more than once.],
]
`);
    });

    it(`should not allow two types with the same name in different modules`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }
        `,
        gql`
          type User {
            title: String
          }
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Type "User" was defined more than once.],
]
`);
    });

    it(`should report multiple type duplication errors`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }
        `,
        gql`
          type User {
            title: String
          }
        `,
        gql`
          type Post {
            title: String
          }
        `,
        gql`
          type Post {
            name: String
          }
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Type "User" was defined more than once.],
  [GraphQLError: Type "Post" was defined more than once.],
]
`);
    });
  });

  describe(`directive definitions`, () => {
    it(`should include directive`, () => {
      const service = buildServiceDefinition([
        gql`
          directive @something on FIELD_DEFINITION
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;
      const directive = schema.getDirective("something");
      expect(directive).toBeDefined();
    });

    it(`should include directives from different modules`, () => {
      const service = buildServiceDefinition([
        gql`
          directive @something on FIELD_DEFINITION
        `,
        gql`
          directive @another on FIELD_DEFINITION
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getDirective("something")).toMatchInlineSnapshot(
        `"@something"`
      );

      expect(schema.getDirective("another")).toMatchInlineSnapshot(
        `"@another"`
      );
    });

    it(`should not allow two types with the same name in the same module`, () => {
      const service = buildServiceDefinition([
        gql`
          directive @something on FIELD_DEFINITION
        `,
        gql`
          directive @something on FIELD_DEFINITION
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Directive "something" was defined more than once.],
]
`);
    });

    it(`should not allow two types with the same name in different modules`, () => {
      const service = buildServiceDefinition([
        gql`
          directive @something on FIELD_DEFINITION
        `,
        gql`
          directive @something on FIELD_DEFINITION
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Directive "something" was defined more than once.],
]
`);
    });

    it(`should report multiple type duplication errors`, () => {
      const service = buildServiceDefinition([
        gql`
          directive @something on FIELD_DEFINITION
        `,
        gql`
          directive @something on FIELD_DEFINITION
        `,
        gql`
          directive @another on FIELD_DEFINITION
        `,
        gql`
          directive @another on FIELD_DEFINITION
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Directive "something" was defined more than once.],
  [GraphQLError: Directive "another" was defined more than once.],
]
`);
    });
  });

  describe(`type extension`, () => {
    it(`should allow extending a type from the same module`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }

          extend type User {
            email: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("User")).toMatchInlineSnapshot(`
type User {
  name: String
  email: String
}
`);
    });

    it(`should allow extending a type from a different module`, () => {
      const service = buildServiceDefinition([
        gql`
          type User {
            name: String
          }
        `,
        gql`
          extend type User {
            email: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("User")).toMatchInlineSnapshot(`
type User {
  name: String
  email: String
}
`);
    });

    it(`should report an error when extending a non-existent type`, () => {
      const service = buildServiceDefinition([
        gql`
          extend type User {
            email: String
          }
        `
      ]);

      expect(service.errors).toMatchInlineSnapshot(`
Array [
  [GraphQLError: Cannot extend type "User" because it does not exist in the existing schema.],
]
`);
    });
  });

  describe(`extending root operation types that aren't defined elsewhere`, () => {
    it(`should be allowed`, () => {
      const service = buildServiceDefinition([
        gql`
          extend type Query {
            rootField: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("Query")).toMatchInlineSnapshot(`
type Query {
  rootField: String
}
`);
    });

    it(`should be allowed with non default type names`, () => {
      const service = buildServiceDefinition([
        gql`
          schema {
            query: QueryRoot
          }
          extend type QueryRoot {
            rootField: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("QueryRoot")).toMatchInlineSnapshot(`
type QueryRoot {
  rootField: String
}
`);
    });

    it(`should be allowed with non default nanmes specified in schema extensions`, () => {
      const service = buildServiceDefinition([
        gql`
          schema {
            query: QueryRoot
          }
          type QueryRoot {
            rootField: String
          }
        `,
        gql`
          extend schema {
            mutation: MutationRoot
          }
          extend type MutationRoot {
            rootField: String
          }
        `
      ]);

      expect(service.errors).toBeUndefined();

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      expect(schema.getType("MutationRoot")).toMatchInlineSnapshot(`
type MutationRoot {
  rootField: String
}
`);
    });
  });

  describe(`resolvers`, () => {
    it(`should add a resolver for a field`, () => {
      const name = () => {};

      const service = buildServiceDefinition([
        {
          typeDefs: gql`
            type User {
              name: String
            }
          `,
          resolvers: {
            User: {
              name
            }
          }
        }
      ]);

      expect(service.schema).toBeDefined();
      const schema = service.schema!;

      const userType = schema.getType("User");
      expect(userType).toBeDefined();

      const nameField = (userType! as GraphQLObjectType).getFields()["name"];
      expect(nameField).toBeDefined();

      expect(nameField.resolve).toEqual(name);
    });
  });
});
