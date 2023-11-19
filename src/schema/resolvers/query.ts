import { Context } from "../../context";

export const query = () => ({
  me(parent: unknown, args: {}, context: Context) {
    if (context.currentUser === null) {
      throw new Error("Unauthenticated");
    }
    return context.currentUser;
  },
  feed(parent: unknown, args: {}, context: Context) {
    if (context.currentUser === null) {
      throw new Error("Unauthenticated");
    }
    return context.prisma.link.findMany({
      where: { postedById: context.currentUser.id },
    });
  },
});
