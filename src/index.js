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

	return $ = {
		get state() {
			return value;
		},

		on(evt, func) {
			tree[evt] = (tree[evt] || []).concat(func);
			return () => {
				tree[evt].splice(tree[evt].indexOf(func) >>> 0, 1);
			};
		},

		set(obj, type, arr, i) {
			value = obj;
			arr = (hooks['*'] || []).concat(type && hooks[type] || [])
			for (i=0; i < arr.length; i++) arr[i]($.state);
		},

		listen(evt, func) {
			if (typeof evt == 'function') {
				func=evt; evt='*';
			}
			hooks[evt] = (hooks[evt] || []).concat(func);
			return () => {
				hooks.splice(hooks.indexOf(func) >>> 0, 1);
			};
		},

		dispatch(evt, data) {
			return loop(tree[evt] || [], data, klona(value), 0).then($.set);
		}
	};
}
