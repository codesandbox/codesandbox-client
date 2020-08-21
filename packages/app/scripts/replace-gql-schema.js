// @ts-check
const fs = require('fs');

try {
  const schemaLocation = require.resolve('../src/app/graphql/schema.graphql');
  const content = fs.readFileSync(schemaLocation).toString();
  const newContent = content
    .replace(/RootQueryType/g, 'RootQuery')
    .replace(/RootMutationType/g, 'RootMutation');
  fs.writeFileSync(schemaLocation, newContent);
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(1);
}
