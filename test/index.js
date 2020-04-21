import test from 'tape';
import lib from '../src';

test('exports', t => {
	t.is(typeof lib, 'function', '~> exports function');
	t.is(typeof lib(), 'object', '~> returns object');
	t.end();
});

test('$.state', t => {
	let out = lib({ foo: 123 });

	t.is(typeof out.state, 'object', 'object (getter)');
	t.same(out.state, { foo: 123 }, '~> returns initial value');

	t.throws(() => out.state = { hello: 'world' }, 'getter only');
	t.same(out.state, { foo: 123 }, '~> rejected write');

	t.end();
});

test('$.set', t => {
	t.plan(5);

	let ctx = lib({ foo: 123 });
	t.is(typeof ctx.set, 'function', '~> function');

	t.is(ctx.set({ bar: 123 }), undefined, '~> returns void');
	t.same(ctx.state, { bar: 123 }, '~> updates state');

	let nxt = { a:1, b:2 };
	ctx.listen(x => t.deepEqual(x, nxt, '~> listen() saw next state'));

	ctx.set(nxt);
	t.deepEqual(ctx.state, nxt, '~> updated $.state value');
});

test('$.listen', t => {
	t.plan(13);

	let ctx = lib();

	t.is(typeof ctx.listen, 'function', '~> function');

	let data = { foo: 123, bar: 456 };

	let foo = ctx.listen(x => t.deepEqual(x, data, '(foo) ran listener'));
	t.is(typeof foo, 'function', '(foo) returned unsubscriber');

	let bar = ctx.listen('*', x => t.deepEqual(x, data, '(bar) ran listener'));
	t.is(typeof bar, 'function', '(bar) returned unsubscriber');

	let baz = ctx.listen('hello', x => t.deepEqual(x, data, '(baz) ran listener'));
	t.is(typeof baz, 'function', '(baz) returned unsubscriber');

	console.log(`$.set(data)`);
	ctx.set(data); // => +2 (foo,bar)

	console.log(`$.set(data, 'hello')`);
	ctx.set(data, 'hello'); // => +3 (foo,bar,baz)

	bar();

	console.log(`$.set(data, 'hello')`);
	ctx.set(data, 'hello'); // => +2 (foo,baz)

	baz();

	console.log(`$.set(data, 'hello')`);
	ctx.set(data, 'hello'); // => +1 (foo)

	foo();

	console.log(`$.set({ x: 123 })`);
	ctx.listen((x, prev) => t.deepEqual(prev, data, '(bat) listeners also get previous state'));
	ctx.set({ x: 123 }, 'hello'); // +1 (bat)
});

test('$.dispatch', async t => {
	let ctx = lib({ foo: 123 });

	t.is(typeof ctx.dispatch, 'function', '~> function');

	let data = { bar: 456 };

	let foo = ctx.dispatch('hello', data);
	t.true(foo instanceof Promise, '~> returns a Promise');

	let bar = await foo;
	t.is(bar, undefined, '~> resolves to void');

	t.same(ctx.state, { foo: 123 }, '~> $.state NOT changed (no reducers)');

	t.end();
});

test('$.on', async t => {
	let ctx = lib();

	let order = [];
	let pusher = x => () => order.push(x);

	t.is(typeof ctx.on, 'function', '~> function');

	ctx.listen(pusher('listen'));

	let foo = ctx.on('hello', pusher('foo'));
	t.is(typeof foo, 'function', '(foo) returned unsubscriber');

	let bar = ctx.on('hello', pusher('bar'));
	t.is(typeof bar, 'function', '(bar) returned unsubscriber');

	console.log('$.set()');
	ctx.set({ foo: 123 });
	t.same(order, ['listen'], '~> triggers listeners only');

	order = [];
	console.log('$.dispatch x1');
	await ctx.dispatch('hello', { foo: 123 });
	t.same(order, ['foo', 'bar', 'listen'], '~> hooks before listeners');

	// swap foo & bar order
	foo(); ctx.on('hello', pusher('foo'));

	order = [];
	console.log('$.dispatch x2');
	await ctx.dispatch('hello', { foo: 123 });
	t.same(order, ['bar', 'foo', 'listen'], '~> hooks before listeners');

	t.end();
});

test('$.on :: mutator', async t => {
	t.plan(9);

	let curr = { num: 11 };
	let evt = { value: 3 };
	let ctx = lib(curr);

	ctx.on('increment', state => {
		state.num++;
		t.deepEqual(ctx.state, curr, '(increment) IMMUTABLE');
	});

	ctx.on('subtract', (state, event) => {
		t.deepEqual(event, evt, '~> hook received event data');
		state.num -= event.value;
		t.deepEqual(ctx.state, curr, '(subtract) IMMUTABLE');
	});

	await ctx.dispatch('increment');
	t.deepEqual(ctx.state, curr = { num: 12 }, '~> increment');

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, curr = { num: 9 }, '~> subtract x1');

	ctx.on('subtract', (state) => {
		state.num = 0;
		t.deepEqual(ctx.state, curr, '(subtract) IMMUTABLE');
	});

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, curr = { num: 0 }, '~> subtract x2');
});

test('$.on :: return object', async t => {
	t.plan(5);

	let ctx = lib({ num: 11 });
	let evt = { value: 3 };

	ctx.on('increment', state => {
		let num = state.num + 1;
		return { num };
	});

	ctx.on('subtract', (state, event) => {
		t.deepEqual(event, evt, '~> hook received event data');
		let num = state.num - event.value;
		return { num };
	});

	await ctx.dispatch('increment');
	t.deepEqual(ctx.state, { num: 12 }, '~> increment');

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, { num: 9 }, '~> subtract x1');

	ctx.on('subtract', (state) => {
		return { num: 0 };
	});

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, { num: 0 }, '~> subtract x2');

	t.end();
});

test('$.on :: return Promise', async t => {
	t.plan(5);

	let evt = { value: 3 };
	let ctx = lib({ num: 11 });
	let sleep = ms => new Promise(r => setTimeout(r, ms));

	ctx.on('increment', state => {
		return sleep(2).then(() => ({ num: state.num + 1 }));
	});

	ctx.on('subtract', (state, event) => {
		t.deepEqual(event, evt, '~> hook received event data');
		return sleep(2).then(() => ({ num: state.num - event.value }));
	});

	await ctx.dispatch('increment');
	t.deepEqual(ctx.state, { num: 12 }, '~> increment');

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, { num: 9 }, '~> subtract x1');

	ctx.on('subtract', async (state) => {
		await sleep(2);
		return { num: 0 };
	});

	await ctx.dispatch('subtract', evt);
	t.deepEqual(ctx.state, { num: 0 }, '~> subtract x2');

	t.end();
});
