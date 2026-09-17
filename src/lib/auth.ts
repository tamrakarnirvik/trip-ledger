import { betterAuth } from "better-auth";

import {
  prismaAdapter,
} from "better-auth/adapters/prisma";

import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,

    disableSignUp:
      process.env.ALLOW_SIGNUP !== "true",

    minPasswordLength: 8,
  },

  user: {
    additionalFields: {
      role: {
        type: [
          "TREASURER",
          "FRIEND",
        ],

        required: false,

        defaultValue:
          "FRIEND",

        input: false,
      },
    },
  },
});