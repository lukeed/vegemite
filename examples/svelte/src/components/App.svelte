<script>
	import { todomvc } from '../store';
	import { FILTER } from '../utils';

	import Footer from './Footer';
	import Item from './Item';

	// ---

	todomvc.on('todo:add', (state, text) => {
		state.todos.push({
			id: Math.random().toString(32).slice(5),
			completed: false,
			title: text
		});
	});

	todomvc.on('todo:toggleall', (state, checked) => {
		state.todos = state.todos.map(x => {
			x.completed = checked;
			return x;
		});
	});

	// ---

	function onkeydown(ev) {
		if (ev.keyCode !== 13) return;
		ev.preventDefault();

		let title = ev.target.value.trim();
		if (title.length > 0) {
			todomvc.dispatch('todo:add', title);
			ev.target.value = null;
		}
	}

	function ontoggleall(ev) {
		todomvc.dispatch('todo:toggleall', !!ev.target.checked);
	}

	// ---

	let state = todomvc.state;
	todomvc.listen(obj => state = obj);

	$: actives = state.todos.filter(FILTER.active).length;
	$: visibles = state.todos.filter(FILTER[state.filter]);
</script>

<div class="todoapp">
	<header class="header">
		<h1>todos</h1>
		<input
			class="new-todo"
			placeholder="What needs to be done?"
			on:keydown={onkeydown} autofocus
		/>
	</header>

	{#if state.todos.length}
		<section class="main">
			<input
				type="checkbox"
				class="toggle-all"
				on:change={ontoggleall}
				checked={!actives}
			/>

			<ul class="todo-list">
				{#each visibles as todo (todo.id)}
					<Item {...todo} />
				{/each}
			</ul>
		</section>

		<Footer {...state} count={actives} />
	{/if}
</div>
