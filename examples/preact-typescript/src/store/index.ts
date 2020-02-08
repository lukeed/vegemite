import vegemite from 'vegemite';
import { toFilter } from '../utils';

interface EventMap {
	'todo:add': Todo['title'];
	'todo:toggle': Todo['id'];
	'todo:toggleall': Todo['completed'];
	'todo:put': Pick<Todo, 'id'|'title'>;
	'todo:del': Todo['id'];
	'todos:clear': void;
	'filter:update': Filter;
}

interface State {
	todos: Todo[];
	actives: Todo[];
	visibles: Todo[];
	filter: Filter;
}

export const todomvc = vegemite<EventMap, State>({
	todos: [],
	actives: [],
	visibles: [],
	filter: toFilter(),
});
