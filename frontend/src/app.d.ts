/// <reference types="lucia" />
declare global {
	namespace Lucia {
		type Auth = import("$lib/server/lucia").Auth;
		type DatabaseUserAttributes = {
			username: string;
			firstName: string;
			lastName: string;
			email: string;
			image?: string;
			admin: boolean;
		};
		type DatabaseSessionAttributes = object;
	}
	namespace App {
		interface Locals {
			auth: import("lucia").AuthRequest;
		}
	}
}

export {};