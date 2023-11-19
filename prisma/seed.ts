import { PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const users = [
  {
    name: "Alice",
    email: "alice@prisma.io",
    password: "12345678",
  },
  {
    name: "Bob",
    email: "bob@prisma.io",
    password: "87654321",
  },
];

async function main() {
  const saltRounds = 10;

  for (const user of users) {
    const salt = genSaltSync(saltRounds);
    const hashedPassword = await hashSync(user.password, salt);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
  }

  const allUsers = await prisma.user.findMany();
  console.log(allUsers, { depth: null });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
