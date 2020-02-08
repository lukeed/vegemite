import { useRef, useState, useEffect } from 'preact/hooks';
import { todomvc } from '../store';

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
		if (x.id === data.id) x.title = data.value;
		return x;
	});
});

// ---

export default function (props) {
	const { id, title, completed } = props;

	const editor = useRef(null);
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (editing) {
			editor.current.value = title;
			editor.current.focus();
		}
	}, [editing]);

	const classname = [
		editing && 'editing',
		completed && 'completed',
	].filter(Boolean).join(' ');

	function onToggle() {
		todomvc.dispatch('todo:toggle', id);
	}

	function onDestroy() {
		todomvc.dispatch('todo:del', id);
	}

	function onDblClick() {
		setEditing(true);
	}

	function onblur(ev) {
		let value = ev.target.value.trim();
		if (value.length > 0) {
			todomvc.dispatch('todo:put', { id, value });
		}
		ev.target.value = null;
		setEditing(false);
	}

	function onkeydown(ev) {
		if (ev.which === 27) {
			ev.target.value = null;
			setEditing(false);
		} else if (ev.which === 13) {
			onblur(ev);
		}
	}

	return (
		<li class={classname}>
			<div class="view">
				<input type="checkbox" class="toggle" checked={completed} onchange={onToggle} />
				<label onDblClick={onDblClick}>{title}</label>
				<button class="destroy" onclick={onDestroy} />
			</div>
			{ editing && <input ref={editor} class="edit" onblur={onblur} onkeydown={onkeydown} /> }
		</li>
	);
}
