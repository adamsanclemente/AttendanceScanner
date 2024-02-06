export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12')
];

export const server_loads = [2,3];

export const dictionary = {
		"/": [~4],
		"/(app)/account": [~5,[2]],
		"/(app)/app": [6,[2]],
		"/(app)/app/admin": [~7,[2,3]],
		"/(app)/app/classes": [~9,[2]],
		"/(app)/app/class/[classid]": [~8,[2]],
		"/(app)/app/student/[studentid]": [~10,[2]],
		"/login": [~11],
		"/signup": [~12]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';