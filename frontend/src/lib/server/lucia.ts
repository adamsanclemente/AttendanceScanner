import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import pClient from "./prisma";

export const auth = lucia({
	adapter: prisma(pClient),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),

	getUserAttributes: (data) => {
		return {
			username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            image: data.image || null,
			admin: data.admin,
		};
	}
});

export type Auth = typeof auth;