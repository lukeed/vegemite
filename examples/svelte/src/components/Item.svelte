<script>
	import { todomvc } from '../store';

	export let id = '';
	export let title = '';
	export let completed = false;

	let editor, editing = false;

	$: if (editing && editor) {
		editor.value = title;
		editor.focus();
	}

	$: classname = [
		editing && 'editing',
		completed && 'completed',
	].filter(Boolean).join(' ');

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

	function onToggle() {
		todomvc.dispatch('todo:toggle', id);
	}

	function onDestroy() {
		todomvc.dispatch('todo:del', id);
	}

	function ondblclick() {
		editing = true;
	}

	function onblur() {
		let value = editor.value.trim();
		if (value.length > 0) {
			todomvc.dispatch('todo:put', { id, value });
		}
		editor.value = null;
		editing = false;
	}

	function onkeydown(ev) {
		if (ev.which === 27) {
			editor.value = null;
			editing = false;
		} else if (ev.which === 13) {
			onblur();
		}
	}
</script>

<li class={classname}>
	<div class="view">
		<input type="checkbox" class="toggle" checked={completed} on:change={onToggle} />
		<label on:dblclick={ondblclick}>{title}</label>
		<button class="destroy" on:click={onDestroy} />
	</div>

	{#if editing}
		<input bind:this={editor} class="edit" on:blur={onblur} on:keydown={onkeydown} />
	{/if}
</li>
