import vegemite from 'vegemite';
import { toFilter } from '../utils';

export const todomvc = vegemite({
	todos: [],
	actives: [],
	visibles: [],
	filter: toFilter(),
});
