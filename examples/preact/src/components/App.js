import { useState, useEffect } from 'preact/hooks';
import { todomvc } from '../store';
import { FILTER } from '../utils';

import Footer from './Footer';
import Item from './Item';

// ---

todomvc.on('todo:add', (state, data) => {
	state.todos.push({
		id: Math.random().toString(32).slice(5),
		completed: false,
		...data
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
		todomvc.dispatch('todo:add', { title });
		ev.target.value = null;
	}
}

function ontoggleall(ev) {
	todomvc.dispatch('todo:toggleall', !!ev.target.checked);
}

// ---

export default function () {
	const [state, setState] = useState(todomvc.state);
	useEffect(() => todomvc.listen(setState));

	const actives = state.todos.filter(FILTER.active).length;
	const visibles = state.todos.filter(FILTER[state.filter]);

	return (
		<div class="todoapp">
			<header class="header">
				<h1>todos</h1>
				<input
					class="new-todo"
					placeholder="What needs to be done?"
					onKeyDown={onkeydown} autoFocus={true}
				/>
			</header>

			{
				state.todos.length ? [
					<section class="main">
						<input
							type="checkbox"
							class="toggle-all"
							onchange={ontoggleall}
							checked={!actives}
						/>
						<ul class="todo-list">
							{ visibles.map(x => <Item key={x.id} {...x} />) }
						</ul>
					</section>,
					<Footer {...state} count={actives} />
				] : null
			}
		</div>
	);
}
