export type Handler<T, X> = (state: T, data: X) => T | void;
export type Listener<T> = (state: T, prevState: T) => any;
export type Unsubscriber = () => void;

export interface Store<T, M> {
	readonly state: T;

	set(state: T): void;
	set<K extends keyof M>(state: T, event: K | '*'): void;

	on<K extends keyof M>(event: K, handler: Handler<T, M[K]>): Unsubscriber;
	dispatch<K extends keyof M>(event: K, data: M[K]): Promise<void>;

	listen(func: Listener<T>): Unsubscriber;
	listen<K extends keyof M>(event: K | '*', func: Listener<T>): Unsubscriber;
}

export default function<M, T>(obj?: T): Store<T, M>;
