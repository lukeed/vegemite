import { Component, h, State, Prop } from "@stencil/core";
import { todomvc } from "../../store";

// ---

todomvc.on("todo:toggle", (state, id) => {
	state.todos = state.todos.map((x) => {
		if (x.id === id) x.completed = !x.completed;
		return x;
	});
});

todomvc.on("todo:del", (state, id) => {
	state.todos = state.todos.filter((x) => x.id !== id);
});

todomvc.on("todo:put", (state, data) => {
	state.todos = state.todos.map((x) => {
		if (x.id === data.id) x.title = data.title;
		return x;
	});
});

// ---

@Component({
	tag: "todo-item",
})
export class TodoItem {
	@State() editing: boolean = false;
	@Prop() uid: Todo["id"];
	@Prop() completed: Todo["completed"];
	@Prop() text: Todo["title"];

	editor!: HTMLInputElement;

	componentDidUpdate() {
		if (this.editing) {
			this.editor.value = this.text;
			this.editor.focus();
		}
	}

	onToggle = () => {
		todomvc.dispatch("todo:toggle", this.uid);
	};

	onDestroy = () => {
		todomvc.dispatch("todo:del", this.uid);
	};

	onDblClick = () => {
		this.editing = true;
	};

	onblur = (ev: FocusEvent | KeyboardEvent): void => {
		const target = ev.target as HTMLInputElement;

		let title = target.value.trim();
		if (title.length > 0) {
			todomvc.dispatch("todo:put", { id: this.uid, title });
		}

		target.value = "";
		this.editing = false;
	};

	onkeydown = (ev: KeyboardEvent) => {
		if (ev.which === 27) {
			(ev.target as HTMLInputElement).value = "";
			this.editing = false;
		} else if (ev.which === 13) {
			this.onblur(ev);
		}
	};

	render() {
		const { text, completed } = this;

		const classname = [this.editing && "editing", completed && "completed"]
			.filter(Boolean)
			.join(" ");

		return (
			<li class={classname}>
				<div class="view">
					<input
						type="checkbox"
						class="toggle"
						checked={completed}
						onChange={this.onToggle}
					/>
					<label onDblClick={this.onDblClick}>{text}</label>
					<button class="destroy" onClick={this.onDestroy} />
				</div>
				{this.editing && (
					<input
						ref={(el) => (this.editor = el as HTMLInputElement)}
						class="edit"
						onBlur={this.onblur}
						onKeyDown={this.onkeydown}
					/>
				)}
			</li>
		);
	}
}
