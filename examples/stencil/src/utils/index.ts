export function pluralize(count: number, word: string): string {
	return count === 1 ? word : word + 's';
}

export function toFilter(): Filter {
	const str = (location.hash || '').split('/').pop() || '';
	return (str.toLowerCase() || 'all') as Filter;
}

export const FILTER: Record<Filter, (value: Todo) => boolean> = {
	all: () => true,
	active: (x: Todo) => !x.completed,
	completed: (x: Todo) => x.completed
};
