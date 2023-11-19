import { Link, User } from "@prisma/client";
import { Context } from "../../context";
import { mutation } from "./mutation";
import { query } from "./query";

export const resolvers = {
  Query: query(),
  Mutation: mutation(),
  Link: {
    id: (parent: Link) => parent.id,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
    postedBy: (parent: Link, args: {}, context: Context) => {
      if (parent.postedById === null) {
        return null;
      }

      return context.prisma.link
        .findUnique({
          where: { id: parent.id },
        })
        .postedBy();
    },
  },
  User: {
    links: (parent: User, args: {}, context: Context) => {
      return context.prisma.user
        .findUnique({
          where: { id: parent.id },
        })
        .links();
    },
  },
};
