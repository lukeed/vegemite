import { Component, h, State } from "@stencil/core";
import { todomvc } from "../../store";
import { FILTER } from "../../utils";

// ---

todomvc.on("todo:add", (state, text) => {
	state.todos.push({
		id: Math.random().toString(32).slice(5),
		completed: false,
		title: text,
	});
});

todomvc.on("todo:toggleall", (state, checked) => {
	state.todos = state.todos.map((x) => {
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
		todomvc.dispatch("todo:add", value);
		target.value = "";
	}
}

function ontoggleall(ev: Event) {
	const target = ev.target as HTMLInputElement;
	todomvc.dispatch("todo:toggleall", !!target.checked);
}

// ---

@Component({
	tag: "todo-app",
})
export class TodoApp {
	@State() state = todomvc.state;

	connectedCallback() {
		todomvc.listen((state) => (this.state = state));
	}

	render() {
		const actives = this.state.todos.filter(FILTER.active).length;
		const visibles = this.state.todos.filter(FILTER[this.state.filter]);

		return (
			<div class="todoapp">
				<header class="header">
					<h1>todos</h1>
					<input
						class="new-todo"
						placeholder="What needs to be done?"
						onKeyDown={onkeydown}
						autoFocus={true}
					/>
				</header>

				{this.state.todos.length
					? [
							<section class="main">
								<input
									type="checkbox"
									class="toggle-all"
									onChange={ontoggleall}
									checked={!actives}
								/>
								<ul class="todo-list">
									{visibles.map(({ id, title, ...x }) => (
										<todo-item uid={id} text={title} {...x} />
									))}
								</ul>
							</section>,
							<todo-footer {...this.state} count={actives} />,
					  ]
					: null}
			</div>
		);
	}
}
