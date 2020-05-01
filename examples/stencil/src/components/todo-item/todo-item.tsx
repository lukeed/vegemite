import { Component, h, State, Prop } from "@stencil/core";
import { todomvc } from '../../store';

// ---

todomvc.on('todo:toggle', (state, id) => {
	state.todos = state.todos.map(x => {
		if (x.id === id) x.completed = !x.completed;
		return x;
	});
});

todomvc.on('todo:del', (state, id) => {
	state.todos = state.todos.filter(x => x.id !== id);
});

todomvc.on('todo:put', (state, data) => {
	state.todos = state.todos.map(x => {
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
  @Prop() _id: Todo['id'];
  @Prop() completed: Todo['completed'];
  @Prop() _title: Todo['title'];

  editor!: HTMLInputElement;

  componentWillUpdate() {
    if (this.editing) {
			this.editor.value = this._title;
			this.editor.focus();
		}
  }

	render() {
    const { _id: id, _title: title, completed } = this;

    const classname = [
      this.editing && 'editing',
      completed && 'completed',
    ].filter(Boolean).join(' ');
  
    function onToggle() {
      todomvc.dispatch('todo:toggle', id);
    }
  
    function onDestroy() {
      todomvc.dispatch('todo:del', id);
    }
  
    function onDblClick() {
      this.editing = true;
    }
  
    function onblur(ev: FocusEvent | KeyboardEvent): void {
      const target = ev.target as HTMLInputElement;
  
      let title = target.value.trim();
      if (title.length > 0) {
        todomvc.dispatch('todo:put', { id, title });
      }
  
      target.value = '';
      this.editing = false;
    }
  
    function onkeydown(ev: KeyboardEvent) {
      if (ev.which === 27) {
        (ev.target as HTMLInputElement).value = '';
        this.editing = false;
      } else if (ev.which === 13) {
        onblur(ev);
      }
    }

		return (
      <li class={classname}>
        <div class="view">
          <input type="checkbox" class="toggle" checked={completed} onChange={onToggle} />
          <label onDblClick={onDblClick}>{title}</label>
          <button class="destroy" onClick={onDestroy} />
        </div>
        { this.editing && <input ref={(el) => this.editor = el as HTMLInputElement} class="edit" onBlur={onblur} onKeyDown={onkeydown} /> }
      </li>
    );
	}
}
