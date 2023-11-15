import { Context } from "../../context";

declare enum SortOrder {
  asc = "asc",
  desc = "desc",
}

interface PostOrderByUpdatedAtInput {
  updatedAt: SortOrder;
}

interface UserUniqueInput {
  id?: number;
  email?: string;
}

export const query = () => ({
  allUsers: (_parent, _args, context: Context) => {
    return context.prisma.user.findMany();
  },
  postById: (_parent, args: { id: number }, context: Context) => {
    return context.prisma.post.findUnique({
      where: { id: args.id || undefined },
    });
  },
  feed: (
    _parent,
    args: {
      searchString: string;
      skip: number;
      take: number;
      orderBy: PostOrderByUpdatedAtInput;
    },
    context: Context
  ) => {
    const or = args.searchString
      ? {
          OR: [
            { title: { contains: args.searchString } },
            { content: { contains: args.searchString } },
          ],
        }
      : {};

    return context.prisma.post.findMany({
      where: {
        published: true,
        ...or,
      },
      take: args?.take,
      skip: args?.skip,
      orderBy: args?.orderBy,
    });
  },
  draftsByUser: (
    _parent,
    args: { userUniqueInput: UserUniqueInput },
    context: Context
  ) => {
    return context.prisma.user
      .findUnique({
        where: {
          id: args.userUniqueInput.id || undefined,
          email: args.userUniqueInput.email || undefined,
        },
      })
      .posts({
        where: {
          published: false,
        },
      });
  },
});
