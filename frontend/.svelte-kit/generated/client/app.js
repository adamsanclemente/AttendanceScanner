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
	() => import('./nodes/9')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/(app)/account": [~4,[2]],
		"/(app)/app": [5,[2]],
		"/(app)/app/classes": [~7,[2]],
		"/(app)/app/class/[classid]": [~6,[2]],
		"/login": [~8],
		"/signup": [~9]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';