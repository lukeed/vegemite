<script>
	import { todomvc } from '../store';
	import { pluralize, FILTER, toFilter } from '../utils';

	export let count = 0;
	export let todos = [];
	export let filter = '';

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
		todomvc.dispatch('todos:clear');
	}
</script>

<svelte:window on:hashchange={onhashchange} />

<footer class="footer">
	<span class="todo-count">
		<strong>{count}</strong> {pluralize(count, 'item')} left
	</span>

	<ul class="filters">
		<li><a href="#/" class={filter == 'all' && 'selected'}>All</a></li>
		<li><a href="#/active" class={filter == 'active' && 'selected'}>Active</a></li>
		<li><a href="#/completed" class={filter == 'completed' && 'selected'}>Completed</a></li>
	</ul>

	{#if (todos.length - count) > 0}
		<button class="clear-completed" on:click={onClear}>Clear completed</button>
	{/if}
</footer>
