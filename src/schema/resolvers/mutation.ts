import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { APP_SECRET } from "../../auth";
import { Context } from "../../context";

export const mutation = () => ({
  async signup(
    _parent: unknown,
    args: { email: string; password: string; name: string },
    context: Context
  ) {
    const password = await hash(args.password, 10);
    const user = await context.prisma.user.create({
      data: { ...args, password },
    });
    const token = sign({ userId: user.id }, APP_SECRET);

    return { token, user };
  },
  async login(
    _parent: unknown,
    args: { email: string; password: string },
    context: Context
  ) {
    const user = await context.prisma.user.findUnique({
      where: { email: args.email },
    });

    if (!user) {
      throw new Error(`No user found for email: ${args.email}`);
    }

    const valid = await compare(args.password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    const token = sign({ userId: user.id }, APP_SECRET);

    return { token, user };
  },
  async post(
    _parent: unknown,
    args: { url: string; description: string },
    context: Context
  ) {
    if (context.currentUser === null) {
      throw new Error("Unauthenticated");
    }

    const newLink = await context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: context.currentUser.id } },
      },
    });

    return newLink;
  },
});
