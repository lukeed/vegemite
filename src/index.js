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

	return Object.defineProperty($ = {
		on: function (evt, func) {
			tree[evt] = (tree[evt] || []).concat(func);
			return function () {
				tree[evt].splice(tree[evt].indexOf(func) >>> 0, 1);
			};
		},

		set: function (obj, idx) {
			value = obj;
			for (idx=0; idx < hooks.length; idx++) {
				hooks[idx]($.state);
			}
		},

		listen: function (func) {
			hooks.push(func);
			return function () {
				hooks.splice(hooks.indexOf(func) >>> 0, 1);
			};
		},

		dispatch: function (evt, data) {
			return loop(tree[evt] || [], data, klona(value), 0).then($.set);
		}
	}, 'state', {
		enumerable: true,
		get: function () {
			return value;
		}
	});
}
