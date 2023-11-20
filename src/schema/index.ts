import { readFileSync } from "fs";
import { createSchema } from "graphql-yoga";
import { resolvers } from "./resolvers";

const typeDefs = readFileSync(require.resolve("./schema.graphql")).toString(
  "utf-8"
);

export const schema = createSchema({
  typeDefs,
  resolvers,
});
