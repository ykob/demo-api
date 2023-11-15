import { DateTimeResolver } from "graphql-scalars";
import { Context } from "../../context";
import { mutation } from "./mutation";
import { query } from "./query";

export const resolvers = {
  Query: query(),
  Mutation: mutation(),
  DateTime: DateTimeResolver,
  Post: {
    author: (parent, _args, context: Context) => {
      return context.prisma.post
        .findUnique({
          where: { id: parent?.id },
        })
        .author();
    },
  },
  User: {
    posts: (parent, _args, context: Context) => {
      return context.prisma.user
        .findUnique({
          where: { id: parent?.id },
        })
        .posts();
    },
  },
};
