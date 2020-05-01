import { Component, h, Prop } from "@stencil/core";
import { pluralize, FILTER, toFilter } from "../../utils";
import { todomvc } from "../../store";

// ---

todomvc.on("filter:update", (state, filter) => {
	state.filter = filter;
});

todomvc.on("todos:clear", (state) => {
	state.todos = state.todos.filter(FILTER.active);
});

// ---

function onhashchange() {
	todomvc.dispatch("filter:update", toFilter());
}

function onClear() {
	todomvc.dispatch("todos:clear", void 0);
}

@Component({
	tag: "todo-footer",
})
export class TodoFooter {
	@Prop() todos: Todo[];
	@Prop() filter: Filter;
	@Prop() count: number;

	connectedCallback() {
		addEventListener("hashchange", onhashchange);
	}

	disconnectedCallback() {
		removeEventListener("hashchange", onhashchange);
	}

	render() {
		const { todos, filter, count } = this;

		return (
			<footer class="footer">
				<span class="todo-count">
					<strong>{count}</strong> {pluralize(count, "item")} left
				</span>

				<ul class="filters">
					<li>
						<a href="#/" class={filter == "all" ? "selected" : ""}>
							All
						</a>
					</li>
					<li>
						<a href="#/active" class={filter == "active" ? "selected" : ""}>
							Active
						</a>
					</li>
					<li>
						<a
							href="#/completed"
							class={filter == "completed" ? "selected" : ""}
						>
							Completed
						</a>
					</li>
				</ul>

				{todos.length - count > 0 && (
					<button class="clear-completed" onClick={onClear}>
						Clear completed
					</button>
				)}
			</footer>
		);
	}
}
