import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { todomvc } from '../store';
import { FILTER } from '../utils';

import Footer from './Footer';
import Item from './Item';

// ---

todomvc.on('todo:add', (state, text) => {
	state.todos.push({
		id: Math.random().toString(32).slice(5),
		completed: false,
		title: text,
	});
});

todomvc.on('todo:toggleall', (state, checked) => {
	state.todos = state.todos.map(x => {
		x.completed = checked;
		return x;
	});
});

// ---

function onkeydown(ev: KeyboardEvent) {
	if (ev.keyCode !== 13) return;
	ev.preventDefault();

	const target = ev.target as HTMLInputElement;
	const value = target.value.trim();
	if (value.length > 0) {
		todomvc.dispatch('todo:add', value);
		target.value = '';
	}
}

function ontoggleall(ev: Event) {
	const target = ev.target as HTMLInputElement;
	todomvc.dispatch('todo:toggleall', !!target.checked);
}

// ---

export default function () {
	const [state, setState] = useState(todomvc.state);
	useEffect(() => todomvc.listen(setState));

	state.actives = state.todos.filter(FILTER.active);
	state.visibles = state.todos.filter(FILTER[state.filter]);

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
							onChange={ontoggleall}
							checked={!state.actives.length}
						/>
						<ul class="todo-list">
							{ state.visibles.map(x => <Item key={x.id} {...x} />) }
						</ul>
					</section>,
					<Footer {...state} />
				] : null
			}
		</div>
	);
}
