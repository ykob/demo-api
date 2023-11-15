import { Context } from "../../context";

interface PostCreateInput {
  title: string;
  content?: string;
}

interface UserCreateInput {
  email: string;
  name?: string;
  posts?: PostCreateInput[];
}

export const mutation = () => ({
  signupUser: (_parent, args: { data: UserCreateInput }, context: Context) => {
    const postData = args.data.posts?.map((post) => {
      return { title: post.title, content: post.content || undefined };
    });

    return context.prisma.user.create({
      data: {
        name: args.data.name,
        email: args.data.email,
        posts: {
          create: postData,
        },
      },
    });
  },
  createDraft: (
    _parent,
    args: { data: PostCreateInput; authorEmail: string },
    context: Context
  ) => {
    return context.prisma.post.create({
      data: {
        title: args.data.title,
        content: args.data.content,
        author: {
          connect: { email: args.authorEmail },
        },
      },
    });
  },
  togglePublishPost: async (
    _parent,
    args: { id: number },
    context: Context
  ) => {
    try {
      const post = await context.prisma.post.findUnique({
        where: { id: args.id || undefined },
        select: {
          published: true,
        },
      });

      return context.prisma.post.update({
        where: { id: args.id || undefined },
        data: { published: !post?.published },
      });
    } catch (error) {
      throw new Error(
        `Post with ID ${args.id} does not exist in the database.`
      );
    }
  },
  deletePost: (_parent, args: { id: number }, context: Context) => {
    return context.prisma.post.delete({
      where: { id: args.id },
    });
  },
});
