export type Listener<T> = (state: T) => any;
export type Handler<T, X> = (state: T, data: X) => T | void;

export interface Store<T, M> {
	readonly state: T;
	set(state: T): void;
	on<K extends keyof M>(event: K, handler: Handler<T, M[K]>): void;
	dispatch<K extends keyof M>(event: K, data: M[K]): Promise<void>;
	listen(func: Listener<T>): void;
}

export default function<M, T>(obj: T): Store<T, M>;
