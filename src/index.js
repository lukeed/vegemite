import klona from 'klona';

function loop(list, data, state, idx) {
	var tmp, fn = list[idx++];
	if (!fn) return Promise.resolve(state);

	tmp = fn(state, data);
	if (tmp == null) return Promise.resolve(state);
	if (typeof tmp.then == 'function') return tmp.then(d => loop(list, data, d, idx));

	if (typeof tmp == 'object') state = tmp;
	return (idx < list.length) ? loop(list, data, state, idx) : Promise.resolve(state);
}

export default function (obj) {
	var $, tree={}, hooks={}, value = obj || {};

	var rem = (arr, func) => {
		arr.splice(arr.indexOf(func) >>> 0, 1);
	}

	return $ = {
		get state() {
			return value;
		},

		on(evt, func) {
			tree[evt] = (tree[evt] || []).concat(func);
			return () => rem(tree[evt], func);
		},

		set(obj, evt) {
			let i=0, prev=value, arr=(hooks['*'] || []).concat(evt && hooks[evt] || []);
			for (value=obj; i < arr.length; i++) arr[i]($.state, prev);
		},

		listen(evt, func) {
			if (typeof evt == 'function') {func=evt; evt='*'}
			hooks[evt] = (hooks[evt] || []).concat(func);
			return () => rem(hooks[evt], func);
		},

		dispatch(evt, data) {
			return loop(tree[evt] || [], data, klona(value), 0).then(x => $.set(x, evt));
		}
	};
}
