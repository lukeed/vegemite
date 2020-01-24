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
	var $, tree={}, hooks=[], value = obj || {};

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

		set(obj, idx) {
			value = obj;
			for (idx=0; idx < hooks.length; idx++) {
				hooks[idx]($.state);
			}
		},

		listen(func) {
			hooks.push(func);
			return () => {
				hooks.splice(hooks.indexOf(func) >>> 0, 1);
			};
		},

		dispatch(evt, data) {
			return loop(tree[evt] || [], data, klona(value), 0).then($.set);
		}
	};
}
