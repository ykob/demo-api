import { PrismaClient, User } from "@prisma/client";
import { YogaInitialContext } from "graphql-yoga";
import { authenticateUser } from "./auth";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  currentUser: null | User;
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<Context> {
  return {
    prisma,
    currentUser: await authenticateUser(prisma, initialContext.request),
  };
}
