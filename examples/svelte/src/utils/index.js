export function pluralize(count, word) {
	return count === 1 ? word : word + 's';
}

export function toFilter() {
	return (location.hash || '').split('/').pop().toLowerCase() || 'all';
}

export const FILTER = {
	all: () => true,
	active: x => !x.completed,
	completed: x => x.completed
};
