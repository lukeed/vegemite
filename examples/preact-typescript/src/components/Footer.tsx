import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { pluralize, FILTER, toFilter } from '../utils';
import { todomvc } from '../store';

// ---

todomvc.on('filter:update', (state, filter) => {
	state.filter = filter;
});

todomvc.on('todos:clear', state => {
	state.todos = state.todos.filter(FILTER.active);
});

// ---

function onhashchange() {
	todomvc.dispatch('filter:update', toFilter());
}

function onClear() {
	todomvc.dispatch('todos:clear', void 0);
}

export default function (props: typeof todomvc.state) {
	const { todos, filter, actives } = props;

	useEffect(() => {
		addEventListener('hashchange', onhashchange);
		return () => removeEventListener('hashchange', onhashchange);
	});

	return (
		<footer class="footer">
			<span class="todo-count">
				<strong>{actives.length}</strong> {pluralize(actives.length, 'item')} left
			</span>

			<ul class="filters">
				<li><a href="#/" class={filter == 'all' ? 'selected' : ''}>All</a></li>
				<li><a href="#/active" class={filter == 'active' ? 'selected' : ''}>Active</a></li>
				<li><a href="#/completed" class={filter == 'completed' ? 'selected' : ''}>Completed</a></li>
			</ul>

			{
				(todos.length - actives.length) > 0 && (
					<button class="clear-completed" onClick={onClear}>Clear completed</button>
				)
			}
		</footer>
	);
}
